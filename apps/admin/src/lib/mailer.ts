const MAILTRAP_API_URL = 'https://send.api.mailtrap.io/api/send';
const MAILTRAP_TOKEN = process.env.MAILTRAP_API_TOKEN || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const FROM_EMAIL = process.env.MAILTRAP_FROM || 'hello@wozif.com';
const FROM_NAME_ADMIN = 'Connect Admin';
const FROM_NAME_USER = 'Connect by Wozif';
const CONNECT_APP_URL = 'https://app.connect.wozif.com';

interface EmailOptions {
    subject: string;
    html: string;
    to?: string;
}

async function sendEmail(to: string, subject: string, html: string, fromName: string, category: string) {
    if (!MAILTRAP_TOKEN) {
        console.error('❌ MAILTRAP_API_TOKEN not configured');
        return false;
    }
    try {
        const res = await fetch(MAILTRAP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MAILTRAP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: { email: FROM_EMAIL, name: fromName },
                to: [{ email: to }],
                subject,
                html,
                category,
            }),
        });
        if (!res.ok) {
            const errBody = await res.text();
            console.error(`❌ Mailtrap error ${res.status}:`, errBody);
            return false;
        }
        console.log(`✉️ Email sent → ${to}: ${subject}`);
        return true;
    } catch (error: any) {
        console.error('❌ Email send failed:', error.message);
        return false;
    }
}

export async function sendAdminEmail({ subject, html, to }: EmailOptions) {
    return sendEmail(to || ADMIN_EMAIL, `[Connect] ${subject}`, wrapAdminTemplate(subject, html), FROM_NAME_ADMIN, 'Admin Notification');
}

export async function sendUserNotification(userEmail: string, subject: string, html: string) {
    return sendEmail(userEmail, subject, wrapUserTemplate(subject, html), FROM_NAME_USER, 'User Notification');
}

function wrapAdminTemplate(title: string, content: string) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px 16px 0 0;padding:24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;">Connect Admin</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;">${title}</p>
    </div>
    <div style="background:#111;border:1px solid #222;border-top:none;border-radius:0 0 16px 16px;padding:24px;color:#e4e4e7;">
        ${content}
    </div>
    <p style="text-align:center;color:#52525b;font-size:11px;margin-top:16px;">Wozif Admin Dashboard — Notification automatique</p>
