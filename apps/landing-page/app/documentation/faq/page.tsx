'use client';

import React from 'react';
import { Collapse, Card, Typography } from 'antd';
import { Flexbox, Button } from '@lobehub/ui';
import { HelpCircle, Headphones, Mail, ArrowUpRight } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

const { Title, Paragraph } = Typography;

export default function FAQPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <HelpCircle size={28} style={{ color: '#075e54' }} />
                    Questions fréquentes
                </h1>

                <Collapse
                    size="large"
                    expandIconPosition="end"
                    style={{ background: '#fff', borderRadius: 16 }}
                    items={[
                        {
                            key: '1',
                            label: <strong>Connect est-il gratuit ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Oui ! Le plan Gratuit vous donne accès à 1 agent WhatsApp et 250 crédits/mois. C'est idéal pour tester la plateforme. Pour un usage professionnel, nous recommandons le plan Starter (29€/mois) ou Pro (79€/mois).</p>,
                        },
                        {
                            key: '2',
                            label: <strong>Qu'est-ce qu'un crédit ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Un crédit est une unité de consommation qui correspond aux tokens traités par les modèles IA. Chaque modèle a un coût différent en crédits. Par exemple, GPT-4o mini consomme 0.15M crédits pour 1M tokens en entrée, tandis que GPT-4o en consomme 2.5M. Les crédits se renouvellent chaque mois.</p>,
                        },
                        {
                            key: '3',
                            label: <strong>Ai-je besoin d'un compte WhatsApp Business ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Non. Connect se connecte directement à votre WhatsApp personnel ou professionnel standard via un QR code, exactement comme WhatsApp Web. Aucun compte WhatsApp Business API n'est nécessaire.</p>,
                        },
                        {
                            key: '4',
                            label: <strong>Qu'est-ce que le BYOK ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>BYOK signifie "Bring Your Own Key" (Apportez votre propre clé). Cela vous permet d'utiliser vos propres clés API des providers IA (OpenAI, Anthropic, etc.) au lieu de consommer des crédits Connect. Disponible à partir du plan Pro, le BYOK offre une réduction de 50% sur l'abonnement.</p>,
                        },
                        {
                            key: '5',
                            label: <strong>Combien d'agents puis-je créer ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Cela dépend de votre plan : Gratuit (1 agent), Starter (3 agents), Pro (10 agents), Business (50 agents), Enterprise (illimité). Chaque agent peut être configuré indépendamment avec son propre modèle IA, prompt et base de connaissances.</p>,
                        },
                        {
                            key: '6',
                            label: <strong>Les crédits sont-ils réinitialisés chaque mois ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Oui. Vos crédits sont réinitialisés à la date anniversaire de votre abonnement. Les crédits non utilisés ne sont pas reportés au mois suivant. Si vous avez besoin de plus de crédits, vous pouvez en acheter à tout moment.</p>,
                        },
                        {
                            key: '7',
                            label: <strong>Puis-je changer de plan à tout moment ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Oui. Vous pouvez upgrader votre plan à tout moment. Le prorata est calculé automatiquement. Pour un downgrade, le changement prend effet à la fin de la période de facturation en cours.</p>,
                        },
                        {
                            key: '8',
                            label: <strong>Comment fonctionne la base de connaissances ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>La base de connaissances utilise la technologie RAG (Retrieval-Augmented Generation). Vos documents sont découpés en morceaux, convertis en vecteurs, puis stockés. Quand un utilisateur pose une question, Connect cherche les passages les plus pertinents et les envoie au modèle IA avec le message pour générer une réponse contextualisée.</p>,
                        },
                        {
                            key: '9',
                            label: <strong>Mes données sont-elles sécurisées ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Absolument. Toutes les clés API sont chiffrées avec AES-256. Les données sont hébergées sur des serveurs conformes RGPD. Nous ne partageons jamais vos données avec des tiers. Vous pouvez exporter ou supprimer toutes vos données à tout moment.</p>,
                        },
                        {
                            key: '10',
                            label: <strong>Connect fonctionne-t-il avec WhatsApp Web ?</strong>,
                            children: <p style={{ lineHeight: 1.8 }}>Oui. Connect utilise le protocole WhatsApp Web pour se connecter à votre compte. C'est la même technologie utilisée quand vous ouvrez WhatsApp Web dans votre navigateur. Votre téléphone doit rester connecté à Internet pour maintenir la connexion.</p>,
                        },
                    ]}
                />
            </section>

            {/* ─── CTA Support ─── */}
            <Card style={{
                borderRadius: 24,
                background: 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)',
                color: '#fff',
                padding: 48,
                textAlign: 'center',
                marginTop: 32,
                border: 'none',
            }}>
                <Headphones size={40} style={{ marginBottom: 16, opacity: 0.9 }} />
                <Title level={2} style={{ color: '#fff', fontWeight: 900, marginBottom: 12 }}>
                    Besoin d'aide supplémentaire ?
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                    Notre équipe de support est disponible pour vous accompagner dans vos projets d'automatisation.
                </Paragraph>
                <Flexbox horizontal gap={12} justify="center" style={{ flexWrap: 'wrap' }}>
                    <a href="mailto:support@wozif.com" style={{ textDecoration: 'none' }}>
                        <Button size="large" style={{ fontWeight: 700, borderRadius: 12, height: 48, paddingInline: 32 }} icon={<Mail size={16} />}>
                            support@wozif.com
                        </Button>
                    </a>
                    <a href="https://app.connect.wozif.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Button size="large" type="primary" style={{ fontWeight: 700, borderRadius: 12, height: 48, paddingInline: 32, background: '#25d366', borderColor: '#25d366' }} icon={<ArrowUpRight size={16} />}>
                            Ouvrir Connect
                        </Button>
                    </a>
                </Flexbox>
            </Card>

            <DocNavFooter
                prev={{ label: 'SSO & Authentification', href: '/documentation/security/sso' }}
            />
        </>
    );
}
