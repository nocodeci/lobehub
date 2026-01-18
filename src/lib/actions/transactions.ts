"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PaymentOrchestratorFactory } from "@/lib/orchestrator/factory";
import { PayDunyaAdapter } from "@/lib/orchestrator/adapters/paydunya.adapter";
import { getSelectedAppId } from "./utils";

/**
 * Fetches a single transaction by its ID (Public version for checkout)
 */
export async function getPublicTransaction(id: string) {
    try {
        const transaction = await prisma.paymentRecord.findUnique({
            where: { id },
            include: {
                application: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                                country: true,
                            }
                        }
                    }
                }
            }
        });
        return transaction;
    } catch (error) {
        console.error("Error fetching public transaction:", error);
        return null;
    }
}

/**
 * Fetches a single transaction by its ID (Private version for dashboard)
 */
export async function getTransactionById(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return null;

        const appId = await getSelectedAppId();
        if (!appId) return null;

        const transaction = await prisma.paymentRecord.findFirst({
            where: { id, applicationId: appId }
        });
        return transaction;
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return null;
    }
}

/**
 * Syncs a single transaction status with the provider
 */
export async function syncTransactionStatus(transactionId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const transaction = await prisma.paymentRecord.findUnique({
            where: { id: transactionId }
        });

        if (!transaction) {
            throw new Error("Transaction not found");
        }

        // Find the gateway for this provider
        const gateway = await prisma.gateway.findFirst({
            where: { applicationId: transaction.applicationId, name: transaction.provider }
        });

        if (!gateway) {
            throw new Error("Gateway configuration not found for " + transaction.provider);
        }

        // If it's already finalized, no need to sync unless forced
        if (transaction.status === 'SUCCESS') return { status: 'SUCCESS' };

        if (!transaction.providerRef) {
            // If no provider ref, it's likely a stalled initiation
            // Check if it's old enough to mark as failed
            const isOld = (new Date().getTime() - new Date(transaction.createdAt).getTime()) > 1000 * 60 * 30; // 30 mins
            if (isOld) {
                await prisma.paymentRecord.update({
                    where: { id: transaction.id },
                    data: { status: 'FAILED' }
                });
                return { status: 'FAILED' };
            }
            return { status: transaction.status };
        }

        // Initialize adapter with provider-specific configuration
        const gConfig = gateway.config as any;
        let adapterConfig: any = { mode: gConfig?.mode || 'live' };

        const provider = (transaction.provider || 'paydunya').toLowerCase();

        if (provider === 'paydunya') {
            adapterConfig = {
                ...adapterConfig,
                masterKey: gConfig?.masterKey || gateway.apiKey,
                privateKey: gConfig?.privateKey || gateway.apiSecret,
                publicKey: gConfig?.publicKey || "",
                token: gConfig?.token || ""
            };
        } else if (provider === 'pawapay') {
            adapterConfig = {
                ...adapterConfig,
                apiKey: gConfig?.apiKey || gateway.apiKey
            };
        }

        const adapter = PaymentOrchestratorFactory.getProvider(provider, adapterConfig);

        console.log(`🔍 Syncing transaction ${transaction.orderId} via ${provider} (ref: ${transaction.providerRef})...`);
        const verification = await adapter.verifyPayment(transaction.providerRef);
        console.log(`🎯 Status detected: ${verification.status}`);

        // Update DB
        await prisma.paymentRecord.update({
            where: { id: transactionId },
            data: {
                status: verification.status,
                completedAt: verification.status === 'SUCCESS' ? new Date() : transaction.completedAt,
            }
        });

        // Log the sync attempt
        try {
            await (prisma as any).providerLog.create({
                data: {
                    transactionId,
                    type: 'SYNC_CHECK',
                    payload: JSON.parse(JSON.stringify(verification.rawData || { status: verification.status }))
                }
            });
        } catch (e) { }

        return { status: verification.status };
    } catch (error: any) {
        console.error("Failed to sync transaction:", error);
        return { error: error.message };
    }
}

/**
 * Syncs all PENDING transactions that are older than 5 minutes
 */
export async function syncAllPendingTransactions() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { count: 0 };

        const appId = await getSelectedAppId();
        if (!appId) return { count: 0 };

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const pendingTransactions = await prisma.paymentRecord.findMany({
            where: {
                applicationId: appId,
                status: 'PENDING',
                createdAt: { lt: fiveMinutesAgo }
            },
            take: 10
        });

        console.log(`🔄 Found ${pendingTransactions.length} pending transactions to sync for application ${appId}`);

        let syncCount = 0;
        for (const tx of pendingTransactions) {
            await syncTransactionStatus(tx.id);
            syncCount++;
        }

        return { count: syncCount };
    } catch (error) {
        console.error("Failed to sync pending transactions:", error);
        return { count: 0 };
    }
}
/**
 * Fetches paginated transactions with filtering
 */
export async function getTransactions(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const { page = 1, pageSize = 10, search, status } = params;
        const skip = (page - 1) * pageSize;

        const where: any = { applicationId: appId };

        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { customerEmail: { contains: search, mode: 'insensitive' } },
                { orderId: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [transactions, total] = await Promise.all([
            prisma.paymentRecord.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.paymentRecord.count({ where })
        ]);

        return {
            transactions: transactions.map((tx: any) => {
                const pType = (tx.paymentType || '').toLowerCase();
                const isMobile = pType.includes('mobile') || pType.includes('money') || pType.includes('orange') || pType.includes('mtn') || pType.includes('moov') || pType.includes('wave');

                return {
                    id: tx.id,
                    customer: tx.customerName,
                    email: tx.customerEmail,
                    date: new Date(tx.createdAt).toLocaleString('fr-FR'),
                    method: isMobile ? 'Mobile Money' : 'Carte',
                    gateway: tx.provider,
                    amount: `${tx.amount.toLocaleString()} ${tx.currency}`,
                    status: tx.status.toLowerCase()
                };
            }),
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return {
            transactions: [],
            pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 }
        };
    }
}

/**
 * Fetches summary stats for the transactions page
 */
export async function getTransactionStats() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [successToday, pending, failed24h] = await Promise.all([
            prisma.paymentRecord.aggregate({
                where: { applicationId: appId, status: 'SUCCESS', createdAt: { gte: startOfToday } },
                _sum: { amount: true }
            }),
            prisma.paymentRecord.aggregate({
                where: { applicationId: appId, status: 'PENDING' },
                _sum: { amount: true }
            }),
            prisma.paymentRecord.aggregate({
                where: { applicationId: appId, status: 'FAILED', createdAt: { gte: twentyFourHoursAgo } },
                _sum: { amount: true }
            })
        ]);

        return {
            successToday: `${(successToday._sum.amount || 0).toLocaleString()} FCFA`,
            pending: `${(pending._sum.amount || 0).toLocaleString()} FCFA`,
            failed24h: `${(failed24h._sum.amount || 0).toLocaleString()} FCFA`
        };
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        return {
            successToday: "0 FCFA",
            pending: "0 FCFA",
            failed24h: "0 FCFA"
        };
    }
}
/**
 * Fetches logs for a technical audit of a transaction
 */
export async function getTransactionLogs(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const logs = await (prisma as any).providerLog.findMany({
            where: { transactionId: id },
            orderBy: { timestamp: 'desc' }
        });

        return logs;
    } catch (error) {
        console.error("Error fetching transaction logs:", error);
        return [];
    }
}
