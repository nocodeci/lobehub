'use client';

import { FormGroup } from '@lobehub/ui';
import { Button, Card, Col, Input, Row, Statistic, Steps, Tag, Typography, message } from 'antd';
import {
  Check,
  ClipboardCopy,
  Gift,
  Link2,
  Mail,
  Share2,
  Star,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

import SettingHeader from '@/app/[variants]/(main)/settings/features/SettingHeader';

const { Text, Title, Paragraph } = Typography;

const REWARD_CREDITS = '500,000';
const REFERRAL_BASE_URL = 'https://app.connect.wozif.com/signup?ref=';

const Referral = memo<{ mobile?: boolean }>(() => {
  const [referralCode] = useState(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'CONNECT-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  });

  const referralLink = useMemo(() => `${REFERRAL_BASE_URL}${referralCode}`, [referralCode]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(referralCode);
    message.success('Code de parrainage copié !');
  }, [referralCode]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    message.success('Lien de parrainage copié !');
  }, [referralLink]);

  const handleShareEmail = useCallback(() => {
    const subject = encodeURIComponent('Rejoins Connect AI — Plateforme d\'agents IA');
    const body = encodeURIComponent(
      `Salut !\n\nJe t'invite à essayer Connect, une plateforme d'agents IA incroyable.\n\nUtilise mon lien pour t'inscrire et on reçoit tous les deux ${REWARD_CREDITS} crédits gratuits :\n${referralLink}\n\nOu entre mon code de parrainage : ${referralCode}\n\nÀ bientôt !`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }, [referralCode, referralLink]);

  return (
    <>
      <SettingHeader title="Récompenses de parrainage" />

      <FormGroup collapsible={false} gap={16} title="Programme de parrainage" variant={'filled'}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #722ed115 0%, #eb2f9615 100%)',
            border: '1px solid #722ed130',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <div
              style={{
                alignItems: 'center',
                background: 'linear-gradient(135deg, #722ed1, #eb2f96)',
                borderRadius: 16,
                display: 'flex',
                height: 64,
                justifyContent: 'center',
                margin: '0 auto',
                width: 64,
              }}
            >
              <Gift color="white" size={32} />
            </div>
            <Title level={3} style={{ margin: 0 }}>
              Invitez vos amis, gagnez des crédits !
            </Title>
            <Paragraph type="secondary" style={{ margin: 0, maxWidth: 500, marginInline: 'auto' }}>
              Partagez votre code de parrainage. Pour chaque ami qui s'inscrit et utilise Connect,
              vous recevez tous les deux <strong>{REWARD_CREDITS} crédits gratuits</strong>.
            </Paragraph>
          </div>
        </Card>
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Votre code de parrainage" variant={'filled'}>
        <Row gutter={[16, 16]}>
          <Col md={12} xs={24}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                  <Star size={18} style={{ color: '#faad14' }} />
                  <Text strong>Code de parrainage</Text>
                </div>
                <Input
                  addonAfter={
                    <Button
                      icon={<ClipboardCopy size={14} />}
                      onClick={handleCopyCode}
                      size="small"
                      type="text"
                    >
                      Copier
                    </Button>
                  }
                  readOnly
                  size="large"
                  style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, letterSpacing: 2 }}
                  value={referralCode}
                />
                <Text style={{ fontSize: 12 }} type="secondary">
                  Partagez ce code avec vos amis pour qu'ils l'entrent lors de l'inscription.
                </Text>
              </div>
            </Card>
          </Col>
          <Col md={12} xs={24}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                  <Link2 size={18} style={{ color: '#1677ff' }} />
                  <Text strong>Lien de parrainage</Text>
                </div>
                <Input
                  addonAfter={
                    <Button
                      icon={<ClipboardCopy size={14} />}
                      onClick={handleCopyLink}
                      size="small"
                      type="text"
                    >
                      Copier
                    </Button>
                  }
                  readOnly
                  size="large"
                  value={referralLink}
                />
                <Text style={{ fontSize: 12 }} type="secondary">
                  Les amis qui s'inscrivent via ce lien recevront automatiquement les crédits bonus.
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col md={8} xs={24}>
            <Button
              block
              icon={<Share2 size={16} />}
              onClick={handleCopyLink}
              size="large"
              type="primary"
            >
              Partager le lien
            </Button>
          </Col>
          <Col md={8} xs={24}>
            <Button
              block
              icon={<Mail size={16} />}
              onClick={handleShareEmail}
              size="large"
            >
              Inviter par email
            </Button>
          </Col>
          <Col md={8} xs={24}>
            <Button
              block
              icon={<ClipboardCopy size={16} />}
              onClick={handleCopyCode}
              size="large"
            >
              Copier le code
            </Button>
          </Col>
        </Row>
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Vos statistiques" variant={'filled'}>
        <Row gutter={[16, 16]}>
          <Col md={6} xs={12}>
            <Card>
              <Statistic
                prefix={<Users size={18} style={{ color: '#1677ff' }} />}
                title="Invitations envoyées"
                value={0}
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card>
              <Statistic
                prefix={<UserPlus size={18} style={{ color: '#52c41a' }} />}
                title="Inscriptions validées"
                value={0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card>
              <Statistic
                prefix={<Trophy size={18} style={{ color: '#faad14' }} />}
                title="Crédits gagnés"
                value={0}
                suffix="crédits"
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card>
              <Statistic
                prefix={<Zap size={18} style={{ color: '#722ed1' }} />}
                title="Solde disponible"
                value="$0.00"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Comment ça marche" variant={'filled'}>
        <Card>
          <Steps
            current={-1}
            direction="vertical"
            items={[
              {
                description:
                  'Copiez votre code ou lien de parrainage et envoyez-le à vos amis, collègues ou sur les réseaux sociaux.',
                icon: (
                  <div
                    style={{
                      alignItems: 'center',
                      background: '#1677ff15',
                      borderRadius: 12,
                      display: 'flex',
                      height: 40,
                      justifyContent: 'center',
                      width: 40,
                    }}
                  >
                    <Share2 color="#1677ff" size={20} />
                  </div>
                ),
                title: '1. Partagez votre code',
              },
              {
                description:
                  'Votre ami s\'inscrit sur Connect via votre lien ou en entrant votre code de parrainage lors de l\'inscription.',
                icon: (
                  <div
                    style={{
                      alignItems: 'center',
                      background: '#52c41a15',
                      borderRadius: 12,
                      display: 'flex',
                      height: 40,
                      justifyContent: 'center',
                      width: 40,
                    }}
                  >
                    <UserPlus color="#52c41a" size={20} />
                  </div>
                ),
                title: '2. Votre ami s\'inscrit',
              },
              {
                description: `Dès que votre ami effectue sa première action (envoyer un message ou générer une image), vous recevez tous les deux ${REWARD_CREDITS} crédits gratuits.`,
                icon: (
                  <div
                    style={{
                      alignItems: 'center',
                      background: '#722ed115',
                      borderRadius: 12,
                      display: 'flex',
                      height: 40,
                      justifyContent: 'center',
                      width: 40,
                    }}
                  >
                    <Gift color="#722ed1" size={20} />
                  </div>
                ),
                title: '3. Recevez vos crédits',
              },
            ]}
          />
        </Card>
      </FormGroup>

      <FormGroup collapsible gap={16} title="Règles du programme" variant={'filled'}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Le parrain et le filleul reçoivent chacun des crédits bonus après la première action valide du filleul.',
              'Une action valide = envoyer un message dans le chat ou générer une image.',
              'Le filleul doit s\'inscrire via le lien de parrainage ou entrer le code lors de l\'inscription.',
              'Vous pouvez rattraper un code oublié dans les 3 jours suivant l\'inscription.',
              'Les crédits de parrainage sont valides pendant 100 jours d\'inactivité.',
              'Priorité de consommation : Crédits gratuits → Abonnement → Parrainage → Top-up.',
              'Connect se réserve le droit de révoquer les récompenses en cas d\'abus détecté.',
            ].map((rule) => (
              <div key={rule} style={{ alignItems: 'flex-start', display: 'flex', gap: 8 }}>
                <Check color="#52c41a" size={14} style={{ flexShrink: 0, marginTop: 4 }} />
                <Text style={{ fontSize: 13 }}>{rule}</Text>
              </div>
            ))}
          </div>
        </Card>
      </FormGroup>
    </>
  );
});

export default Referral;
