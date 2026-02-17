'use client';

import { FormGroup } from '@lobehub/ui';
import { Button, Card, Col, Descriptions, Empty, Row, Statistic, Tag, Typography, message } from 'antd';
import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  Receipt,
  RefreshCw,
  Settings,
  Shield,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import SettingHeader from '@/app/[variants]/(main)/settings/features/SettingHeader';

const { Text, Title } = Typography;

interface SubscriptionData {
  currentPlan: string | null;
  status: string;
  subscription: {
    billingCycle: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    currentPeriodStart: number;
    id: string;
  } | null;
}

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  active: { color: 'green', label: 'Actif' },
  canceled: { color: 'red', label: 'Annulé' },
  incomplete: { color: 'orange', label: 'Incomplet' },
  incomplete_expired: { color: 'red', label: 'Expiré' },
  none: { color: 'default', label: 'Aucun abonnement' },
  past_due: { color: 'red', label: 'Paiement en retard' },
  trialing: { color: 'blue', label: 'Période d\'essai' },
  unpaid: { color: 'red', label: 'Impayé' },
};

const Billing = memo<{ mobile?: boolean }>(() => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch('/api/subscription')
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenPortal = useCallback(async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/subscription/portal', {
        body: JSON.stringify({ customerId: '' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        message.info('Aucun abonnement actif. Souscrivez d\'abord à un plan.');
      }
    } catch {
      message.error('Erreur lors de l\'ouverture du portail de facturation.');
    } finally {
      setPortalLoading(false);
    }
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const statusInfo = STATUS_MAP[subscription?.status || 'none'] || STATUS_MAP.none;
  const hasSubscription = subscription?.subscription && subscription.status !== 'none';

  return (
    <>
      <SettingHeader title="Gestion de la facturation" />

      <FormGroup collapsible={false} gap={16} title="Abonnement actuel" variant={'filled'}>
        {loading ? (
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map((i) => (
              <Col key={i} md={8} xs={24}>
                <Card loading />
              </Col>
            ))}
          </Row>
        ) : hasSubscription ? (
          <>
            <Row gutter={[16, 16]}>
              <Col md={8} xs={24}>
                <Card>
                  <Statistic
                    prefix={<Shield size={18} style={{ color: '#722ed1' }} />}
                    title="Plan"
                    value={subscription?.currentPlan || 'Gratuit'}
                    valueStyle={{ fontSize: 20, textTransform: 'capitalize' }}
                  />
                  <Tag color={statusInfo.color} style={{ marginTop: 8 }}>
                    {statusInfo.label}
                  </Tag>
                </Card>
              </Col>
              <Col md={8} xs={24}>
                <Card>
                  <Statistic
                    prefix={<RefreshCw size={18} style={{ color: '#1677ff' }} />}
                    title="Cycle de facturation"
                    value={
                      subscription?.subscription?.billingCycle === 'yearly'
                        ? 'Annuel'
                        : 'Mensuel'
                    }
                    valueStyle={{ fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col md={8} xs={24}>
                <Card>
                  <Statistic
                    prefix={<Calendar size={18} style={{ color: '#52c41a' }} />}
                    title="Prochain renouvellement"
                    value={
                      subscription?.subscription?.currentPeriodEnd
                        ? formatDate(subscription.subscription.currentPeriodEnd)
                        : '—'
                    }
                    valueStyle={{ fontSize: 16 }}
                  />
                  {subscription?.subscription?.cancelAtPeriodEnd && (
                    <Tag color="orange" style={{ marginTop: 8 }}>
                      Annulation programmée
                    </Tag>
                  )}
                </Card>
              </Col>
            </Row>

            <Card>
              <Descriptions
                bordered
                column={{ lg: 2, md: 1, xs: 1 }}
                size="small"
                title={
                  <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <FileText size={16} />
                    Détails de l'abonnement
                  </div>
                }
              >
                <Descriptions.Item label="ID Abonnement">
                  <Text copyable style={{ fontSize: 12 }}>
                    {subscription?.subscription?.id || '—'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Statut">
                  <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Début de période">
                  {subscription?.subscription?.currentPeriodStart
                    ? formatDate(subscription.subscription.currentPeriodStart)
                    : '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Fin de période">
                  {subscription?.subscription?.currentPeriodEnd
                    ? formatDate(subscription.subscription.currentPeriodEnd)
                    : '—'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        ) : (
          <Card>
            <Empty
              description={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Text>Aucun abonnement actif</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Souscrivez à un plan pour débloquer toutes les fonctionnalités de Connect.
                  </Text>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                icon={<ArrowUpRight size={14} />}
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: '/settings/plans' });
                  window.dispatchEvent(event);
                }}
                type="primary"
              >
                Voir les plans
              </Button>
            </Empty>
          </Card>
        )}
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Actions de facturation" variant={'filled'}>
        <Row gutter={[16, 16]}>
          <Col md={8} xs={24}>
            <Card hoverable onClick={handleOpenPortal} style={{ cursor: 'pointer' }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
                <div
                  style={{
                    alignItems: 'center',
                    background: '#1677ff15',
                    borderRadius: 12,
                    display: 'flex',
                    height: 48,
                    justifyContent: 'center',
                    width: 48,
                  }}
                >
                  <Settings color="#1677ff" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text strong>Gérer l'abonnement</Text>
                  <br />
                  <Text style={{ fontSize: 12 }} type="secondary">
                    Modifier, upgrader ou annuler
                  </Text>
                </div>
                <ExternalLink color="var(--ant-color-text-secondary)" size={16} />
              </div>
            </Card>
          </Col>
          <Col md={8} xs={24}>
            <Card hoverable onClick={handleOpenPortal} style={{ cursor: 'pointer' }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
                <div
                  style={{
                    alignItems: 'center',
                    background: '#52c41a15',
                    borderRadius: 12,
                    display: 'flex',
                    height: 48,
                    justifyContent: 'center',
                    width: 48,
                  }}
                >
                  <CreditCard color="#52c41a" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text strong>Moyen de paiement</Text>
                  <br />
                  <Text style={{ fontSize: 12 }} type="secondary">
                    Mettre à jour votre carte
                  </Text>
                </div>
                <ExternalLink color="var(--ant-color-text-secondary)" size={16} />
              </div>
            </Card>
          </Col>
          <Col md={8} xs={24}>
            <Card hoverable onClick={handleOpenPortal} style={{ cursor: 'pointer' }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
                <div
                  style={{
                    alignItems: 'center',
                    background: '#fa8c1615',
                    borderRadius: 12,
                    display: 'flex',
                    height: 48,
                    justifyContent: 'center',
                    width: 48,
                  }}
                >
                  <Receipt color="#fa8c16" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text strong>Historique des factures</Text>
                  <br />
                  <Text style={{ fontSize: 12 }} type="secondary">
                    Télécharger vos factures
                  </Text>
                </div>
                <ExternalLink color="var(--ant-color-text-secondary)" size={16} />
              </div>
            </Card>
          </Col>
        </Row>
      </FormGroup>

      <FormGroup collapsible gap={16} title="Informations" variant={'filled'}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Text>
              <strong>Paiements sécurisés</strong> — Tous les paiements sont traités par Stripe, leader
              mondial du paiement en ligne. Vos informations bancaires ne sont jamais stockées sur nos
              serveurs.
            </Text>
            <Text>
              <strong>Annulation</strong> — Vous pouvez annuler votre abonnement à tout moment. Vous
              conserverez l'accès à votre plan jusqu'à la fin de la période en cours.
            </Text>
            <Text>
              <strong>Changement de plan</strong> — Lors d'un upgrade, la différence est calculée au
              prorata. Lors d'un downgrade, le nouveau plan prend effet à la fin de la période en cours.
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Pour toute question, contactez-nous à{' '}
              <a href="mailto:support@wozif.com">support@wozif.com</a>
            </Text>
          </div>
        </Card>
      </FormGroup>
    </>
  );
});

export default Billing;