</div>
</body>
</html>`;
}

function wrapUserTemplate(title: string, content: string) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px 16px 0 0;padding:28px 24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Connect</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${title}</p>
    </div>
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:28px 24px;color:#1f2937;">
        ${content}
    </div>
    <div style="background:#f3f4f6;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:16px 24px;text-align:center;">
        <a href="${CONNECT_APP_URL}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Ouvrir Connect</a>
        <p style="margin:12px 0 0;color:#9ca3af;font-size:11px;">Connect by Wozif — Automatisez votre business avec l'IA</p>
    </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════
// NOTIFICATION TEMPLATES
// ═══════════════════════════════════════════════

export async function emailNewUser(user: { email: string; fullName: string; createdAt: string }) {
    // Admin notification
    const adminSent = await sendAdminEmail({
        subject: `🆕 Nouvel utilisateur: ${user.fullName || user.email}`,
        html: `
            <h2 style="color:#f97316;margin:0 0 16px;">Nouvel utilisateur inscrit</h2>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Nom</td><td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600;">${user.fullName || 'Non renseigné'}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Email</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Date</td><td style="padding:8px 0;color:#fff;font-size:13px;">${new Date(user.createdAt).toLocaleString('fr-FR')}</td></tr>
            </table>
        `,
    });

    // User welcome email
    await sendUserNotification(user.email, 'Bienvenue sur Connect ! 🎉', `
        <h2 style="color:#f97316;margin:0 0 8px;font-size:22px;">Bienvenue ${user.fullName || ''} !</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 20px;">Merci de rejoindre <strong>Connect</strong>. Votre compte est prêt et vous pouvez commencer à créer vos agents IA dès maintenant.</p>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin:0 0 20px;">
            <p style="color:#9a3412;font-size:13px;font-weight:600;margin:0 0 8px;">🚀 Pour bien démarrer :</p>
            <ul style="color:#78350f;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
                <li>Créez votre premier <strong>agent WhatsApp</strong></li>
                <li>Configurez votre modèle IA (GPT-4o, Claude, DeepSeek...)</li>
                <li>Connectez votre numéro WhatsApp</li>
            </ul>
        </div>
        <p style="color:#6b7280;font-size:12px;">Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:hello@wozif.com" style="color:#f97316;">hello@wozif.com</a></p>
    `);

    return adminSent;
}

export async function emailNewBYOKKey(user: { email: string; fullName: string }, provider: string) {
    // Admin notification
    const adminSent = await sendAdminEmail({
        subject: `🔑 Clé API ajoutée: ${user.fullName || user.email} → ${provider}`,
        html: `
            <h2 style="color:#a855f7;margin:0 0 16px;">Nouvelle clé API (BYOK)</h2>
            <p style="color:#d4d4d8;font-size:14px;">Un utilisateur a ajouté sa propre clé API.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Provider</td><td style="padding:8px 0;color:#a855f7;font-size:13px;font-weight:600;">${provider}</td></tr>
            </table>
        `,
    });

    // User confirmation email
    await sendUserNotification(user.email, `Clé API ${provider} configurée ✅`, `
        <h2 style="color:#a855f7;margin:0 0 8px;font-size:20px;">Clé API configurée avec succès</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Votre clé API <strong>${provider}</strong> a bien été enregistrée sur Connect.</p>
        <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;margin:0 0 16px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#7c3aed;font-size:13px;font-weight:600;">Provider</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${provider}</td></tr>
                <tr><td style="padding:6px 0;color:#7c3aed;font-size:13px;font-weight:600;">Statut</td><td style="padding:6px 0;color:#059669;font-size:13px;font-weight:600;">✅ Active</td></tr>
            </table>
        </div>
        <p style="color:#6b7280;font-size:12px;">Vos agents utiliseront désormais cette clé pour les requêtes IA via ${provider}. En cas de problème, vous recevrez une notification.</p>
    `);

    return adminSent;
}

export async function emailKeyFailure(user: { email: string; fullName: string }, provider: string, model: string, errorMsg: string) {
    // Admin notification
    const adminSent = await sendAdminEmail({
        subject: `⚠️ Clé API en échec: ${provider} (${user.fullName || user.email})`,
        html: `
            <h2 style="color:#f59e0b;margin:0 0 16px;">Clé API ne fonctionne plus</h2>
            <p style="color:#d4d4d8;font-size:14px;">Une clé API utilisateur génère des erreurs d'authentification.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Provider</td><td style="padding:8px 0;color:#f59e0b;font-size:13px;font-weight:600;">${provider}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Modèle</td><td style="padding:8px 0;color:#fff;font-size:13px;">${model}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Erreur</td><td style="padding:8px 0;color:#ef4444;font-size:13px;">${errorMsg}</td></tr>
            </table>
        `,
    });

    // User alert email
    await sendUserNotification(user.email, `⚠️ Problème avec votre clé API ${provider}`, `
        <h2 style="color:#d97706;margin:0 0 8px;font-size:20px;">Votre clé API rencontre un problème</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Nous avons détecté une erreur avec votre clé API <strong>${provider}</strong>. Vos agents ne peuvent plus générer de réponses avec ce provider.</p>
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin:0 0 16px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#92400e;font-size:13px;font-weight:600;">Provider</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${provider}</td></tr>
                <tr><td style="padding:6px 0;color:#92400e;font-size:13px;font-weight:600;">Modèle</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${model}</td></tr>
                <tr><td style="padding:6px 0;color:#92400e;font-size:13px;font-weight:600;">Erreur</td><td style="padding:6px 0;color:#dc2626;font-size:13px;">${errorMsg}</td></tr>
            </table>
        </div>
        <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:12px;margin:0 0 16px;">
            <p style="color:#854d0e;font-size:13px;margin:0;"><strong>💡 Actions recommandées :</strong></p>
            <ul style="color:#854d0e;font-size:12px;margin:8px 0 0;padding-left:20px;line-height:1.8;">
                <li>Vérifiez que votre clé API est encore valide sur le site de ${provider}</li>
                <li>Vérifiez votre solde/quota sur votre compte ${provider}</li>
                <li>Mettez à jour votre clé dans les paramètres Connect</li>
            </ul>
        </div>
    `);

    return adminSent;
}

export function emailAIError(count: number, topErrors: { provider: string; model: string; errorMsg: string; userEmail: string }[]) {
    const errorRows = topErrors.map(e => `
        <tr>
            <td style="padding:6px 8px;color:#fff;font-size:12px;border-bottom:1px solid #222;">${e.provider}</td>
            <td style="padding:6px 8px;color:#d4d4d8;font-size:12px;border-bottom:1px solid #222;">${e.model}</td>
            <td style="padding:6px 8px;color:#ef4444;font-size:12px;border-bottom:1px solid #222;max-width:200px;overflow:hidden;text-overflow:ellipsis;">${e.errorMsg}</td>
            <td style="padding:6px 8px;color:#a1a1aa;font-size:12px;border-bottom:1px solid #222;">${e.userEmail}</td>
        </tr>
    `).join('');

    return sendAdminEmail({
        subject: `🚨 ${count} erreur${count > 1 ? 's' : ''} IA détectée${count > 1 ? 's' : ''}`,
        html: `
            <h2 style="color:#ef4444;margin:0 0 8px;">${count} erreur${count > 1 ? 's' : ''} IA</h2>
            <p style="color:#a1a1aa;font-size:13px;margin:0 0 16px;">Erreurs détectées dans les dernières minutes.</p>
            <table style="width:100%;border-collapse:collapse;background:#0a0a0a;border-radius:8px;overflow:hidden;">
                <thead><tr style="background:#1a1a1a;">
                    <th style="padding:8px;color:#71717a;font-size:11px;text-align:left;">Provider</th>
                    <th style="padding:8px;color:#71717a;font-size:11px;text-align:left;">Modèle</th>
                    <th style="padding:8px;color:#71717a;font-size:11px;text-align:left;">Erreur</th>
                    <th style="padding:8px;color:#71717a;font-size:11px;text-align:left;">User</th>
                </tr></thead>
                <tbody>${errorRows}</tbody>
            </table>
        `,
    });
}

export async function emailAgentPublished(user: { email: string; fullName: string }, agent: { title: string; model: string; provider: string }) {
    // Admin notification
    const adminSent = await sendAdminEmail({
        subject: `🤖 Agent publié: ${agent.title} par ${user.fullName || user.email}`,
        html: `
            <h2 style="color:#a855f7;margin:0 0 16px;">Nouvel agent créé</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Agent</td><td style="padding:8px 0;color:#a855f7;font-size:13px;font-weight:700;">${agent.title || 'Sans titre'}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Modèle</td><td style="padding:8px 0;color:#fff;font-size:13px;">${agent.model || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Provider</td><td style="padding:8px 0;color:#fff;font-size:13px;">${agent.provider || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Créé par</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.fullName || user.email}</td></tr>
            </table>
        `,
    });

    // User confirmation email
    await sendUserNotification(user.email, `Votre agent "${agent.title || 'Sans titre'}" est prêt ! 🤖`, `
        <h2 style="color:#7c3aed;margin:0 0 8px;font-size:20px;">Agent créé avec succès !</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Votre nouvel agent IA est configuré et prêt à répondre.</p>
        <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:16px;margin:0 0 16px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#7c3aed;font-size:13px;font-weight:600;">Nom</td><td style="padding:6px 0;color:#1f2937;font-size:13px;font-weight:700;">${agent.title || 'Sans titre'}</td></tr>
                <tr><td style="padding:6px 0;color:#7c3aed;font-size:13px;font-weight:600;">Modèle IA</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${agent.model || 'Par défaut'}</td></tr>
                <tr><td style="padding:6px 0;color:#7c3aed;font-size:13px;font-weight:600;">Provider</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${agent.provider || 'Par défaut'}</td></tr>
            </table>
        </div>
        <p style="color:#6b7280;font-size:12px;">Vous pouvez maintenant connecter cet agent à WhatsApp ou l'utiliser directement dans l'application.</p>
    `);

    return adminSent;
}

export function emailBridgeDown(bridgeUrl: string, error: string) {
    return sendAdminEmail({
        subject: `🔴 WhatsApp Bridge DÉCONNECTÉ`,
        html: `
            <h2 style="color:#ef4444;margin:0 0 16px;">⚠️ WhatsApp Bridge hors ligne</h2>
            <p style="color:#d4d4d8;font-size:14px;">Le bridge WhatsApp ne répond plus.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">URL</td><td style="padding:8px 0;color:#fff;font-size:13px;">${bridgeUrl}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Erreur</td><td style="padding:8px 0;color:#ef4444;font-size:13px;">${error}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Détecté à</td><td style="padding:8px 0;color:#fff;font-size:13px;">${new Date().toLocaleString('fr-FR')}</td></tr>
            </table>
            <div style="margin-top:16px;padding:12px;background:#1c1917;border:1px solid #ef444433;border-radius:8px;">
                <p style="color:#fca5a5;font-size:12px;margin:0;">Action requise : vérifier le déploiement Render et redémarrer si nécessaire.</p>
            </div>
        `,
    });
}

export function emailBridgeBackOnline(bridgeUrl: string) {
    return sendAdminEmail({
        subject: `🟢 WhatsApp Bridge de retour en ligne`,
        html: `
            <h2 style="color:#10b981;margin:0 0 16px;">✅ WhatsApp Bridge reconnecté</h2>
            <p style="color:#d4d4d8;font-size:14px;">Le bridge est de nouveau opérationnel.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">URL</td><td style="padding:8px 0;color:#fff;font-size:13px;">${bridgeUrl}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Rétabli à</td><td style="padding:8px 0;color:#10b981;font-size:13px;">${new Date().toLocaleString('fr-FR')}</td></tr>
            </table>
        `,
    });
}

// ═══════════════════════════════════════════════
// SUBSCRIPTION EMAIL TEMPLATES
// ═══════════════════════════════════════════════

const PLAN_NAMES: Record<string, string> = { free: 'Gratuit', starter: 'Starter', pro: 'Pro', business: 'Business', enterprise: 'Enterprise' };
const PLAN_PRICES: Record<string, number> = { free: 0, starter: 29, pro: 79, business: 199, enterprise: 499 };

export async function emailNewSubscription(user: { email: string; fullName: string }, plan: string) {
    const planName = PLAN_NAMES[plan] || plan;
    const price = PLAN_PRICES[plan] || 0;

    await sendAdminEmail({
        subject: `💳 Nouvel abonnement: ${user.fullName || user.email} → ${planName}`,
        html: `
            <h2 style="color:#10b981;margin:0 0 16px;">Nouvel abonnement souscrit</h2>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Plan</td><td style="padding:8px 0;color:#10b981;font-size:13px;font-weight:700;">${planName}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Prix</td><td style="padding:8px 0;color:#fff;font-size:13px;">${price}€/mois</td></tr>
            </table>
        `,
    });

    await sendUserNotification(user.email, `Bienvenue sur le plan ${planName} ! 🎉`, `
        <h2 style="color:#059669;margin:0 0 8px;font-size:22px;">Abonnement ${planName} activé !</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 20px;">Merci pour votre confiance ! Votre plan <strong>${planName}</strong> est maintenant actif.</p>
        <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:16px;margin:0 0 20px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#047857;font-size:13px;font-weight:600;">Plan</td><td style="padding:6px 0;color:#1f2937;font-size:13px;font-weight:700;">${planName}</td></tr>
                <tr><td style="padding:6px 0;color:#047857;font-size:13px;font-weight:600;">Prix</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${price}€/mois</td></tr>
                <tr><td style="padding:6px 0;color:#047857;font-size:13px;font-weight:600;">Statut</td><td style="padding:6px 0;color:#059669;font-size:13px;font-weight:700;">✅ Actif</td></tr>
            </table>
        </div>
        <p style="color:#6b7280;font-size:12px;">Vous avez maintenant accès à toutes les fonctionnalités de votre plan. Profitez-en !</p>
    `);

    return true;
}

export async function emailSubscriptionRenewed(user: { email: string; fullName: string }, plan: string) {
    const planName = PLAN_NAMES[plan] || plan;
    const price = PLAN_PRICES[plan] || 0;

    await sendAdminEmail({
        subject: `🔄 Abonnement renouvelé: ${user.fullName || user.email} — ${planName}`,
        html: `
            <h2 style="color:#3b82f6;margin:0 0 16px;">Abonnement renouvelé</h2>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Plan</td><td style="padding:8px 0;color:#3b82f6;font-size:13px;font-weight:600;">${planName}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Montant</td><td style="padding:8px 0;color:#fff;font-size:13px;">${price}€</td></tr>
            </table>
        `,
    });

    await sendUserNotification(user.email, `Abonnement ${planName} renouvelé ✅`, `
        <h2 style="color:#2563eb;margin:0 0 8px;font-size:20px;">Abonnement renouvelé avec succès</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Votre abonnement <strong>${planName}</strong> a été renouvelé automatiquement.</p>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;margin:0 0 16px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#1d4ed8;font-size:13px;font-weight:600;">Plan</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${planName}</td></tr>
                <tr><td style="padding:6px 0;color:#1d4ed8;font-size:13px;font-weight:600;">Montant</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">${price}€</td></tr>
                <tr><td style="padding:6px 0;color:#1d4ed8;font-size:13px;font-weight:600;">Prochain renouvellement</td><td style="padding:6px 0;color:#1f2937;font-size:13px;">Dans 30 jours</td></tr>
            </table>
        </div>
    `);

    return true;
}

export async function emailSubscriptionCancelled(user: { email: string; fullName: string }, plan: string) {
    const planName = PLAN_NAMES[plan] || plan;

    await sendAdminEmail({
        subject: `❌ Abonnement annulé: ${user.fullName || user.email} — ${planName}`,
        html: `
            <h2 style="color:#ef4444;margin:0 0 16px;">Abonnement annulé</h2>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Plan annulé</td><td style="padding:8px 0;color:#ef4444;font-size:13px;font-weight:600;">${planName}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Nouveau plan</td><td style="padding:8px 0;color:#71717a;font-size:13px;">Gratuit</td></tr>
            </table>
        `,
    });

    await sendUserNotification(user.email, `Votre abonnement ${planName} a été annulé`, `
        <h2 style="color:#dc2626;margin:0 0 8px;font-size:20px;">Abonnement annulé</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Votre abonnement <strong>${planName}</strong> a été annulé. Vous êtes maintenant sur le plan <strong>Gratuit</strong>.</p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:0 0 16px;">
            <p style="color:#991b1b;font-size:13px;font-weight:600;margin:0 0 8px;">Ce que vous perdez :</p>
            <ul style="color:#991b1b;font-size:12px;margin:0;padding-left:20px;line-height:1.8;">
                <li>Limite réduite à 1 agent et 250 crédits/mois</li>
                <li>Pas d'accès BYOK (vos propres clés API)</li>
                <li>Stockage limité à 500 MB</li>
            </ul>
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin:0 0 16px;">
            <p style="color:#166534;font-size:13px;margin:0;">Vous pouvez réactiver votre abonnement à tout moment depuis votre tableau de bord Connect.</p>
        </div>
    `);

    return true;
}

export async function emailPaymentFailed(user: { email: string; fullName: string }, plan: string) {
    const planName = PLAN_NAMES[plan] || plan;

    await sendAdminEmail({
        subject: `🚨 Paiement échoué: ${user.fullName || user.email} — ${planName}`,
        html: `
            <h2 style="color:#ef4444;margin:0 0 16px;">Paiement échoué</h2>
            <p style="color:#d4d4d8;font-size:14px;">Le renouvellement de l'abonnement a échoué. L'utilisateur sera rétrogradé en Gratuit après 3 jours.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Plan</td><td style="padding:8px 0;color:#f59e0b;font-size:13px;font-weight:600;">${planName}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Deadline</td><td style="padding:8px 0;color:#ef4444;font-size:13px;">3 jours pour régulariser</td></tr>
            </table>
        `,
    });

    await sendUserNotification(user.email, `⚠️ Échec de paiement — Action requise`, `
        <h2 style="color:#dc2626;margin:0 0 8px;font-size:20px;">Échec de paiement</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Le renouvellement de votre abonnement <strong>${planName}</strong> a échoué. Veuillez mettre à jour votre moyen de paiement.</p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:0 0 16px;">
            <p style="color:#991b1b;font-size:13px;font-weight:600;margin:0 0 8px;">⏰ Important :</p>
            <p style="color:#991b1b;font-size:13px;margin:0;">Si le paiement n'est pas régularisé dans les <strong>3 jours</strong>, votre compte sera automatiquement rétrogradé au plan <strong>Gratuit</strong> et vous perdrez l'accès à vos fonctionnalités premium.</p>
        </div>
        <div style="text-align:center;margin:20px 0;">
            <a href="${CONNECT_APP_URL}/subscription" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Mettre à jour le paiement</a>
        </div>
    `);

    return true;
}

export async function emailAutoDowngrade(user: { email: string; fullName: string }, oldPlan: string) {
    const planName = PLAN_NAMES[oldPlan] || oldPlan;

    await sendAdminEmail({
        subject: `⬇️ Auto-downgrade: ${user.fullName || user.email} — ${planName} → Gratuit`,
        html: `
            <h2 style="color:#ef4444;margin:0 0 16px;">Rétrogradation automatique</h2>
            <p style="color:#d4d4d8;font-size:14px;">L'utilisateur n'a pas régularisé son paiement dans les 3 jours.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-size:13px;">${user.fullName || user.email}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Ancien plan</td><td style="padding:8px 0;color:#ef4444;font-size:13px;text-decoration:line-through;">${planName}</td></tr>
                <tr><td style="padding:8px 0;color:#a1a1aa;font-size:13px;">Nouveau plan</td><td style="padding:8px 0;color:#71717a;font-size:13px;">Gratuit</td></tr>
            </table>
        `,
    });

    await sendUserNotification(user.email, `Votre abonnement ${planName} a été désactivé`, `
        <h2 style="color:#dc2626;margin:0 0 8px;font-size:20px;">Abonnement désactivé</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;">Votre abonnement <strong>${planName}</strong> a été désactivé car votre paiement n'a pas été régularisé dans les 3 jours.</p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:0 0 16px;">
            <p style="color:#991b1b;font-size:13px;margin:0;">Vous êtes maintenant sur le plan <strong>Gratuit</strong> avec les limites suivantes :</p>
            <ul style="color:#991b1b;font-size:12px;margin:8px 0 0;padding-left:20px;line-height:1.8;">
                <li>1 seul agent WhatsApp</li>
                <li>250 crédits/mois (~25 messages)</li>
                <li>500 MB de stockage</li>
                <li>Pas d'accès BYOK</li>
            </ul>
        </div>
        <div style="text-align:center;margin:20px 0;">
            <a href="${CONNECT_APP_URL}/subscription" style="display:inline-block;background:#f97316;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Réactiver mon abonnement</a>
        </div>
    `);

    return true;
}
