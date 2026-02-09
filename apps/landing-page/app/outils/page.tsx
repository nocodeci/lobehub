'use client';

import {
    Flexbox,
    Button,
    Center,
} from '@lobehub/ui';
import { Typography, Card, Input, Select, Tag, message, Tooltip, Radio } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import {
    Link2,
    Copy,
    Users,
    CheckCircle,
    ArrowLeft,
    ExternalLink,
    Type,
    Shield,
    UserPlus,
    MessageSquare,
    Bot,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const useStyles = createStyles(({ css }) => ({
    main: css`
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #000;
  `,
    container: css`
    width: 100%;
    max-width: 1200px;
    padding: 0 24px;
    margin: 0 auto;
  `,
    hero: css`
    padding: 120px 0 60px;
    text-align: center;
    background: linear-gradient(180deg, rgba(7, 94, 84, 0.03) 0%, #fff 100%);
    width: 100%;
  `,
    toolsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin: 60px 0;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
  `,
    toolBox: css`
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.06);
    padding: 32px;
    background: #fff;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    position: relative;
    overflow: hidden;

    &:hover {
        border-color: #075e54;
        transform: translateY(-8px);
        box-shadow: 0 24px 48px rgba(7, 94, 84, 0.08);

        .arrow-icon {
            transform: translateX(4px);
            opacity: 1;
        }
    }
  `,
    toolIconBox: css`
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: rgba(7, 94, 84, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #075e54;
    transition: all 0.3s ease;
  `,
    toolDetailCard: css`
    width: 100%;
    max-width: 600px;
    margin: 40px auto 80px;
    border-radius: 32px;
    border: 1px solid rgba(0,0,0,0.06);
    background: #fff;
    box-shadow: 0 40px 80px rgba(0,0,0,0.05);
    overflow: hidden;
  `,
    toolDetailHeader: css`
    padding: 24px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  `,
    toolDetailBody: css`
    padding: 40px;
  `,
    backBtn: css`
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 8px;
    transition: color 0.2s;
    &:hover { color: #075e54; }
  `,
    inputLabel: css`
    font-size: 13px;
    font-weight: 600;
    color: rgba(0,0,0,0.6);
    margin-bottom: 8px;
  `,
    resultBox: css`
    background: #f8f9fa;
    border-radius: 16px;
    padding: 20px;
    margin-top: 24px;
    border: 1px dashed rgba(0,0,0,0.1);
  `,
    copyBtn: css`
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: #075e54; }
  `,
    statsGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 20px;
  `,
    statCard: css`
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 16px;
  `,
    previewPhone: css`
    background: #075e54;
    border-radius: 20px;
    padding: 12px;
    margin-top: 16px;
  `,
    chatBubble: css`
    background: #dcf8c6;
    padding: 12px 16px;
    border-radius: 8px 8px 8px 0;
    max-width: 85%;
    margin-left: auto;
    font-size: 14px;
    line-height: 1.4;
  `,
}));

const countryOptions = [
    { value: "+93", label: "🇦🇫 +93 Afghanistan" },
    { value: "+355", label: "🇦🇱 +355 Albanie" },
    { value: "+213", label: "🇩🇿 +213 Algérie" },
    { value: "+376", label: "🇦🇩 +376 Andorre" },
    { value: "+244", label: "🇦🇴 +244 Angola" },
    { value: "+1-268", label: "🇦🇬 +1-268 Antigua-et-Barbuda" },
    { value: "+54", label: "🇦🇷 +54 Argentine" },
    { value: "+374", label: "🇦🇲 +374 Arménie" },
    { value: "+61", label: "🇦🇺 +61 Australie" },
    { value: "+43", label: "🇦🇹 +43 Autriche" },
    { value: "+994", label: "🇦🇿 +994 Azerbaïdjan" },
    { value: "+1-242", label: "🇧🇸 +1-242 Bahamas" },
    { value: "+973", label: "🇧🇭 +973 Bahreïn" },
    { value: "+880", label: "🇧🇩 +880 Bangladesh" },
    { value: "+1-246", label: "🇧🇧 +1-246 Barbade" },
    { value: "+375", label: "🇧🇾 +375 Bélarus" },
    { value: "+32", label: "🇧🇪 +32 Belgique" },
    { value: "+501", label: "🇧🇿 +501 Belize" },
    { value: "+229", label: "🇧🇯 +229 Bénin" },
    { value: "+975", label: "🇧🇹 +975 Bhoutan" },
    { value: "+591", label: "🇧🇴 +591 Bolivie" },
    { value: "+387", label: "🇧🇦 +387 Bosnie-Herzégovine" },
    { value: "+267", label: "🇧🇼 +267 Botswana" },
    { value: "+55", label: "🇧🇷 +55 Brésil" },
    { value: "+673", label: "🇧🇳 +673 Brunei" },
    { value: "+359", label: "🇧🇬 +359 Bulgarie" },
    { value: "+226", label: "🇧🇫 +226 Burkina Faso" },
    { value: "+257", label: "🇧🇮 +257 Burundi" },
    { value: "+855", label: "🇰🇭 +855 Cambodge" },
    { value: "+237", label: "🇨🇲 +237 Cameroun" },
    { value: "+1", label: "🇨🇦 +1 Canada" },
    { value: "+238", label: "🇨🇻 +238 Cap-Vert" },
    { value: "+236", label: "🇨🇫 +236 République centrafricaine" },
    { value: "+235", label: "🇹🇩 +235 Tchad" },
    { value: "+56", label: "🇨🇱 +56 Chili" },
    { value: "+86", label: "🇨🇳 +86 Chine" },
    { value: "+57", label: "🇨🇴 +57 Colombie" },
    { value: "+269", label: "🇰🇲 +269 Comores" },
    { value: "+242", label: "🇨🇬 +242 Congo (Brazzaville)" },
    { value: "+243", label: "🇨🇩 +243 Congo (Kinshasa)" },
    { value: "+506", label: "🇨🇷 +506 Costa Rica" },
    { value: "+225", label: "🇨🇮 +225 Côte d'Ivoire" },
    { value: "+385", label: "🇭🇷 +385 Croatie" },
    { value: "+53", label: "🇨🇺 +53 Cuba" },
    { value: "+357", label: "🇨🇾 +357 Chypre" },
    { value: "+420", label: "🇨🇿 +420 République tchèque" },
    { value: "+45", label: "🇩🇰 +45 Danemark" },
    { value: "+253", label: "🇩🇯 +253 Djibouti" },
    { value: "+1-767", label: "🇩🇲 +1-767 Dominique" },
    { value: "+1-809", label: "🇩🇴 +1-809 République dominicaine" },
    { value: "+593", label: "🇪🇨 +593 Équateur" },
    { value: "+20", label: "🇪🇬 +20 Égypte" },
    { value: "+503", label: "🇸🇻 +503 Salvador" },
    { value: "+240", label: "🇬🇶 +240 Guinée équatoriale" },
    { value: "+291", label: "🇪🇷 +291 Érythrée" },
    { value: "+372", label: "🇪🇪 +372 Estonie" },
    { value: "+268", label: "🇸🇿 +268 Eswatini" },
    { value: "+251", label: "🇪🇹 +251 Éthiopie" },
    { value: "+679", label: "🇫🇯 +679 Fidji" },
    { value: "+358", label: "🇫🇮 +358 Finlande" },
    { value: "+33", label: "🇫🇷 +33 France" },
    { value: "+241", label: "🇬🇦 +241 Gabon" },
    { value: "+220", label: "🇬🇲 +220 Gambie" },
    { value: "+995", label: "🇬🇪 +995 Géorgie" },
    { value: "+49", label: "🇩🇪 +49 Allemagne" },
    { value: "+233", label: "🇬🇭 +233 Ghana" },
    { value: "+30", label: "🇬🇷 +30 Grèce" },
    { value: "+1-473", label: "🇬🇩 +1-473 Grenade" },
    { value: "+502", label: "🇬🇹 +502 Guatemala" },
    { value: "+224", label: "🇬🇳 +224 Guinée" },
    { value: "+245", label: "🇬🇼 +245 Guinée-Bissau" },
    { value: "+592", label: "🇬🇾 +592 Guyane" },
    { value: "+509", label: "🇭🇹 +509 Haïti" },
    { value: "+504", label: "🇭🇳 +504 Honduras" },
    { value: "+36", label: "🇭🇺 +36 Hongrie" },
    { value: "+354", label: "🇮🇸 +354 Islande" },
    { value: "+91", label: "🇮🇳 +91 Inde" },
    { value: "+62", label: "🇮🇩 +62 Indonésie" },
    { value: "+98", label: "🇮🇷 +98 Iran" },
    { value: "+964", label: "🇮🇶 +964 Iraq" },
    { value: "+353", label: "🇮🇪 +353 Irlande" },
    { value: "+972", label: "🇮🇱 +972 Israël" },
    { value: "+39", label: "🇮🇹 +39 Italie" },
    { value: "+1-876", label: "🇯🇲 +1-876 Jamaïque" },
    { value: "+81", label: "🇯🇵 +81 Japon" },
    { value: "+962", label: "🇯🇴 +962 Jordanie" },
    { value: "+7", label: "🇰🇿 +7 Kazakhstan" },
    { value: "+254", label: "🇰🇪 +254 Kenya" },
    { value: "+686", label: "🇰🇮 +686 Kiribati" },
    { value: "+850", label: "🇰🇵 +850 Corée du Nord" },
    { value: "+82", label: "🇰🇷 +82 Corée du Sud" },
    { value: "+965", label: "🇰🇼 +965 Koweït" },
    { value: "+996", label: "🇰🇬 +996 Kirghizistan" },
    { value: "+856", label: "🇱🇦 +856 Laos" },
    { value: "+371", label: "🇱🇻 +371 Lettonie" },
    { value: "+961", label: "🇱🇧 +961 Liban" },
    { value: "+266", label: "🇱🇸 +266 Lesotho" },
    { value: "+231", label: "🇱🇷 +231 Libéria" },
    { value: "+218", label: "🇱🇾 +218 Libye" },
    { value: "+423", label: "🇱🇮 +423 Liechtenstein" },
    { value: "+370", label: "🇱🇹 +370 Lituanie" },
    { value: "+352", label: "🇱🇺 +352 Luxembourg" },
    { value: "+261", label: "🇲🇬 +261 Madagascar" },
    { value: "+265", label: "🇲🇼 +265 Malawi" },
    { value: "+60", label: "🇲🇾 +60 Malaisie" },
    { value: "+960", label: "🇲🇻 +960 Maldives" },
    { value: "+223", label: "🇲🇱 +223 Mali" },
    { value: "+356", label: "🇲🇹 +356 Malte" },
    { value: "+692", label: "🇲🇭 +692 Îles Marshall" },
    { value: "+222", label: "🇲🇷 +222 Mauritanie" },
    { value: "+230", label: "🇲🇺 +230 Maurice" },
    { value: "+52", label: "🇲🇽 +52 Mexique" },
    { value: "+691", label: "🇫🇲 +691 Micronésie" },
    { value: "+373", label: "🇲🇩 +373 Moldavie" },
    { value: "+377", label: "🇲🇨 +377 Monaco" },
    { value: "+976", label: "🇲🇳 +976 Mongolie" },
    { value: "+382", label: "🇲🇪 +382 Monténégro" },
    { value: "+212", label: "🇲🇦 +212 Maroc" },
    { value: "+258", label: "🇲🇿 +258 Mozambique" },
    { value: "+95", label: "🇲🇲 +95 Myanmar" },
    { value: "+264", label: "🇳🇦 +264 Namibie" },
    { value: "+674", label: "🇳🇷 +674 Nauru" },
    { value: "+977", label: "🇳🇵 +977 Népal" },
    { value: "+31", label: "🇳🇱 +31 Pays-Bas" },
    { value: "+64", label: "🇳🇿 +64 Nouvelle-Zélande" },
    { value: "+505", label: "🇳🇮 +505 Nicaragua" },
    { value: "+227", label: "🇳 Niger" },
    { value: "+234", label: "🇳🇬 +234 Nigéria" },
    { value: "+389", label: "🇲🇰 +389 Macédoine du Nord" },
    { value: "+47", label: "🇳🇴 +47 Norvège" },
    { value: "+968", label: "🇴🇲 +968 Oman" },
    { value: "+92", label: "🇵🇰 +92 Pakistan" },
    { value: "+680", label: "🇵🇼 +680 Palaos" },
    { value: "+970", label: "🇵🇸 +970 Palestine" },
    { value: "+507", label: "🇵🇦 +507 Panama" },
    { value: "+675", label: "🇵🇬 +675 Papouasie-Nouvelle-Guinée" },
    { value: "+595", label: "🇵🇾 +595 Paraguay" },
    { value: "+51", label: "🇵🇪 +51 Pérou" },
    { value: "+63", label: "🇵🇭 +63 Philippines" },
    { value: "+48", label: "🇵🇱 +48 Pologne" },
    { value: "+351", label: "🇵🇹 +351 Portugal" },
    { value: "+974", label: "🇶🇦 +974 Qatar" },
    { value: "+40", label: "🇷🇴 +40 Roumanie" },
    { value: "+7", label: "🇷🇺 +7 Russie" },
    { value: "+250", label: "🇷🇼 +250 Rwanda" },
    { value: "+1-869", label: "🇰🇳 +1-869 Saint-Kitts-et-Nevis" },
    { value: "+1-758", label: "🇱🇨 +1-758 Sainte-Lucie" },
    { value: "+1-784", label: "🇻🇨 +1-784 Saint-Vincent-et-les Grenadines" },
    { value: "+685", label: "🇼🇸 +685 Samoa" },
    { value: "+378", label: "🇸🇲 +378 Saint-Marin" },
    { value: "+239", label: "🇸🇹 +239 Sao Tomé-et-Principe" },
    { value: "+966", label: "🇸🇦 +966 Arabie Saoudite" },
    { value: "+221", label: "🇸🇳 +221 Sénégal" },
    { value: "+381", label: "🇷🇸 +381 Serbie" },
    { value: "+248", label: "🇸🇨 +248 Seychelles" },
    { value: "+232", label: "🇸🇱 +232 Sierra Leone" },
    { value: "+65", label: "🇸🇬 +65 Singapour" },
    { value: "+421", label: "🇸🇰 +421 Slovaquie" },
    { value: "+386", label: "🇸🇮 +386 Slovénie" },
    { value: "+677", label: "🇸🇧 +677 Îles Salomon" },
    { value: "+252", label: "🇸🇴 +252 Somalie" },
    { value: "+27", label: "🇿🇦 +27 Afrique du Sud" },
    { value: "+211", label: "🇸🇸 +211 Soudan du Sud" },
    { value: "+34", label: "🇪🇸 +34 Espagne" },
    { value: "+94", label: "🇱🇰 +94 Sri Lanka" },
    { value: "+249", label: "🇸🇩 +249 Soudan" },
    { value: "+597", label: "🇸🇷 +597 Suriname" },
    { value: "+46", label: "🇸🇪 +46 Suède" },
    { value: "+41", label: "🇨🇭 +41 Suisse" },
    { value: "+963", label: "🇸🇾 +963 Syrie" },
    { value: "+886", label: "🇹🇼 +886 Taïwan" },
    { value: "+992", label: "🇹🇯 +992 Tadjikistan" },
    { value: "+255", label: "🇹🇿 +255 Tanzanie" },
    { value: "+66", label: "🇹🇭 +66 Thaïlande" },
    { value: "+670", label: "🇹🇱 +670 Timor oriental" },
    { value: "+228", label: "🇹🇬 +228 Togo" },
    { value: "+676", label: "🇹🇴 +676 Tonga" },
    { value: "+1-868", label: "🇹🇹 +1-868 Trinité-et-Tobago" },
    { value: "+216", label: "🇹🇳 +216 Tunisie" },
    { value: "+90", label: "🇹🇷 +90 Turquie" },
    { value: "+993", label: "🇹🇲 +993 Turkménistan" },
    { value: "+688", label: "🇹🇻 +688 Tuvalu" },
    { value: "+256", label: "🇺🇬 +256 Ouganda" },
    { value: "+380", label: "🇺🇦 +380 Ukraine" },
    { value: "+971", label: "🇦🇪 +971 Émirats arabes unis" },
    { value: "+44", label: "🇬🇧 +44 Royaume-Uni" },
    { value: "+1", label: "🇺🇸 +1 États-Unis" },
    { value: "+598", label: "🇺🇾 +598 Uruguay" },
    { value: "+998", label: "🇺🇿 +998 Ouzbékistan" },
    { value: "+678", label: "🇻🇺 +678 Vanuatu" },
    { value: "+379", label: "🇻🇦 +379 Vatican" },
    { value: "+58", label: "🇻🇪 +58 Venezuela" },
    { value: "+84", label: "🇻🇳 +84 Vietnam" },
    { value: "+967", label: "🇾🇪 +967 Yémen" },
    { value: "+260", label: "🇿🇲 +260 Zambie" },
    { value: "+263", label: "🇿🇼 +263 Zimbabwe" }
];

type ToolId = 'link' | 'format' | 'counter' | 'broadcast' | 'validator' | 'vcard' | null;

const ToolsPage = () => {
    const { styles, cx } = useStyles();
    const [mounted, setMounted] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [activeTool, setActiveTool] = useState<ToolId>(null);

    // Link Generator State
    const [waPhone, setWaPhone] = useState('');
    const [waCountry, setWaCountry] = useState('+225');
    const [waMessage, setWaMessage] = useState('');
    const [waLink, setWaLink] = useState('');

    // Validator State
    const [groupLink, setGroupLink] = useState('');
    const [groupValid, setGroupValid] = useState<boolean | null>(null);

    // Formatter State
    const [formatText, setFormatText] = useState('');
    const [formatType, setFormatType] = useState('bold');

    // Calculator State
    const [totalContacts, setTotalContacts] = useState(1000);
    const [msgPerDay, setMsgPerDay] = useState(256);

    // vCard State
    const [vcardName, setVcardName] = useState('');
    const [vcardPhone, setVcardPhone] = useState('');
    const [vcardCompany, setVcardCompany] = useState('');

    // Counter State
    const [statusText, setStatusText] = useState('');
    const maxStatusChars = 700;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        messageApi.success('Copié dans le presse-papiers !');
    };

    const downloadVCard = () => {
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nORG:${vcardCompany}\nTEL;TYPE=CELL:${vcardPhone}\nEND:VCARD`;
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${vcardName.replace(/\s/g, '_')}.vcf`;
        a.click();
    };

    const tools = [
        { id: 'link', title: 'Générateur de Lien Direct', description: 'Créez un lien cliquable vers votre numéro.', icon: <Link2 size={32} /> },
        { id: 'format', title: 'Formateur de Message', description: 'Gras, italique, barré, code...', icon: <Type size={32} /> },
        { id: 'counter', title: 'Compteur de Caractères', description: 'Vérifiez la longueur de vos messages.', icon: <MessageSquare size={32} /> },
        { id: 'broadcast', title: 'Calculateur de Diffusion', description: 'Estimez vos envois de masse.', icon: <Users size={32} /> },
        { id: 'validator', title: 'Validateur de Lien Groupe', description: 'Vérifiez si un lien de groupe est valide.', icon: <Shield size={32} /> },
        { id: 'vcard', title: 'Générateur de Contact vCard', description: 'Créez un fichier contact .vcf professionnel.', icon: <UserPlus size={32} /> },
    ];

    return (
        <main className={styles.main}>
            {contextHolder}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Tag color="success" style={{ marginBottom: 16, background: 'rgba(7, 94, 84, 0.1)', border: 'none', color: '#075e54', fontWeight: 700 }}>Outils Gratuits</Tag>
                    <Title level={1} style={{ fontSize: 56, fontWeight: 900, marginBottom: 24 }}>
                        Boîte à outils Connect
                    </Title>
                    <Paragraph style={{ fontSize: 20, color: '#444', maxWidth: 800, margin: '0 auto' }}>
                        Des outils spécialisés pour optimiser votre communication et booster votre productivité.
                    </Paragraph>
                </div>
            </section>

            <section className={styles.container}>
                <AnimatePresence mode="wait">
                    {!activeTool ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={styles.toolsGrid}
                        >
                            {tools.map((tool) => (
                                <div key={tool.id} className={styles.toolBox} onClick={() => setActiveTool(tool.id as ToolId)}>
                                    <div className={styles.toolIconBox}>{tool.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <Title level={4} style={{ margin: '0 0 8px 0', fontWeight: 800 }}>{tool.title}</Title>
                                        <Text style={{ color: '#666', fontSize: 14 }}>{tool.description}</Text>
                                    </div>
                                    <Flexbox horizontal align="center" gap={4} className="arrow-icon" style={{ opacity: 0.4, transition: 'all 0.3s' }}>
                                        <Text strong style={{ color: '#075e54', fontSize: 13 }}>Lancer l'outil</Text>
                                        <ChevronRight size={16} color="#075e54" />
                                    </Flexbox>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={styles.toolDetailCard}
                        >
                            <div className={styles.toolDetailHeader}>
                                <div className={styles.backBtn} onClick={() => setActiveTool(null)}>
                                    <ArrowLeft size={18} /> Retour aux outils
                                </div>
                                <div className={styles.toolIconBox} style={{ width: 80, height: 80, borderRadius: 24 }}>
                                    {tools.find(t => t.id === activeTool)?.icon}
                                </div>
                                <Title level={2} style={{ margin: 0, fontWeight: 900 }}>{tools.find(t => t.id === activeTool)?.title}</Title>
                                <Text style={{ color: '#666', fontSize: 16 }}>{tools.find(t => t.id === activeTool)?.description}</Text>
                            </div>

                            <div className={styles.toolDetailBody}>
                                {activeTool === 'link' && (
                                    <>
                                        <div className={styles.inputLabel}>Pays (Recherchez votre pays)</div>
                                        <Select
                                            showSearch
                                            value={waCountry}
                                            onChange={setWaCountry}
                                            options={countryOptions}
                                            style={{ width: '100%', marginBottom: 16 }}
                                            size="large"
                                            placeholder="Choisir un pays"
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                        />
                                        <div className={styles.inputLabel}>Numéro de téléphone</div>
                                        <Input placeholder="07 00 00 00 00" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} size="large" style={{ marginBottom: 16, borderRadius: 12 }} />
                                        <div className={styles.inputLabel}>Message pré-rempli (optionnel)</div>
                                        <TextArea placeholder="Bonjour..." value={waMessage} onChange={(e) => setWaMessage(e.target.value)} rows={3} style={{ marginBottom: 16, borderRadius: 12 }} />
                                        <Button type="primary" block onClick={() => setWaLink(`https://wa.me/${waCountry.replace('+', '').replace(/\-.*/, '')}${waPhone.replace(/\D/g, '')}${waMessage ? '?text=' + encodeURIComponent(waMessage) : ''}`)} style={{ height: 56, borderRadius: 16, fontWeight: 700, background: '#075e54', fontSize: 16 }}>Générer le lien</Button>
                                        {waLink && (
                                            <div className={styles.resultBox}>
                                                <Flexbox horizontal justify="space-between" align="center">
                                                    <Text style={{ fontSize: 14, wordBreak: 'break-all', fontWeight: 500 }}>{waLink}</Text>
                                                    <Flexbox horizontal gap={12}>
                                                        <Tooltip title="Copier"><Copy size={20} className={styles.copyBtn} onClick={() => copyToClipboard(waLink)} /></Tooltip>
                                                        <Tooltip title="Ouvrir"><ExternalLink size={20} className={styles.copyBtn} onClick={() => window.open(waLink, '_blank')} /></Tooltip>
                                                    </Flexbox>
                                                </Flexbox>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTool === 'format' && (
                                    <>
                                        <div className={styles.inputLabel}>Type de formatage</div>
                                        <Radio.Group value={formatType} onChange={(e) => setFormatType(e.target.value)} style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                            <Radio.Button value="bold">*Gras*</Radio.Button>
                                            <Radio.Button value="italic">_Italique_</Radio.Button>
                                            <Radio.Button value="strike">~Barré~</Radio.Button>
                                            <Radio.Button value="mono">`Code`</Radio.Button>
                                        </Radio.Group>
                                        <div className={styles.inputLabel}>Votre texte</div>
                                        <TextArea placeholder="Tapez votre texte ici..." value={formatText} onChange={(e) => setFormatText(e.target.value)} rows={5} style={{ marginBottom: 16, borderRadius: 16 }} />
                                        {formatText && (
                                            <div className={styles.resultBox}>
                                                <Flexbox horizontal justify="space-between" align="center">
                                                    <Text strong style={{ fontSize: 15 }}>Code à copier : {(formatType === 'bold' ? `*${formatText}*` : formatType === 'italic' ? `_${formatText}_` : formatType === 'strike' ? `~${formatText}~` : `\`\`\`${formatText}\`\`\``)}</Text>
                                                    <Copy size={20} className={styles.copyBtn} onClick={() => copyToClipboard(formatType === 'bold' ? `*${formatText}*` : formatType === 'italic' ? `_${formatText}_` : formatType === 'strike' ? `~${formatText}~` : `\`\`\`${formatText}\`\`\``)} />
                                                </Flexbox>
                                                <div className={styles.previewPhone}>
                                                    <div className={styles.chatBubble}>
                                                        {formatType === 'bold' && <strong>{formatText}</strong>}
                                                        {formatType === 'italic' && <em>{formatText}</em>}
                                                        {formatType === 'strike' && <s>{formatText}</s>}
                                                        {formatType === 'mono' && <code style={{ fontFamily: 'monospace' }}>{formatText}</code>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTool === 'counter' && (
                                    <>
                                        <TextArea placeholder="Écrivez votre message ici..." value={statusText} onChange={(e) => setStatusText(e.target.value)} rows={8} maxLength={maxStatusChars} style={{ marginBottom: 20, borderRadius: 16 }} />
                                        <Flexbox horizontal justify="space-between" align="center">
                                            <div>
                                                <span style={{ fontSize: 40, fontWeight: 900, color: statusText.length > 600 ? '#ff4d4f' : '#075e54' }}>{statusText.length}</span>
                                                <span style={{ fontSize: 16, opacity: 0.5 }}> / {maxStatusChars}</span>
                                            </div>
                                            <Tag color={statusText.length <= maxStatusChars ? 'success' : 'error'} style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8 }}>
                                                {statusText.length <= maxStatusChars ? 'Taille optimale' : 'Trop long'}
                                            </Tag>
                                        </Flexbox>
                                        <div style={{ marginTop: 20, background: '#f0f0f0', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                                            <div style={{ width: `${(statusText.length / maxStatusChars) * 100}%`, height: '100%', background: statusText.length > 600 ? '#ff4d4f' : '#075e54', transition: 'all 0.3s' }} />
                                        </div>
                                    </>
                                )}

                                {activeTool === 'broadcast' && (
                                    <>
                                        <div className={styles.inputLabel}>Nombre total de contacts</div>
                                        <Input type="number" value={totalContacts} onChange={(e) => setTotalContacts(Number(e.target.value))} size="large" style={{ marginBottom: 20, borderRadius: 12 }} />
                                        <div className={styles.inputLabel}>Messages autorisés par jour</div>
                                        <Input type="number" value={msgPerDay} onChange={(e) => setMsgPerDay(Number(e.target.value))} size="large" style={{ marginBottom: 32, borderRadius: 12 }} />
                                        <div className={styles.statsGrid}>
                                            <div className={styles.statCard}>
                                                <Title level={3} style={{ color: '#075e54', margin: 0 }}>{Math.ceil(totalContacts / 256)}</Title>
                                                <Text style={{ fontSize: 12, opacity: 0.6 }}>Listes de diffusion</Text>
                                            </div>
                                            <div className={styles.statCard}>
                                                <Title level={3} style={{ color: '#075e54', margin: 0 }}>{Math.ceil(totalContacts / msgPerDay)}</Title>
                                                <Text style={{ fontSize: 12, opacity: 0.6 }}>Jours requis</Text>
                                            </div>
                                            <div className={styles.statCard}>
                                                <Title level={3} style={{ color: '#075e54', margin: 0 }}>256</Title>
                                                <Text style={{ fontSize: 12, opacity: 0.6 }}>Max par liste</Text>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTool === 'validator' && (
                                    <>
                                        <div className={styles.inputLabel}>Lien de groupe à vérifier</div>
                                        <Input placeholder="https://chat.whatsapp.com/..." value={groupLink} onChange={(e) => setGroupLink(e.target.value)} size="large" style={{ marginBottom: 16, borderRadius: 12 }} />
                                        <Button type="primary" block onClick={() => setGroupValid(/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}$/.test(groupLink.trim()))} style={{ height: 56, borderRadius: 16, fontWeight: 700, background: '#075e54' }}>Vérifier la validité</Button>
                                        {groupValid !== null && (
                                            <div className={styles.resultBox} style={{ background: groupValid ? 'rgba(7, 94, 84, 0.05)' : 'rgba(255, 77, 79, 0.05)', borderColor: groupValid ? '#075e54' : '#ff4d4f' }}>
                                                <Flexbox horizontal align="center" gap={12}>
                                                    {groupValid ? <CheckCircle size={24} color="#075e54" /> : <Shield size={24} color="#ff4d4f" />}
                                                    <Text strong style={{ color: groupValid ? '#075e54' : '#ff4d4f', fontSize: 16 }}>
                                                        {groupValid ? 'Ceci est un format de lien valide' : 'Format de lien invalide ou suspect'}
                                                    </Text>
                                                </Flexbox>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTool === 'vcard' && (
                                    <>
                                        <div className={styles.inputLabel}>Nom et Prénom</div>
                                        <Input placeholder="Ex: Jean Kouassi" value={vcardName} onChange={(e) => setVcardName(e.target.value)} size="large" style={{ marginBottom: 16, borderRadius: 12 }} />
                                        <div className={styles.inputLabel}>Numéro complet</div>
                                        <Input placeholder="+225 07..." value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} size="large" style={{ marginBottom: 16, borderRadius: 12 }} />
                                        <div className={styles.inputLabel}>Nom de l'entreprise</div>
                                        <Input placeholder="Ex: Connect Inc" value={vcardCompany} onChange={(e) => setVcardCompany(e.target.value)} size="large" style={{ marginBottom: 24, borderRadius: 12 }} />
                                        <Flexbox horizontal gap={16}>
                                            <Button type="primary" block onClick={downloadVCard} disabled={!vcardName || !vcardPhone} style={{ height: 56, borderRadius: 16, fontWeight: 700, background: '#075e54' }}>Télécharger .vcf</Button>
                                            <Button block onClick={() => { copyToClipboard(`BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nORG:${vcardCompany}\nTEL;TYPE=CELL:${vcardPhone}\nEND:VCARD`); }} disabled={!vcardName || !vcardPhone} style={{ height: 56, borderRadius: 16, fontWeight: 700 }}>Copier le code</Button>
                                        </Flexbox>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA Section */}
                <Center style={{ margin: '80px 0' }}>
                    <Card style={{ borderRadius: 32, background: '#075e54', padding: '48px 24px', textAlign: 'center', border: 'none', maxWidth: 800, width: '100%' }}>
                        <Flexbox align="center" gap={16}>
                            <Bot size={64} color="#fff" />
                            <Title level={2} style={{ color: '#fff', fontWeight: 900, marginBottom: 8 }}>
                                Passez à l'automatisation IA
                            </Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 17, marginBottom: 32, maxWidth: 500 }}>
                                Ces outils facilitent votre gestion quotidienne, mais un Agent IA Connect transforme radicalement votre business.
                            </Paragraph>
                            <Button size="large" onClick={() => window.location.href = 'https://app.connect.wozif.com'} style={{ fontWeight: 800, borderRadius: 16, height: 64, paddingInline: 48, fontSize: 18 }}>
                                Créer mon Agent Maintenant <Sparkles size={20} style={{ marginLeft: 8 }} />
                            </Button>
                        </Flexbox>
                    </Card>
                </Center>
            </section>
        </main>
    );
};

export default ToolsPage;
