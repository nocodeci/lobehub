import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/coder/auth - Login or register coder
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, email, password, name, phone } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (action === 'register') {
            // Check if email already exists
            const existing = await prisma.vibeCoder.findUnique({
                where: { email },
            });

            if (existing) {
                return NextResponse.json(
                    { success: false, error: 'Email already registered' },
                    { status: 400 }
                );
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create new coder
            const coder = await prisma.vibeCoder.create({
                data: {
                    name: name || `Vibe Coder`,
                    email,
                    phone,
                    password: hashedPassword,
                    specialty: ['custom'],
                },
            });

            // Update name with coder number
            await prisma.vibeCoder.update({
                where: { id: coder.id },
                data: { name: `Vibe Coder #${coder.coderNumber}` },
            });

            return NextResponse.json({
                success: true,
                coder: {
                    id: coder.id,
                    coderNumber: coder.coderNumber,
                    name: `Vibe Coder #${coder.coderNumber}`,
                    email: coder.email,
                    level: coder.level,
                },
                message: 'Account created successfully',
            });
        } else {
            // Login
            const coder = await prisma.vibeCoder.findUnique({
                where: { email },
            });

            if (!coder) {
                return NextResponse.json(
                    { success: false, error: 'Invalid email or password' },
                    { status: 401 }
                );
            }

            const isValid = await bcrypt.compare(password, coder.password);

            if (!isValid) {
                return NextResponse.json(
                    { success: false, error: 'Invalid email or password' },
                    { status: 401 }
                );
            }

            // Update status to online
            await prisma.vibeCoder.update({
                where: { id: coder.id },
                data: { status: 'online' },
            });

            return NextResponse.json({
                success: true,
                coder: {
                    id: coder.id,
                    coderNumber: coder.coderNumber,
                    name: coder.name,
                    email: coder.email,
                    level: coder.level,
                    rating: coder.rating,
                    totalProjects: coder.totalProjects,
                },
                message: 'Login successful',
            });
        }
    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
