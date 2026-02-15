"use client";

import { useSession } from "next-auth/react";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  Settings,
  MessageSquare,
  Bot,
  Zap,
  GitBranch,
  Clock,
  Trash2,
  ShoppingCart,
  Package,
  CreditCard,
  Users,
  Calendar,
  Sparkles,
  Send,
  Image,
  FileText,
  MapPin,
  Contact2,
  HelpCircle,
  Target,
  Megaphone,
  HeartHandshake,
  Store,
  ChevronRight,
  Wand2,
  LayoutTemplate,
  PlusCircle,
  X,
  Check,
  Star,
  GripVertical,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minus,
  Rocket,
  AlertTriangle,
  Terminal,
  Activity,
  Loader2,
  ShieldCheck,
  SendHorizontal,
  BotMessageSquare,
  Upload,
  ImageIcon,
  UserPlus,
  UserMinus,
  UserX,
  Search,
  UserSearch,
  Map,
  Link2,
  Filter,
  Flame,
  ListChecks,
  Globe,
  Cpu,
  Smile,
  ShoppingBag,
  Truck,
  Mail,
  Trophy,
  BookOpen,
  Briefcase,
  Utensils,
  Box,
  Bell,
  Smartphone,
  QrCode,
  Mic,
  Code,
  ChevronDown,
  ChevronLeft,
  Database,
  ArrowRight,
  MoreVertical,
  FlaskConical,
  PanelRight,
  Settings2,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { WhatsAppSimulator } from "@/components/dashboard/WhatsAppSimulator";
import PhoneInput, {
  getCountryCallingCode,
  Country,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import en from "react-phone-number-input/locale/en";
import { executeNode, ExecutionContext } from "@/utils/workflow-executor";

// Labels personnalisés avec préfixes téléphoniques
const customLabels: Record<string, string> = {
  ZZ: "International",
  AF: "Afghanistan (+93)",
  AL: "Albania (+355)",
  DZ: "Algeria (+213)",
  AS: "American Samoa (+1684)",
  AD: "Andorra (+376)",
  AO: "Angola (+244)",
  AI: "Anguilla (+1264)",
  AG: "Antigua and Barbuda (+1268)",
  AR: "Argentina (+54)",
  AM: "Armenia (+374)",
  AW: "Aruba (+297)",
  AU: "Australia (+61)",
  AT: "Austria (+43)",
  AZ: "Azerbaijan (+994)",
  BS: "Bahamas (+1242)",
  BH: "Bahrain (+973)",
  BD: "Bangladesh (+880)",
  BB: "Barbados (+1246)",
  BY: "Belarus (+375)",
  BE: "Belgium (+32)",
  BZ: "Belize (+501)",
  BJ: "Benin (+229)",
  BM: "Bermuda (+1441)",
  BT: "Bhutan (+975)",
  BO: "Bolivia (+591)",
  BA: "Bosnia and Herzegovina (+387)",
  BW: "Botswana (+267)",
  BR: "Brazil (+55)",
  BN: "Brunei (+673)",
  BG: "Bulgaria (+359)",
  BF: "Burkina Faso (+226)",
  BI: "Burundi (+257)",
  KH: "Cambodia (+855)",
  CM: "Cameroon (+237)",
  CA: "Canada (+1)",
  CV: "Cape Verde (+238)",
  KY: "Cayman Islands (+1345)",
  CF: "Central African Republic (+236)",
  TD: "Chad (+235)",
  CL: "Chile (+56)",
  CN: "China (+86)",
  CO: "Colombia (+57)",
  KM: "Comoros (+269)",
  CG: "Congo (+242)",
  CD: "Congo DR (+243)",
  CR: "Costa Rica (+506)",
  CI: "Côte d'Ivoire (+225)",
  HR: "Croatia (+385)",
  CU: "Cuba (+53)",
  CY: "Cyprus (+357)",
  CZ: "Czech Republic (+420)",
  DK: "Denmark (+45)",
  DJ: "Djibouti (+253)",
  DM: "Dominica (+1767)",
  DO: "Dominican Republic (+1809)",
  EC: "Ecuador (+593)",
  EG: "Egypt (+20)",
  SV: "El Salvador (+503)",
  GQ: "Equatorial Guinea (+240)",
  ER: "Eritrea (+291)",
  EE: "Estonia (+372)",
  ET: "Ethiopia (+251)",
  FJ: "Fiji (+679)",
  FI: "Finland (+358)",
  FR: "France (+33)",
  GF: "French Guiana (+594)",
  PF: "French Polynesia (+689)",
  GA: "Gabon (+241)",
  GM: "Gambia (+220)",
  GE: "Georgia (+995)",
  DE: "Germany (+49)",
  GH: "Ghana (+233)",
  GI: "Gibraltar (+350)",
  GR: "Greece (+30)",
  GL: "Greenland (+299)",
  GD: "Grenada (+1473)",
  GP: "Guadeloupe (+590)",
  GU: "Guam (+1671)",
  GT: "Guatemala (+502)",
  GN: "Guinea (+224)",
  GW: "Guinea-Bissau (+245)",
  GY: "Guyana (+592)",
  HT: "Haiti (+509)",
  HN: "Honduras (+504)",
  HK: "Hong Kong (+852)",
  HU: "Hungary (+36)",
  IS: "Iceland (+354)",
  IN: "India (+91)",
  ID: "Indonesia (+62)",
  IR: "Iran (+98)",
  IQ: "Iraq (+964)",
  IE: "Ireland (+353)",
  IL: "Israel (+972)",
  IT: "Italy (+39)",
  JM: "Jamaica (+1876)",
  JP: "Japan (+81)",
  JO: "Jordan (+962)",
  KZ: "Kazakhstan (+7)",
  KE: "Kenya (+254)",
  KI: "Kiribati (+686)",
  KW: "Kuwait (+965)",
  KG: "Kyrgyzstan (+996)",
  LA: "Laos (+856)",
  LV: "Latvia (+371)",
  LB: "Lebanon (+961)",
  LS: "Lesotho (+266)",
  LR: "Liberia (+231)",
  LY: "Libya (+218)",
  LI: "Liechtenstein (+423)",
  LT: "Lithuania (+370)",
  LU: "Luxembourg (+352)",
  MO: "Macao (+853)",
  MG: "Madagascar (+261)",
  MW: "Malawi (+265)",
  MY: "Malaysia (+60)",
  MV: "Maldives (+960)",
  ML: "Mali (+223)",
  MT: "Malta (+356)",
  MH: "Marshall Islands (+692)",
  MQ: "Martinique (+596)",
  MR: "Mauritania (+222)",
  MU: "Mauritius (+230)",
  MX: "Mexico (+52)",
  MD: "Moldova (+373)",
  MC: "Monaco (+377)",
  MN: "Mongolia (+976)",
  ME: "Montenegro (+382)",
  MS: "Montserrat (+1664)",
  MA: "Morocco (+212)",
  MZ: "Mozambique (+258)",
  MM: "Myanmar (+95)",
  NA: "Namibia (+264)",
  NR: "Nauru (+674)",
  NP: "Nepal (+977)",
  NL: "Netherlands (+31)",
  NC: "New Caledonia (+687)",
  NZ: "New Zealand (+64)",
  NI: "Nicaragua (+505)",
  NE: "Niger (+227)",
  NG: "Nigeria (+234)",
  KP: "North Korea (+850)",
  MK: "North Macedonia (+389)",
  NO: "Norway (+47)",
  OM: "Oman (+968)",
  PK: "Pakistan (+92)",
  PW: "Palau (+680)",
  PS: "Palestine (+970)",
  PA: "Panama (+507)",
  PG: "Papua New Guinea (+675)",
  PY: "Paraguay (+595)",
  PE: "Peru (+51)",
  PH: "Philippines (+63)",
  PL: "Poland (+48)",
  PT: "Portugal (+351)",
  PR: "Puerto Rico (+1787)",
  QA: "Qatar (+974)",
  RE: "Reunion (+262)",
  RO: "Romania (+40)",
  RU: "Russia (+7)",
  RW: "Rwanda (+250)",
  KN: "Saint Kitts and Nevis (+1869)",
  LC: "Saint Lucia (+1758)",
  VC: "Saint Vincent (+1784)",
  WS: "Samoa (+685)",
  SM: "San Marino (+378)",
  ST: "Sao Tome and Principe (+239)",
  SA: "Saudi Arabia (+966)",
  SN: "Senegal (+221)",
  RS: "Serbia (+381)",
  SC: "Seychelles (+248)",
  SL: "Sierra Leone (+232)",
  SG: "Singapore (+65)",
  SK: "Slovakia (+421)",
  SI: "Slovenia (+386)",
  SB: "Solomon Islands (+677)",
  SO: "Somalia (+252)",
  ZA: "South Africa (+27)",
  KR: "South Korea (+82)",
  SS: "South Sudan (+211)",
  ES: "Spain (+34)",
  LK: "Sri Lanka (+94)",
  SD: "Sudan (+249)",
  SR: "Suriname (+597)",
  SZ: "Swaziland (+268)",
  SE: "Sweden (+46)",
  CH: "Switzerland (+41)",
  SY: "Syria (+963)",
  TW: "Taiwan (+886)",
  TJ: "Tajikistan (+992)",
  TZ: "Tanzania (+255)",
  TH: "Thailand (+66)",
  TL: "Timor-Leste (+670)",
  TG: "Togo (+228)",
  TO: "Tonga (+676)",
  TT: "Trinidad and Tobago (+1868)",
  TN: "Tunisia (+216)",
  TR: "Turkey (+90)",
  TM: "Turkmenistan (+993)",
  TC: "Turks and Caicos (+1649)",
  TV: "Tuvalu (+688)",
  UG: "Uganda (+256)",
  UA: "Ukraine (+380)",
  AE: "United Arab Emirates (+971)",
  GB: "United Kingdom (+44)",
  US: "United States (+1)",
  UY: "Uruguay (+598)",
  UZ: "Uzbekistan (+998)",
  VU: "Vanuatu (+678)",
  VE: "Venezuela (+58)",
  VN: "Vietnam (+84)",
  YE: "Yemen (+967)",
  ZM: "Zambia (+260)",
  ZW: "Zimbabwe (+263)",
};
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// OpenAI Logo Component - Official Logomark geometry
const ChariowIcon = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img
      src="/chariow-logo.png"
      alt="Chariow"
      className="w-full h-full object-contain"
    />
  </div>
);

const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
  >
    <g>
      <path
        d="M128,0 C57.307,0 0,57.307 0,128 L0,128 C0,198.693 57.307,256 128,256 L128,256 C198.693,256 256,198.693 256,128 L256,128 C256,57.307 198.693,0 128,0 L128,0 Z"
        fill="#44B6E4"
      ></path>
      <path
        d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308"
        fill="#FFFFFF"
      ></path>
      <path
        d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475"
        fill="#D2E5F1"
      ></path>
      <path
        d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624"
        fill="#B5CFE4"
      ></path>
    </g>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-700, -360)" fill="#67C15E">
        <path d="M723.993033,360 C710.762252,360 700,370.765287 700,383.999801 C700,389.248451 701.692661,394.116025 704.570026,398.066947 L701.579605,406.983798 L710.804449,404.035539 C714.598605,406.546975 719.126434,408 724.006967,408 C737.237748,408 748,397.234315 748,384.000199 C748,370.765685 737.237748,360.000398 724.006967,360.000398 L723.993033,360.000398 L723.993033,360 Z M717.29285,372.190836 C716.827488,371.07628 716.474784,371.034071 715.769774,371.005401 C715.529728,370.991464 715.262214,370.977527 714.96564,370.977527 C714.04845,370.977527 713.089462,371.245514 712.511043,371.838033 C711.806033,372.557577 710.056843,374.23638 710.056843,377.679202 C710.056843,381.122023 712.567571,384.451756 712.905944,384.917648 C713.258648,385.382743 717.800808,392.55031 724.853297,395.471492 C730.368379,397.757149 732.00491,397.545307 733.260074,397.27732 C735.093658,396.882308 737.393002,395.527239 737.971421,393.891043 C738.54984,392.25405 738.54984,390.857171 738.380255,390.560912 C738.211068,390.264652 737.745308,390.095816 737.040298,389.742615 C736.335288,389.389811 732.90737,387.696673 732.25849,387.470894 C731.623543,387.231179 731.017259,387.315995 730.537963,387.99333 C729.860819,388.938653 729.198006,389.89831 728.661785,390.476494 C728.238619,390.928051 727.547144,390.984595 726.969123,390.744481 C726.193254,390.420348 724.021298,389.657798 721.340985,387.273388 C719.267356,385.42535 717.856938,383.125756 717.448104,382.434484 C717.038871,381.729275 717.405907,381.319529 717.729948,380.938852 C718.082653,380.501232 718.421026,380.191036 718.77373,379.781688 C719.126434,379.372738 719.323884,379.160897 719.549599,378.681068 C719.789645,378.215575 719.62006,377.735746 719.450874,377.382942 C719.281687,377.030139 717.871269,373.587317 717.29285,372.190836 Z" />
      </g>
    </g>
  </svg>
);

// Templates prédéfinis pour les débutants
const workflowTemplates = [
  {
    id: "chatbot_intelligent",
    name: "Chatbot IA Intelligent",
    description: "Répondez aux clients en utilisant votre propre base de connaissances (PDF, Texte).",
    icon: Bot,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    popular: true,
    features: ["RAG Knowledge", "IA LangChain", "Réponse Auto"],
  },
  {
    id: "agent_expert_pro",
    name: "Agent IA Expert 360°",
    description: "Agent autonome capable de lire votre site web, vos PDF et d'utiliser des outils MCP.",
    icon: Rocket,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    popular: true,
    features: ["Web Scraping", "Analyse PDF", "Connecteurs MCP"],
  },
  {
    id: "python_workflow",
    name: "Moteur Python Custom",
    description: "Workflow avancé utilisant des scripts Python pour des calculs ou APIs complexes.",
    icon: Code,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    popular: false,
    features: ["Script Python", "Context Mapping", "Logic Avancée"],
  },
  {
    id: "service_client_intelligent",
    name: "Service Client IA",
    description: "Analyse automatiquement l'intention et le sentiment du client pour une réponse adaptée.",
    icon: Brain,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    popular: true,
    features: ["Détection Intention", "Analyse Sentiment", "Routage Intelligent"],
  },
  {
    id: "custom",
    name: "Workflow Vide",
    description: "Démarrez avec une page blanche et créez sans limites.",
    icon: Wand2,
    color: "text-primary",
    bg: "bg-primary/10",
    popular: false,
    features: ["Sur Mesure", "Tous les Blocs", "Mode Expert"],
  },
  {
    id: "booking_pro",
    name: "Système de RDV Automatique",
    description: "Vérifie vos disponibilités et réserve des rendez-vous automatiquement sur WhatsApp.",
    icon: Calendar,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    popular: true,
    features: ["Disponibilités Calendrier", "Booking Auto", "Rappels"],
  },
  {
    id: "booking_mcp",
    name: "RDV Expert (Google & Calendly)",
    description: "Intégration avancée avec vos calendriers Google et Calendly via le protocole MCP.",
    icon: Cpu,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    popular: false,
    features: ["Google Calendar", "Calendly", "Gmail Automation"],
  },
];


// Catégories de nœuds pour les automatisations
const nodeCategories = [
  {
    id: "triggers",
    name: "Déclencheurs",
    icon: Zap,
    nodes: [
      {
        id: "whatsapp_message",
        name: "WhatsApp reçu",
        icon: WhatsAppIcon,
        description: "Quand un message WhatsApp arrive",
      },
      {
        id: "telegram_message",
        name: "Telegram reçu",
        icon: TelegramIcon,
        description: "Quand un message Telegram arrive",
      },
      {
        id: "keyword",
        name: "Mot-clé détecté",
        icon: Target,
        description: "Déclenche sur des mots spécifiques",
      },
      {
        id: "new_contact",
        name: "Nouveau contact",
        icon: Users,
        description: "Premier message d'un nouveau client",
      },
      {
        id: "scheduled",
        name: "Programmé",
        icon: Clock,
        description: "Déclenche à une heure précise",
      },
      {
        id: "webhook_trigger",
        name: "Webhook entrant",
        icon: Globe,
        description: "Déclenche via un appel API externe",
      },
    ],
  },
  {
    id: "ai",
    name: "Intelligence IA",
    icon: OpenAIIcon,
    nodes: [
      {
        id: "ai_agent",
        name: "Agent IA",
        icon: Bot,
        description: "Agent IA autonome avec outils et mémoire",
        isWide: true, // Flag pour le rendu large
        bottomInputs: ["Modèle de chat", "Mémoire", "Outil", "Base de Connaissance"], // Handles supplémentaires
      },
      {
        id: "gpt_analyze",
        name: "Analyser intention",
        icon: OpenAIIcon,
        description: "L'IA comprend ce que veut le client",
      },
      {
        id: "gpt_respond",
        name: "Réponse IA",
        icon: OpenAIIcon,
        description: "Génère une réponse personnalisée avec GPT",
      },
      {
        id: "sentiment",
        name: "Analyse sentiment",
        icon: HeartHandshake,
        description: "Détecte si le client est satisfait ou frustré",
      },
      {
        id: "ai_translate",
        name: "Traduction auto",
        icon: Globe,
        description: "Traduit automatiquement les messages",
      },
      {
        id: "ai_summarize",
        name: "Résumer conversation",
        icon: FileText,
        description: "Crée un résumé de la conversation",
      },
      {
        id: "ai_moderation",
        name: "Modération contenu",
        icon: ShieldCheck,
        description: "Détecte les violations et contenus inappropriés",
      },
      {
        id: "ai_analyze_image",
        name: "Analyser image",
        icon: ImageIcon,
        description: "L'IA décrit et analyse une image reçue",
      },
      {
        id: "ai_generate_image",
        name: "Générer image",
        icon: ImageIcon,
        description: "Crée une image avec DALL-E",
      },
      {
        id: "ai_generate_audio",
        name: "Générer audio",
        icon: Mic,
        description: "Convertit du texte en voix (TTS)",
      },
      {
        id: "ai_transcribe",
        name: "Transcrire audio",
        icon: Mic,
        description: "Convertit un audio en texte (Whisper)",
      },
      {
        id: "ai_generate_video",
        name: "Générer vidéo",
        icon: ImageIcon,
        description: "Crée une vidéo avec l'IA (Sora)",
      },
      {
        id: "ai_edit_image",
        name: "Éditer image",
        icon: ImageIcon,
        description: "Modifie une image avec l'IA",
      },
      {
        id: "ai_translate_audio",
        name: "Traduire audio",
        icon: Mic,
        description: "Traduit un enregistrement audio",
      },
      {
        id: "ai_delete_file",
        name: "Supprimer fichier",
        icon: FileText,
        description: "Supprime un fichier via l'API OpenAI",
      },
      {
        id: "ai_list_files",
        name: "Lister fichiers",
        icon: FileText,
        description: "Liste les fichiers disponibles",
      },
      {
        id: "ai_upload_file",
        name: "Téléverser fichier",
        icon: Upload,
        description: "Téléverse un fichier vers OpenAI",
      },
      {
        id: "ai_create_conversation",
        name: "Créer conversation",
        icon: BotMessageSquare,
        description: "Crée une nouvelle conversation",
      },
      {
        id: "ai_get_conversation",
        name: "Obtenir conversation",
        icon: BotMessageSquare,
        description: "Récupère une conversation existante",
      },
      {
        id: "ai_remove_conversation",
        name: "Supprimer conversation",
        icon: BotMessageSquare,
        description: "Supprime une conversation",
      },
      {
        id: "ai_update_conversation",
        name: "Mettre à jour conversation",
        icon: BotMessageSquare,
        description: "Met à jour une conversation",
      },
    ],
  },
  {
    id: "python_langchain",
    name: "Python & LangChain",
    icon: FlaskConical,
    nodes: [
      {
        id: "rag_knowledge",
        name: "Base de Connaissances",
        icon: Database,
        description: "Permet au bot de répondre en utilisant vos PDF et documents",
      },
      {
        id: "python_script",
        name: "Script Python",
        icon: Code,
        description: "Exécutez du code Python personnalisé pour des calculs complexes",
      },
      {
        id: "long_term_memory",
        name: "Mémoire Long Terme",
        icon: Clock,
        description: "Permet au bot de se souvenir du client sur plusieurs mois",
      },
      {
        id: "web_search_agent",
        name: "Recherche Web",
        icon: Globe,
        description: "L'IA cherche des informations en temps réel sur Internet",
      },
      {
        id: "ai_flow_logic",
        name: "Logique LangGraph",
        icon: GitBranch,
        description: "Créez des boucles de réflexion complexes pour l'IA",
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: ShoppingCart,
    nodes: [
      {
        id: "show_catalog",
        name: "Envoyer Catalogue",
        icon: Package,
        description: "Affiche la liste de vos produits",
      },
      {
        id: "add_to_cart",
        name: "Ajouter au panier",
        icon: ShoppingCart,
        description: "Détecte et ajoute un produit au panier",
      },
      {
        id: "show_cart",
        name: "Afficher panier",
        icon: ShoppingBag,
        description: "Montre le contenu du panier actuel",
      },
      {
        id: "checkout",
        name: "Passer commande",
        icon: CreditCard,
        description: "Finalise la commande et envoie le paiement",
      },
      {
        id: "order_status",
        name: "Suivi commande",
        icon: Truck,
        description: "Donne l'état d'une commande en cours",
      },
      {
        id: "apply_promo",
        name: "Code promo",
        icon: Trophy,
        description: "Applique une réduction au panier",
      },
    ],
  },
  {
    id: "messages",
    name: "Messages",
    icon: Send,
    nodes: [
      {
        id: "send_text",
        name: "Envoyer texte",
        icon: MessageSquare,
        description: "Envoie un message texte personnalisé",
      },
      {
        id: "send_image",
        name: "Envoyer image",
        icon: Image,
        description: "Envoie une image ou photo",
      },
      {
        id: "send_document",
        name: "Envoyer document",
        icon: FileText,
        description: "Envoie un PDF, facture ou fichier",
      },
      {
        id: "send_location",
        name: "Envoyer localisation",
        icon: MapPin,
        description: "Partage votre adresse/position GPS",
      },
      {
        id: "send_contact",
        name: "Envoyer contact",
        icon: Contact2,
        description: "Partage une fiche contact VCard",
      },
      {
        id: "send_audio",
        name: "Envoyer audio",
        icon: Mic,
        description: "Envoie un message vocal",
      },
      {
        id: "send_buttons",
        name: "Menu à choix",
        icon: ListChecks,
        description: "Propose des options cliquables",
      },
      {
        id: "tg_buttons",
        name: "Boutons Telegram",
        icon: TelegramIcon,
        description: "Boutons interactifs pour Telegram",
      },
    ],
  },
  {
    id: "logic",
    name: "Logique & Flux",
    icon: GitBranch,
    nodes: [
      {
        id: "condition",
        name: "Condition Si/Sinon",
        icon: GitBranch,
        description: "Branche selon une condition",
      },
      {
        id: "switch_router",
        name: "Aiguillage Multi-Chemins",
        icon: Filter,
        description: "Route vers plusieurs chemins selon la valeur",
      },

      {
        id: "delay",
        name: "Attendre",
        icon: Clock,
        description: "Pause avant la prochaine action",
      },
      {
        id: "loop",
        name: "Boucle",
        icon: Zap,
        description: "Répète une séquence d'actions",
      },
      {
        id: "set_variable",
        name: "Définir variable",
        icon: Box,
        description: "Stocke une valeur pour l'utiliser plus tard",
      },
      {
        id: "random_choice",
        name: "Choix aléatoire",
        icon: Sparkles,
        description: "Choisit aléatoirement une branche",
      },
      {
        id: "end_flow",
        name: "Fin du flux",
        icon: X,
        description: "Termine l'automatisation ici",
      },
    ],
  },
  {
    id: "crm",
    name: "CRM & Contacts",
    icon: Users,
    nodes: [
      {
        id: "save_contact",
        name: "Sauvegarder contact",
        icon: UserPlus,
        description: "Enregistre le client dans votre CRM",
      },
      {
        id: "add_tag",
        name: "Ajouter tag",
        icon: Target,
        description: "Tagge le contact (ex: 'VIP', 'Prospect')",
      },
      {
        id: "remove_tag",
        name: "Retirer tag",
        icon: UserMinus,
        description: "Retire un tag du contact",
      },
      {
        id: "update_contact",
        name: "Modifier contact",
        icon: Users,
        description: "Met à jour les infos du contact",
      },
      {
        id: "assign_agent",
        name: "Assigner agent",
        icon: HeartHandshake,
        description: "Transfère la conversation à un humain",
      },
      {
        id: "add_note",
        name: "Ajouter note",
        icon: FileText,
        description: "Ajoute une note interne sur le contact",
      },
    ],
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    nodes: [
      {
        id: "notify_email",
        name: "Email notification",
        icon: Mail,
        description: "Envoie un email à votre équipe",
      },
      {
        id: "notify_webhook",
        name: "Webhook sortant",
        icon: Globe,
        description: "Appelle une URL externe (Zapier, Make...)",
      },
      {
        id: "notify_slack",
        name: "Notification Slack",
        icon: MessageSquare,
        description: "Envoie un message dans un canal Slack",
      },
      {
        id: "notify_internal",
        name: "Alerte interne",
        icon: Bell,
        description: "Notification dans votre tableau de bord",
      },
    ],
  },
  {
    id: "calendar",
    name: "Rendez-vous",
    icon: Calendar,
    nodes: [
      {
        id: "check_availability",
        name: "Vérifier disponibilité",
        icon: Calendar,
        description: "Affiche les créneaux libres",
      },
      {
        id: "book_appointment",
        name: "Réserver RDV",
        icon: Check,
        description: "Crée un rendez-vous dans l'agenda",
      },
      {
        id: "cancel_appointment",
        name: "Annuler RDV",
        icon: X,
        description: "Annule un rendez-vous existant",
      },
      {
        id: "send_reminder",
        name: "Rappel RDV",
        icon: Bell,
        description: "Envoie un rappel avant le rendez-vous",
      },
    ],
  },
  {
    id: "security",
    name: "Sécurité",
    icon: ShieldCheck,
    nodes: [
      {
        id: "anti_ban",
        name: "Délai Anti-Ban",
        icon: ShieldCheck,
        description: "Délai aléatoire pour éviter les bans",
      },
      {
        id: "rate_limit",
        name: "Limite de messages",
        icon: Clock,
        description: "Limite le nombre de messages par minute",
      },
      {
        id: "block_spam",
        name: "Bloquer spam",
        icon: UserX,
        description: "Bloque les contacts qui spamment",
      },
      {
        id: "verify_human",
        name: "Vérification humain",
        icon: HelpCircle,
        description: "Pose une question simple anti-bot",
      },
    ],
  },
  {
    id: "groups",
    name: "Groupes WhatsApp",
    icon: Users,
    nodes: [
      {
        id: "create_group",
        name: "Créer groupe",
        icon: PlusCircle,
        description: "Crée un nouveau groupe WhatsApp",
      },
      {
        id: "add_participant",
        name: "Ajouter membre",
        icon: UserPlus,
        description: "Ajoute un contact au groupe",
      },
      {
        id: "remove_participant",
        name: "Retirer membre",
        icon: UserX,
        description: "Retire un membre du groupe",
      },
      {
        id: "group_announcement",
        name: "Mode annonce",
        icon: Megaphone,
        description: "Seuls les admins peuvent écrire",
      },
      {
        id: "bulk_add_members",
        name: "Ajout massif",
        icon: Users,
        description: "Ajoute plusieurs membres d'un coup",
      },
    ],
  },
  {
    id: "extraction",
    name: "Extraction & Data",
    icon: Search,
    nodes: [
      {
        id: "get_group_members",
        name: "Extraire membres",
        icon: UserSearch,
        description: "Récupère la liste des membres d'un groupe",
      },
      {
        id: "google_maps_extract",
        name: "Leads Google Maps",
        icon: Map,
        description: "Extrait des contacts pros depuis Google Maps",
      },
      {
        id: "group_link_finder",
        name: "Trouver groupes",
        icon: Link2,
        description: "Recherche des liens de groupes sur le web",
      },
      {
        id: "chat_list_collector",
        name: "Liste conversations",
        icon: ListChecks,
        description: "Récupère toutes vos discussions",
      },
      {
        id: "web_email_extract",
        name: "Extracteur web",
        icon: Globe,
        description: "Extrait emails et numéros depuis un site",
      },
    ],
  },
  {
    id: "advanced",
    name: "Avancé",
    icon: Cpu,
    nodes: [
      {
        id: "http_request",
        name: "Requête HTTP",
        icon: Globe,
        description: "Appelle une API externe (GET/POST)",
      },
      {
        id: "run_javascript",
        name: "Code JavaScript",
        icon: Cpu,
        description: "Exécute du code personnalisé",
      },
      {
        id: "google_sheets",
        name: "Google Sheets",
        icon: FileText,
        description: "Lit ou écrit dans une feuille Google",
      },
      {
        id: "database_query",
        name: "Base de données",
        icon: Box,
        description: "Requête SQL personnalisée",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Pro",
    icon: Megaphone,
    nodes: [
      {
        id: "number_filter",
        name: "Filtre numéros",
        icon: Filter,
        description: "Vérifie quels numéros ont WhatsApp",
      },
      {
        id: "whatsapp_warmer",
        name: "Warm-up compte",
        icon: Flame,
        description: "Prépare votre compte pour les campagnes",
      },
      {
        id: "mass_group_gen",
        name: "Générateur groupes",
        icon: LayoutTemplate,
        description: "Crée plusieurs groupes automatiquement",
      },
    ],
  },
];

// Produits exemple pour le catalogue
const sampleProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    image: "📱",
    stock: 50,
    labels: ["Apple", "Mobile"],
    description: "Le dernier smartphone d'Apple avec processeur A17 Pro.",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 1299,
    image: "💻",
    stock: 30,
    labels: ["Apple", "PC"],
    description: "Ordinateur ultra-portable et puissant.",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    price: 249,
    image: "🎧",
    stock: 100,
    labels: ["Audio", "Premium"],
    description: "Réduction de bruit active et son spatial.",
  },
];

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  labels: string[];
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  XOF: "XOF",
  CAD: "CAD$",
};

type ViewMode = "templates" | "builder" | "ai-assist" | "products";

type WorkflowNode = {
  id: number;
  type: string;
  name: string;
  config: string;
  x: number;
  y: number;
  connectedTo?: number;
  connectedToTrue?: number;
  connectedToFalse?: number;
  conditionalConnections?: {
    true?: number;
    false?: number;
  };
  [key: string]: any; // Pour supporter connectedTo_case_X et connectedTo_default
};

// Schema Header Component (n8n style)
function SchemaHeader({
  title,
  icon: Icon,
  isExpanded = true,
  isTrigger = false,
  children
}: {
  title: string;
  icon?: any;
  isExpanded?: boolean;
  isTrigger?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(isExpanded);

  return (
    <div className="mb-1">
      <div
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronDown
          className={`h-3 w-3 text-white/40 transition-transform ${expanded ? '' : '-rotate-90'}`}
        />
        {Icon && (
          <div className="h-3 w-3 flex items-center justify-center text-white/60">
            <Icon className="h-3 w-3" />
          </div>
        )}
        {isTrigger && (
          <svg viewBox="0 0 24 24" width="10" height="10" className="text-white/60" fill="currentColor">
            <path fillOpacity=".9" d="M13.225 1.023a1.5 1.5 0 0 1 .866.096l.115.056.109.065a1.5 1.5 0 0 1 .506.551l.055.115.045.119a1.5 1.5 0 0 1 .023.87l-.01.039-1.92 6.02-.018.046H20a2 2 0 0 1 1.556 3.26l-.059.066-9.9 10.2a1.5 1.5 0 0 1-1.803.3 1.5 1.5 0 0 1-.738-1.721l.01-.04 1.92-6.019.017-.046H4a2.002 2.002 0 0 1-1.555-3.26l.058-.067 9.9-10.2c.22-.233.507-.392.823-.45" />
          </svg>
        )}
        <span className="text-[11px] font-medium text-white/80 group-hover:text-white">{title}</span>
      </div>
      {expanded && (
        <div className="pl-4 mt-0.5 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

// Single Object Item Component with its own expansion state
function ObjectItem({
  name,
  value,
  basePath,
  depth = 1
}: {
  name: string;
  value: any;
  basePath: string;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const isObject = (typeof value === 'object' && value !== null) || Array.isArray(value);
  const valueType = Array.isArray(value) ? 'array' :
    value === null ? 'string' :
      typeof value === 'object' ? 'object' :
        typeof value as any;

  return (
    <div>
      <div
        draggable={!isObject}
        onDragStart={(e) => !isObject && e.dataTransfer.setData('text/plain', `{{${basePath}}}`)}
        className={`flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded ${isObject ? 'cursor-pointer' : 'cursor-move'} group`}
        style={{ paddingLeft: `${depth * 8 + 8}px` }}
        onClick={() => isObject && setExpanded(!expanded)}
      >
        {isObject && (
          <ChevronDown
            className={`h-3 w-3 text-white/40 transition-transform ${expanded ? '' : '-rotate-90'}`}
          />
        )}
        {!isObject && <div className="w-3" />}
        <div className="flex-shrink-0 text-white/50">
          {valueType === 'object' || valueType === 'array' ? (
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7l8.7 5l8.7-5M12 22V12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[11px] font-mono text-white/70 group-hover:text-white">{name}</span>
          {!isObject && (
            <span className="text-[10px] text-white/40 truncate flex-1">
              {String(value).length > 50 ? String(value).substring(0, 50) + '...' : String(value)}
            </span>
          )}
        </div>
      </div>
      {isObject && expanded && (
        <div className="pl-4">
          <RecursiveObjectItem obj={value} basePath={basePath} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}

// Recursive Object Item Component for execution data
function RecursiveObjectItem({
  obj,
  basePath,
  depth = 1
}: {
  obj: any;
  basePath: string;
  depth?: number;
}) {
  if (obj === null || obj === undefined) return null;

  if (Array.isArray(obj)) {
    return (
      <>
        {obj.map((item, idx) => (
          <ObjectItem
            key={idx}
            name={`[${idx}]`}
            value={item}
            basePath={`${basePath}[${idx}]`}
            depth={depth}
          />
        ))}
      </>
    );
  }

  if (typeof obj === 'object') {
    return (
      <>
        {Object.entries(obj).map(([key, value]) => (
          <ObjectItem
            key={key}
            name={key}
            value={value}
            basePath={`${basePath}.${key}`}
            depth={depth}
          />
        ))}
      </>
    );
  }

  return null;
}

// Schema Item Component (n8n style - draggable)
function SchemaItem({
  name,
  path,
  value,
  type,
  depth = 1,
  isCollapsible = false
}: {
  name: string;
  path: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  depth?: number;
  isCollapsible?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayValue = typeof value === 'object' && value !== null
    ? (isCollapsible ? '' : JSON.stringify(value))
    : String(value);

  const getTypeIcon = () => {
    switch (type) {
      case 'string':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6" />
          </svg>
        );
      case 'number':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6" />
          </svg>
        );
      case 'boolean':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m9 12l2 2l4-4" />
          </svg>
        );
      case 'object':
      case 'array':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7l8.7 5l8.7-5M12 22V12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', `{{${path}}}`);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded cursor-move group"
      style={{ paddingLeft: `${depth * 8 + 8}px` }}
    >
      {isCollapsible && (
        <div className="flex-shrink-0">
          <ChevronDown
            className={`h-3 w-3 text-white/40 transition-transform ${expanded ? '' : '-rotate-90'}`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          />
        </div>
      )}
      {!isCollapsible && <div className="w-3" />}

      <div className="flex-shrink-0 text-white/50">
        {getTypeIcon()}
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-[11px] font-mono text-white/70 group-hover:text-white">{name}</span>
        {displayValue && (
          <span className="text-[10px] text-white/40 truncate flex-1">
            {displayValue.length > 50 ? displayValue.substring(0, 50) + '...' : displayValue}
          </span>
        )}
      </div>
    </div>
  );
}

// Execution Data Section Component (inspired by Sim.ai)
function ExecutionDataSection({
  title,
  data,
  color = "emerald",
}: {
  title: string;
  data: any;
  color?: "blue" | "emerald" | "purple";
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatValueAsJson = (value: unknown): string => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const jsonString = useMemo(() => {
    if (!data) return '';
    return formatValueAsJson(data);
  }, [data]);

  const isEmpty = jsonString === '—' || jsonString === '';

  const colorClasses = {
    blue: {
      text: 'text-blue-400',
      textHover: 'group-hover:text-blue-300',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/10',
      code: 'text-blue-300/80',
    },
    emerald: {
      text: 'text-emerald-400',
      textHover: 'group-hover:text-emerald-300',
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/10',
      code: 'text-emerald-300/80',
    },
    purple: {
      text: 'text-purple-400',
      textHover: 'group-hover:text-purple-300',
      bg: 'bg-purple-500/5',
      border: 'border-purple-500/10',
      code: 'text-purple-300/80',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="flex min-w-0 flex-col gap-2 overflow-hidden">
      <div
        className="group flex cursor-pointer items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <span
          className={`font-medium text-[11px] transition-colors ${colors.text} ${colors.textHover}`}
        >
          {title}
        </span>
        <ChevronDown
          className={`h-3 w-3 ${colors.text} transition-transform ${colors.textHover}`}
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      {isExpanded && (
        <>
          {isEmpty ? (
            <div className={`rounded-lg ${colors.bg} ${colors.border} border px-3 py-2`}>
              <span className="text-[10px] text-muted-foreground">Aucune donnée</span>
            </div>
          ) : (
            <div className={`rounded-lg ${colors.bg} ${colors.border} border p-3`}>
              <pre className={`text-[10px] ${colors.code} font-mono overflow-x-auto max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words`}>
                {jsonString}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Free-form Draggable Node Component (n8n style)
function DraggableNode({
  node,
  nodeInfo,
  onDelete,
  onPositionChange,
  isSelected,
  onSelect,
  onNodeSelectOnly,
  onOpenSettings,
  zoom,
  isActiveStep,
  executionStatus,
  onStartConnect,
  onCompleteConnect,
  onAddNext,
  isConnecting,
  isDisconnected,
  isWhatsAppConnected,
}: {
  node: WorkflowNode;
  nodeInfo: any;
  onDelete: () => void;
  onPositionChange: (
    id: number,
    deltaX: number,
    deltaY: number,
    isSelected: boolean,
  ) => void;
  isSelected?: boolean;
  isActiveStep?: boolean;
  executionStatus?: "success" | "error" | "warning" | "skipped" | "running";
  onSelect: (e: React.MouseEvent) => void;
  onNodeSelectOnly: (e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  zoom: number;
  onStartConnect?: (branch?: "true" | "false") => void;
  onCompleteConnect?: () => void;
  onAddNext?: () => void;
  isConnecting?: boolean;
  isDisconnected?: boolean;
  isWhatsAppConnected?: boolean;
}) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Determine node color based on category
  const getCategoryColor = () => {
    if (node.type === "chariow")
      return {
        bg: "bg-[#E0E0E0]",
        border: "border-orange-500/30",
        text: "text-orange-400",
      };
    if (!nodeInfo?.category?.id)
      return {
        bg: "bg-[#1a1a1a]",
        border: "border-[#87a9ff]/30",
        text: "text-[#87a9ff]",
      };
    switch (nodeInfo.category.id) {
      case "triggers":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
        };
      case "ai":
        return {
          bg: "bg-[#000000]",
          border: "border-[#10a37f]/50",
          text: "text-white",
        };
      case "ecommerce":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-orange-500/30",
          text: "text-orange-400",
        };
      case "messages":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-blue-500/30",
          text: "text-blue-400",
        };
      case "logic":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-pink-500/30",
          text: "text-pink-400",
        };
      case "groups":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-purple-500/30",
          text: "text-purple-400",
        };
      case "extraction":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-cyan-500/30",
          text: "text-cyan-400",
        };
      case "marketing":
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
        };
      default:
        return {
          bg: "bg-[#1a1a1a]",
          border: "border-[#87a9ff]/30",
          text: "text-[#87a9ff]",
        };
    }
  };

  const colors = getCategoryColor();

  // Configuration check logic
  const isUnconfigured = (() => {
    try {
      const config = JSON.parse(node.config);
      const type = node.type;

      if (type === "gpt_analyze" || type === "gpt_respond") {
        return !config.system && !config.aiInstructions;
      }
      if (type === "ai_agent") {
        // AI Agent is configured if it has a system prompt or model selected
        return !config.systemPrompt && !config.model;
      }
      if (type === "sentiment") {
        // Sentiment is configured by default (has sensible defaults)
        return false;
      }
      if (type === "ai_translate") {
        // Translate needs a target language
        return !config.targetLanguage;
      }
      if (type === "ai_summarize") {
        // Summarize has sensible defaults
        return false;
      }
      if (
        type === "whatsapp_message" ||
        type === "telegram_message" ||
        type === "send_text" ||
        type === "send_image"
      ) {
        return !config.aiInstructions && !config.text && !config.imageUrl;
      }
      if (type === "keyword") {
        return !config.keywords && !config.aiInstructions;
      }
      if (type === "chariow") {
        return (
          !config.storeUrl && !config.storeDomain && !config.aiInstructions
        );
      }
      if (type === "calendar") {
        return !config.calendarId;
      }
      if (type === "condition") {
        return !config.condition;
      }
      if (type === "clock" || type === "delay") {
        return !config.delay && !config.time;
      }
      if (type === "trigger") {
        return !config.event && !config.type;
      }
      if (type === "bulk_add_members") {
        return !config.aiInstructions;
      }

      // Default check for others
      return Object.keys(config).length === 0;
    } catch {
      return true;
    }
  })();

  const isWhatsAppAlert =
    node.type === "whatsapp_message" && !isWhatsAppConnected;

  // Check if this is an AI Agent node (wider with bottom handles)
  const isAiAgentNode = node.type === "ai_agent";
  // Check if this is a condition node (needs 2 output ports)
  const isConditionNode = node.type === "condition";
  // Check if this is a switch/router node (needs multiple output ports)
  const isSwitchNode = node.type === "switch_router";

  // Parse switch config (stored as JSON string)
  const parsedSwitchConfig = (() => {
    if (!isSwitchNode) return { cases: [], hasDefault: true };
    try {
      const parsed = typeof node.config === 'string' ? JSON.parse(node.config) : node.config;
      return {
        cases: parsed?.cases || [],
        hasDefault: parsed?.hasDefault !== false
      };
    } catch {
      return { cases: [], hasDefault: true };
    }
  })();

  const switchCases = parsedSwitchConfig.cases;
  const switchHasDefault = parsedSwitchConfig.hasDefault;
  const switchOutputCount = switchCases.length + (switchHasDefault ? 1 : 0);


  const nodeWidth = isAiAgentNode ? 224 : isSwitchNode ? 160 : 96;
  const nodeHeight = isAiAgentNode ? 96 : isSwitchNode ? Math.max(120, 60 + switchOutputCount * 40) : 96;
  const bottomInputs = nodeInfo?.bottomInputs || [];


  // For AI Agent nodes, we need extra height for bottom handles
  const totalHeight = isAiAgentNode ? nodeHeight + 80 : nodeHeight;

  return (
    <motion.div
      key={node.id}
      onPan={(_, info) => {
        // Precision pan logic: update state directly, no transform conflicts
        onPositionChange(
          node.id,
          info.delta.x / zoom,
          info.delta.y / zoom,
          !!isSelected,
        );
      }}
      onPanStart={() => setIsDragging(true)}
      onPanEnd={() => setIsDragging(false)}
      onDoubleClick={onSelect}
      onClick={(e) => {
        // Single click selects but doesn't open panel
        onNodeSelectOnly(e);
      }}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
      onMouseDown={(e) => e.stopPropagation()}
      className={`absolute flex flex-col items-center cursor-grab active:cursor-grabbing group node-element ${isSelected ? "z-50" : "z-10"}`}
      style={{
        left: node.x,
        top: node.y,
        width: nodeWidth,
      }}
    >
      {/* Premium Focus Aura & Industrial Brackets */}
      <AnimatePresence>
        {(isSelected || isActiveStep) && (
          <>
            {/* Precision Corner Brackets */}
            <motion.div
              key="selection-brackets"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: isActiveStep ? 1.1 : 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute -inset-4 pointer-events-none"
            >
              <div
                className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm transition-colors ${isActiveStep ? "border-primary" : "border-primary/60"}`}
              />
              <div
                className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-sm transition-colors ${isActiveStep ? "border-primary" : "border-primary/60"}`}
              />
              <div
                className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-sm transition-colors ${isActiveStep ? "border-primary" : "border-primary/60"}`}
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-sm transition-colors ${isActiveStep ? "border-primary" : "border-primary/60"}`}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Execution Status Feedback */}
      <AnimatePresence>
        {executionStatus && (
          <motion.div
            key="execution-status"
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: executionStatus === "error" ? [0, -3, 3, -3, 3, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 -z-10 rounded-2xl pointer-events-none
                            ${executionStatus === "success" ? "ring-4 ring-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.5)]" : ""}
                            ${executionStatus === "error" ? "ring-4 ring-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.6)]" : ""}
                            ${executionStatus === "warning" ? "ring-4 ring-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.5)]" : ""}
                            ${executionStatus === "skipped" ? "ring-2 ring-zinc-500/40" : ""}
                        `}
          />
        )}
      </AnimatePresence>
      {/* Hover Toolbar */}
      <AnimatePresence>
        {(showToolbar || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#1f1f1f] border border-white/10 shadow-xl">
              <button
                className="h-7 w-7 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                title="Exécuter"
              >
                <Play className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings();
                }}
                className="h-7 w-7 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                title="Paramètres"
              >
                <Settings className="h-3 w-3" />
              </button>
              <div className="w-px h-4 bg-white/10 mx-0.5" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-7 w-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Node Box - n8n style */}
      <div
        className={`
                    relative
                    ${nodeInfo?.category?.id === "triggers"
            ? "rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl"
            : "rounded-2xl"
          }
                    ${colors.bg} ${colors.border} border-2
                    flex ${isAiAgentNode ? "flex-row items-center gap-3 px-4" : isSwitchNode ? "flex-col items-center pt-4" : "items-center justify-center"}
                    ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                    hover:shadow-lg transition-all duration-200
                `}
        style={{
          width: nodeWidth,
          height: isAiAgentNode ? totalHeight : nodeHeight
        }}
      >

        {/* Alert Icon (if unconfigured or disconnected) */}
        {(isUnconfigured || isWhatsAppAlert) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-2 -right-2 h-6 w-6 rounded-lg flex items-center justify-center shadow-lg z-30 ${isWhatsAppAlert ? "bg-red-500" : "bg-orange-500"}`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-black" />
          </motion.div>
        )}

        {/* Icon */}
        <div className={`${colors.text} ${isAiAgentNode ? "flex-shrink-0" : ""}`}>
          {nodeInfo && (
            <nodeInfo.icon
              className={node.type === "chariow" ? "h-16 w-16" : "h-10 w-10"}
            />
          )}
        </div>

        {/* AI Agent inline label */}
        {isAiAgentNode && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{node.name}</p>
          </div>
        )}

        {/* Trigger Badge (for trigger nodes) */}
        {nodeInfo?.category?.id === "triggers" && (
          <div className="absolute -top-2 -left-2 h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg">
            <Zap className="h-3 w-3 text-black fill-current" />
          </div>
        )}

        {/* Drag indicator */}
        <div className={`absolute ${isAiAgentNode ? "bottom-2 right-2" : "bottom-1 right-1"} opacity-30`}>
          <GripVertical className="h-3 w-3" />
        </div>

        {/* Connection Input Handle (left side) - clickable to receive connection */}
        <div
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/input"
          onClick={(e) => {
            e.stopPropagation();
            if (isConnecting && onCompleteConnect) {
              onCompleteConnect();
            }
          }}
        >
          <div
            className={`h-4 w-4 rounded-full bg-[#252525] border-2 transition-all
                        ${isConnecting ? "border-emerald-400 scale-125 animate-pulse" : ""}
                        ${isSelected || showToolbar ? "border-[#87a9ff]" : "border-zinc-600"}
                        group-hover/input:border-emerald-400 group-hover/input:scale-125
                    `}
          />
        </div>

        {/* Connection Output Handle(s) - single output for most nodes, dual for condition */}
        {isConditionNode ? (
          <>
            {/* Output Handle VRAI (top right) */}
            <div
              className="absolute right-0 top-1/4 translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/output-true"
              onClick={(e) => {
                e.stopPropagation();
                if (onStartConnect) {
                  onStartConnect("true");
                }
              }}
              title="Sortie VRAI"
            >
              <div
                className={`h-4 w-4 rounded-full bg-[#252525] border-2 transition-all
                            ${isDisconnected ? "border-orange-400" : ""}
                            ${isSelected || showToolbar ? "border-emerald-400" : "border-zinc-600"}
                            group-hover/output-true:border-emerald-400 group-hover/output-true:scale-125
                        `}
              />
            </div>
            {/* Output Handle FAUX (bottom right) */}
            <div
              className="absolute right-0 top-3/4 translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/output-false"
              onClick={(e) => {
                e.stopPropagation();
                if (onStartConnect) {
                  onStartConnect("false");
                }
              }}
              title="Sortie FAUX"
            >
              <div
                className={`h-4 w-4 rounded-full bg-[#252525] border-2 transition-all
                            ${isDisconnected ? "border-orange-400" : ""}
                            ${isSelected || showToolbar ? "border-red-400" : "border-zinc-600"}
                            group-hover/output-false:border-red-400 group-hover/output-false:scale-125
                        `}
              />
            </div>
          </>
        ) : isSwitchNode ? (
          <>
            {/* Multiple Output Handles for Switch Router - n8n style */}
            {switchCases.map((c: any, idx: number) => {
              const yPercent = ((idx + 1) / (switchOutputCount + 1)) * 100;
              const caseColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444", "#06b6d4", "#84cc16"];
              const color = c.color || caseColors[idx % caseColors.length];
              return (
                <div
                  key={c.id || idx}
                  className="absolute right-0 translate-x-[40px] -translate-y-1/2 z-20 flex items-center"
                  style={{ top: `${yPercent}%` }}
                >
                  {/* Label */}
                  <div
                    className="absolute right-full mr-2 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap"
                    style={{ backgroundColor: `${color}20`, color: color }}
                  >
                    {c.value || idx}
                  </div>

                  {/* Line + Dot + Plus button */}
                  <div className="flex items-center">
                    {/* Line */}
                    <div className="w-8 h-0.5" style={{ backgroundColor: color + "60" }} />

                    {/* Dot handle */}
                    <div
                      className="h-3 w-3 rounded-full cursor-pointer transition-all hover:scale-125"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStartConnect) {
                          onStartConnect(`case_${idx}`);
                        }
                      }}
                      title={`Sortie: ${c.value || `Cas ${idx}`}`}
                    />

                    {/* Plus button */}
                    <div className="w-4 h-0.5" style={{ backgroundColor: color + "40" }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddNext) onAddNext();
                      }}
                      className="h-5 w-5 rounded border flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderColor: color + "50",
                        color: color
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Default output */}
            {switchHasDefault && (
              <div
                className="absolute right-0 translate-x-[40px] -translate-y-1/2 z-20 flex items-center"
                style={{ top: `${((switchCases.length + 1) / (switchOutputCount + 1)) * 100}%` }}
              >
                {/* Label */}
                <div className="absolute right-full mr-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-700/50 text-zinc-400 whitespace-nowrap">
                  default
                </div>

                {/* Line + Dot + Plus button */}
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-zinc-600" />
                  <div
                    className="h-3 w-3 rounded-full bg-zinc-500 cursor-pointer transition-all hover:scale-125"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onStartConnect) {
                        onStartConnect("default");
                      }
                    }}
                    title="Sortie par défaut"
                  />
                  <div className="w-4 h-0.5 bg-zinc-700" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddNext) onAddNext();
                    }}
                    className="h-5 w-5 rounded bg-[#1a1a1a] border border-zinc-600 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-all hover:scale-110"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </>

        ) : (
          <div
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/output"
            onClick={(e) => {
              e.stopPropagation();
              if (onStartConnect) {
                onStartConnect();
              }
            }}
          >
            <div
              className={`h-4 w-4 rounded-full bg-[#252525] border-2 transition-all
                        ${isDisconnected ? "border-orange-400" : ""}
                        ${isSelected || showToolbar ? "border-[#87a9ff]" : "border-zinc-600"}
                        group-hover/output:border-[#87a9ff] group-hover/output:scale-125
                    `}
            />
          </div>
        )}


        {/* Plus Button (appears on hover) - shifted to avoid overlapping the handle */}
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center transition-opacity duration-200 ${showToolbar || isSelected ? "opacity-100" : "opacity-0"}`}
          style={{ right: "-45px" }}
        >
          <div className="w-4 h-0.5 bg-zinc-600" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddNext) onAddNext();
            }}
            className="h-6 w-6 rounded-md bg-[#252525] border border-zinc-600 hover:border-[#87a9ff] hover:bg-[#87a9ff]/10 flex items-center justify-center text-zinc-500 hover:text-[#87a9ff] transition-all shadow-xl"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Node Label - using fixed width to avoid shifting the box */}
      {!isAiAgentNode && (
        <div className={`mt-2 text-center ${isSwitchNode ? "w-40 -mx-0" : "w-[120px] -mx-[12px]"}`}>
          <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">

            {node.type === "whatsapp_message" && isWhatsAppConnected
              ? "WhatsApp Connecté"
              : node.name}
          </p>
          <p className="text-[9px] text-muted-foreground truncate uppercase font-bold opacity-30 tracking-widest">
            {nodeInfo?.category?.name || "Action"}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function NewWorkflowPage() {
  // Récupérer la session utilisateur (doit être au début avec tous les hooks)
  const { data: session } = useSession();
  const clientUserId = (session?.user as any)?.id || null;

  const [viewMode, setViewMode] = useState<ViewMode>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("Mon Workflow");
  const [automationId, setAutomationId] = useState("");
  const [nodes, setNodes] = useState<Array<WorkflowNode>>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [executionSequence, setExecutionSequence] = useState<any[]>([]);
  const [tgBotToken, setTgBotToken] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false);
  const [showAdvancedSentiment, setShowAdvancedSentiment] = useState(false);
  const [showAdvancedAnalyze, setShowAdvancedAnalyze] = useState(false);
  const [showAdvancedGpt, setShowAdvancedGpt] = useState(false);
  const isTelegramWorkflow = nodes.some(
    (n) => n.type === "telegram_message" || n.type === "tg_buttons",
  );
  const isLoaded = React.useRef(false);

  // Persistence: Load on mount
  useEffect(() => {
    const savedName = localStorage.getItem("draft_workflow_name");
    const savedId = localStorage.getItem("draft_automation_id");
    const savedNodes = localStorage.getItem("draft_workflow_nodes");

    if (savedName) setWorkflowName(savedName);
    if (savedId) {
      setAutomationId(savedId);
    } else {
      const newId = `auto_${Math.random().toString(36).substr(2, 9)}`;
      setAutomationId(newId);
      localStorage.setItem("draft_automation_id", newId);
    }
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (e) {
        console.error("Failed to parse nodes", e);
      }
    }
    const savedLogs = localStorage.getItem("draft_execution_logs");
    if (savedLogs) {
      try {
        setExecutionLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
    const savedTgToken = localStorage.getItem("draft_tg_token");
    if (savedTgToken) setTgBotToken(savedTgToken);

    isLoaded.current = true;
  }, []);

  // Persistence: Save on change
  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem("draft_workflow_name", workflowName);
  }, [workflowName]);

  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem("draft_workflow_nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem("draft_execution_logs", JSON.stringify(executionLogs));
  }, [executionLogs]);

  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem("draft_tg_token", tgBotToken);
  }, [tgBotToken]);

  const [rightPanelTab, setRightPanelTab] = useState<
    "inspect" | "simulate" | "logs"
  >("simulate");
  const [aiPrompt, setAiPrompt] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "triggers",
  );
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [parameterTab, setParameterTab] = useState<"parameters" | "settings">("parameters");
  const [parameterMode, setParameterMode] = useState<Record<string, "fixed" | "expression">>({});
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<number>>(
    new Set(),
  );
  const [zoom, setZoom] = useState(0.8); // Default zoom 80%
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false); // Instance Admin/Simulateur
  const [isClientWhatsAppConnected, setIsClientWhatsAppConnected] =
    useState(false); // Instance Client
  const [clientWhatsAppNumber, setClientWhatsAppNumber] = useState<
    string | null
  >(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [userAutomations, setUserAutomations] = useState<any[]>([]);
  const [isLoadingUserAutomations, setIsLoadingUserAutomations] =
    useState(false);

  // Fetch user automations on mount
  useEffect(() => {
    const fetchUserAutomations = async () => {
      setIsLoadingUserAutomations(true);
      try {
        const response = await fetch("/api/automations");
        const data = await response.json();
        if (data.success) {
          setUserAutomations(data.automations);
        }
      } catch (error) {
        console.error("Error fetching user automations:", error);
      } finally {
        setIsLoadingUserAutomations(false);
      }
    };

    fetchUserAutomations();
  }, []);

  const [isFlowAnimate, setIsFlowAnimate] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null); // null, 0 (node), 0.5 (wire), 1 (node)...
  const [nodeStatuses, setNodeStatuses] = useState<
    Record<number, "success" | "error" | "warning" | "skipped" | "running">
  >({});
  // Store input/output data for each node
  const [nodeExecutionData, setNodeExecutionData] = useState<
    Record<number, { input?: any; output?: any; context?: any }>
  >({});
  const [connectingFrom, setConnectingFrom] = useState<number | null>(null);
  const [executingNodeId, setExecutingNodeId] = useState<number | null>(null);
  const [connectingBranch, setConnectingBranch] = useState<"true" | "false" | null>(null); // Node ID we're connecting FROM
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // For drawing temp connection line
  const [isSaving, setIsSaving] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [launchSuccess, setLaunchSuccess] = useState(false);
  const [isAiInstructionsOpen, setIsAiInstructionsOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "📦",
    labels: "",
  });
  const [currency, setCurrency] = useState<"USD" | "EUR" | "XOF" | "CAD">(
    "USD",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300; // Un aperçu n'a pas besoin de plus
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Compression en JPEG avec qualité 0.7 pour gagner énormément d'espace
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          if (editingProduct) {
            setEditingProduct({ ...editingProduct, image: compressedBase64 });
          } else {
            setNewProduct({ ...newProduct, image: compressedBase64 });
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadUserAutomation = async (id: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/automations/${id}`);
      const data = await response.json();
      if (data.success && data.automation) {
        setAutomationId(data.automation.id);
        setWorkflowName(data.automation.name);
        if (data.automation.nodes) {
          setNodes(
            typeof data.automation.nodes === "string"
              ? JSON.parse(data.automation.nodes)
              : data.automation.nodes,
          );
        }
        if (data.automation.products) {
          setProducts(
            typeof data.automation.products === "string"
              ? JSON.parse(data.automation.products)
              : data.automation.products,
          );
        }
        setSelectedTemplate(data.automation.template);
        setViewMode("builder");
      }
    } catch (error) {
      console.error("Error loading user automation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isLoaded.current) return;
    try {
      localStorage.setItem("draft_products", JSON.stringify(products));
      localStorage.setItem("draft_currency", currency);
    } catch (e) {
      console.warn(
        "Storage quota exceeded for products, image might be too large.",
        e,
      );
    }
  }, [products, currency]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("draft_products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products", e);
      }
    }
    const savedCurrency = localStorage.getItem("draft_currency");
    if (savedCurrency) {
      setCurrency(savedCurrency as any);
    }
  }, []);
  // ID unique pour la connexion WhatsApp de cette automatisation spécifique
  const automationWhatsAppId =
    clientUserId && automationId ? `${clientUserId}_${automationId}` : null;

  useEffect(() => {
    const checkConnection = async () => {
      // Créer un AbortController pour gérer le timeout manuellement
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes de timeout

      try {
        const response = await fetch("http://localhost:8080/api/sessions", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          // Vérifier si une instance admin/simulateur est connectée
          const adminConnected = data.sessions.some(
            (s: any) =>
              s.status === "CONNECTED" &&
              (s.userId === "admin" || s.userId?.startsWith("auto_")),
          );
          setIsWhatsAppConnected(adminConnected);

          // Vérifier si le client a connecté son propre WhatsApp POUR CETTE AUTOMATISATION
          // On utilise un ID composite: clientUserId_automationId
          if (automationWhatsAppId) {
            const clientSession = data.sessions.find(
              (s: any) =>
                s.status === "CONNECTED" && s.userId === automationWhatsAppId,
            );
            setIsClientWhatsAppConnected(!!clientSession);
            if (clientSession?.jid) {
              setClientWhatsAppNumber(
                `+${clientSession.jid.split(":")[0].split("@")[0]}`,
              );
            } else {
              setClientWhatsAppNumber(null);
            }
          }
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        // Ignorer silencieusement les erreurs de connexion si le serveur n'est pas disponible
        // Cela permet à l'application de fonctionner même sans le serveur WhatsApp
        if (error.name === 'AbortError' || error.name === 'TypeError' || error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
          // Le serveur WhatsApp n'est pas disponible, on désactive les fonctionnalités WhatsApp
          setIsWhatsAppConnected(false);
          setIsClientWhatsAppConnected(false);
          setClientWhatsAppNumber(null);
          // Ne pas logger l'erreur en production pour éviter le spam dans la console
          if (process.env.NODE_ENV === 'development') {
            console.warn("WhatsApp server not available, running in offline mode");
          }
        } else {
          console.error("Failed to fetch sessions for builder:", error);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [automationWhatsAppId]);

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      // Sauvegarde locale de secours
      localStorage.setItem("draft_workflow_name", workflowName);
      localStorage.setItem("draft_workflow_nodes", JSON.stringify(nodes));
      localStorage.setItem("draft_automation_id", automationId);
      localStorage.setItem("draft_currency", currency);

      // Préparation du payload pour la base de données
      const triggerKeywords: string[] = [];
      let aiInstructions = "";

      nodes.forEach((node) => {
        try {
          const cfg = JSON.parse(node.config || "{}");
          if (cfg.keywords && Array.isArray(cfg.keywords)) {
            triggerKeywords.push(...cfg.keywords);
          }
          if (cfg.aiInstructions) {
            aiInstructions += cfg.aiInstructions + "\n";
          }
        } catch (e) {
          // Ignore
        }
      });

      const payload = {
        id: automationId,
        name: workflowName,
        nodes: nodes,
        template: selectedTemplate,
        products: products,
        currency: currency,
        triggerKeywords: triggerKeywords,
        aiInstructions: aiInstructions.trim() || null,
        whatsappNumber: clientWhatsAppNumber,
        telegramBotToken: tgBotToken || null,
        isActive: false, // Sauvegarde manuelle = Brouillon par défaut
      };

      const response = await fetch("/api/automations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur base de données");
      }
    } catch (e) {
      console.warn("Échec de la sauvegarde:", e);
    } finally {
      // Petit délai pour l'effet visuel du loader
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  // Fonction pour lancer/sauvegarder l'automatisation dans la base de données
  const handleLaunchAutomation = async () => {
    setIsLaunching(true);
    setLaunchError(null);
    setLaunchSuccess(false);

    try {
      // Extraire les mots-clés déclencheurs des nodes
      const triggerKeywords: string[] = [];
      nodes.forEach((node) => {
        try {
          const cfg = JSON.parse(node.config || "{}");
          if (cfg.keywords && Array.isArray(cfg.keywords)) {
            triggerKeywords.push(...cfg.keywords);
          }
        } catch (e) {
          // Ignore parse errors
        }
      });

      // Extraire les instructions IA globales
      let aiInstructions = "";
      nodes.forEach((node) => {
        try {
          const cfg = JSON.parse(node.config || "{}");
          if (cfg.aiInstructions) {
            aiInstructions += cfg.aiInstructions + "\n";
          }
        } catch (e) {
          // Ignore parse errors
        }
      });

      const payload = {
        id: automationId,
        name: workflowName,
        description: `Automatisation ${workflowName} créée le ${new Date().toLocaleDateString("fr-FR")}`,
        nodes: nodes,
        template: selectedTemplate,
        products: products,
        currency: currency,
        triggerKeywords: triggerKeywords,
        aiInstructions: aiInstructions.trim() || null,
        whatsappNumber: clientWhatsAppNumber,
        telegramBotToken: tgBotToken || null,
        isActive: true,
      };

      const response = await fetch("/api/automations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du lancement");
      }

      setLaunchSuccess(true);

      // Nettoyer le localStorage après sauvegarde réussie
      localStorage.removeItem("draft_workflow_name");
      localStorage.removeItem("draft_workflow_nodes");
      localStorage.removeItem("draft_automation_id");
      localStorage.removeItem("draft_products");
      localStorage.removeItem("draft_currency");

      // Fermer le modal après 2 secondes
      setTimeout(() => {
        setShowPublishModal(false);
        setLaunchSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error launching automation:", error);
      setLaunchError(
        error instanceof Error ? error.message : "Erreur inconnue",
      );
    } finally {
      setIsLaunching(false);
    }
  };

  const handleAddProduct = () => {
    const product = {
      ...newProduct,
      id: Date.now(),
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      labels: newProduct.labels
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l !== ""),
    };
    setProducts((prev) => [...prev, product as Product]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "📦",
      labels: "",
    });
    setIsProductModalOpen(false);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id
        ? {
          ...editingProduct,
          price: parseFloat(editingProduct.price) || 0,
          stock: parseInt(editingProduct.stock) || 0,
          labels:
            typeof editingProduct.labels === "string"
              ? editingProduct.labels
                .split(",")
                .map((l: string) => l.trim())
                .filter((l: string) => l !== "")
              : editingProduct.labels,
        }
        : p,
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Complete connection when clicking on target node
  const handleNodeConnect = (targetNodeId: number) => {
    if (connectingFrom !== null && connectingFrom !== targetNodeId) {
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === connectingFrom) {
            // If connecting from a condition node with a specific branch
            if (connectingBranch) {
              return {
                ...n,
                conditionalConnections: {
                  ...n.conditionalConnections,
                  [connectingBranch]: targetNodeId,
                },
              };
            }
            // Normal connection
            return { ...n, connectedTo: targetNodeId };
          }
          return n;
        }),
      );
      setConnectingFrom(null);
      setConnectingBranch(null);
    }
  };

  // Handle execution result from simulator
  const handleExecutionResult = (result: any) => {
    if (result.logs) {
      setExecutionLogs(result.logs);
    }
    if (result.executedNodes) {
      const statuses: Record<
        number,
        "success" | "error" | "warning" | "skipped"
      > = {};
      result.executedNodes.forEach((node: any) => {
        statuses[node.nodeId] = node.status;
      });
      setNodeStatuses(statuses);

      // Clear statuses after 5 seconds
      setTimeout(() => setNodeStatuses({}), 5000);
    }
  };

  // Orchestrate sequential node-by-node animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isFlowAnimate) {
      setActiveStep(null);
      return;
    }

    let current = 0;
    const totalSteps = nodes.length * 2 - 1; // Nodes and Wires

    const runStep = () => {
      setActiveStep(current / 2);

      // Timing: 600ms for node pulse, 800ms for wire travel
      const delay = current % 2 === 0 ? 600 : 800;

      current = (current + 1) % totalSteps;
      timeoutId = setTimeout(runStep, delay);
    };

    runStep();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isFlowAnimate, nodes.length]);

  const [selectionRect, setSelectionRect] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [nodePickerPos, setNodePickerPos] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.25));
  const handleZoomReset = () => setZoom(0.8);
  const handleZoomFit = () => setZoom(0.5);

  // Keyboard event handler for Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace to remove selected nodes
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeIds.size > 0) {
        // Don't delete if user is typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        setNodes((prev) => prev.filter((node) => !selectedNodeIds.has(node.id)));
        setSelectedNodeIds(new Set());
        setIsRightPanelOpen(false);
      }
      // Escape to clear selection
      if (e.key === 'Escape') {
        setSelectedNodeIds(new Set());
        setConnectingFrom(null);
        setNodePickerPos(null);
      }
      // Ctrl/Cmd + A to select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && viewMode === 'builder') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        setSelectedNodeIds(new Set(nodes.map((n) => n.id)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, nodes, viewMode]);

  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    const canvas = e.currentTarget as HTMLDivElement;
    const rect = canvas.getBoundingClientRect();
    // Account for scroll position
    const x = (e.clientX - rect.left + canvas.scrollLeft) / zoom;
    const y = (e.clientY - rect.top + canvas.scrollTop) / zoom;

    setIsSelecting(true);
    setSelectionRect({ x1: x, y1: y, x2: x, y2: y });
    setLastMousePos({ x: e.clientX, y: e.clientY });

    // If clicking without Ctrl/Meta, immediately clear (visually responsive)
    if (!e.ctrlKey && !e.metaKey) {
      setSelectedNodeIds(new Set());
      setIsRightPanelOpen(false);
      setNodePickerPos(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = e.currentTarget as HTMLDivElement;
    const rect = canvas.getBoundingClientRect();
    // Account for scroll position
    const x = (e.clientX - rect.left + canvas.scrollLeft) / zoom;
    const y = (e.clientY - rect.top + canvas.scrollTop) / zoom;

    // Track mouse position for connection drawing
    if (connectingFrom !== null) {
      setMousePos({ x, y });
    }

    if (!isSelecting || !selectionRect) return;

    setSelectionRect((prev) => (prev ? { ...prev, x2: x, y2: y } : null));

    // Calculate overlap with nodes
    const xMin = Math.min(selectionRect.x1, x);
    const xMax = Math.max(selectionRect.x1, x);
    const yMin = Math.min(selectionRect.y1, y);
    const yMax = Math.max(selectionRect.y1, y);

    const newlySelected = new Set<number>(
      e.ctrlKey || e.metaKey ? selectedNodeIds : [],
    );
    nodes.forEach((node) => {
      // Node size is roughly 96x120 (including label)
      const nodeWidth = 96;
      const nodeHeight = 120;

      const intersects =
        node.x < xMax &&
        node.x + nodeWidth > xMin &&
        node.y < yMax &&
        node.y + nodeHeight > yMin;

      if (intersects) {
        newlySelected.add(node.id);
      } else if (!e.ctrlKey && !e.metaKey) {
        newlySelected.delete(node.id);
      }
    });

    setSelectedNodeIds(newlySelected);
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!isSelecting) return;

    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - lastMousePos.x, 2) +
      Math.pow(e.clientY - lastMousePos.y, 2),
    );

    setIsSelecting(false);
    setSelectionRect(null);

    // Functional update to avoid stale state & definitively clear selection on click
    setSelectedNodeIds((current) => {
      if (dragDistance <= 5 && !e.ctrlKey && !e.metaKey) {
        // It was a simple click in the void - CLEAR EVERYTHING
        setIsRightPanelOpen(false);
        setNodePickerPos(null);
        return new Set();
      }
      if (current.size > 0 && dragDistance > 5) {
        setRightPanelTab("inspect");
        setIsRightPanelOpen(true);
      }
      return current;
    });
  };

  // Zoom controls... (duplicated but replacing previous zoom controls and clear selection)

  // Handle node selection (Ctrl/Cmd+Click for multi-select)
  const handleNodeSelect = (nodeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const isMultiSelect = event.ctrlKey || event.metaKey;

    setSelectedNodeIds((prev) => {
      const newSet = new Set(prev);
      if (isMultiSelect) {
        // Toggle selection
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
      } else {
        // Single selection
        newSet.clear();
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Clear selection when clicking on canvas (now integrated into mouseDown)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isSelecting) return;
    setSelectedNodeIds(new Set());
    setIsRightPanelOpen(false);
    setNodePickerPos(null);
    setConnectingFrom(null); // Cancel any pending connection
  };

  const hasTrigger = nodes.some((n) =>
    ["whatsapp_message", "keyword", "new_contact"].includes(n.type),
  );

  const insertNode = (
    index: number,
    nodeType: string,
    nodeName: string,
    x: number,
    y: number,
  ) => {
    const isTriggerType = [
      "whatsapp_message",
      "keyword",
      "new_contact",
    ].includes(nodeType);
    if (isTriggerType && hasTrigger) {
      alert("Un workflow ne peut avoir qu'un seul déclencheur.");
      return;
    }

    const newNode = {
      id: Date.now(),
      type: nodeType,
      name: nodeName,
      x,
      y,
      config: "Configuration par défaut...",
    };
    const newNodes = [...nodes];
    newNodes.splice(index, 0, newNode);
    setNodes(newNodes);
    setNodePickerPos(null);
    setSelectedNodeIds(new Set([newNode.id]));
    setIsRightPanelOpen(true);
    setRightPanelTab("inspect");
  };

  // Handle node position change (for free-form dragging) - moves all selected nodes together
  const handlePositionChange = (
    id: number,
    deltaX: number,
    deltaY: number,
    isSelected: boolean,
  ) => {
    setNodes((prev) =>
      prev.map((node) => {
        // If this node is being dragged
        if (node.id === id) {
          return { ...node, x: node.x + deltaX, y: node.y + deltaY };
        }
        // If this node is also selected (group move)
        if (isSelected && selectedNodeIds.has(node.id)) {
          return { ...node, x: node.x + deltaX, y: node.y + deltaY };
        }
        return node;
      }),
    );
  };

  // Add a new node at a specific position
  // Composants helper pour le style uniforme
  const FormField = ({
    label,
    children,
    className = ""
  }: {
    label: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <label className="text-sm text-white/80 font-medium shrink-0">{label}</label>
      {children}
    </div>
  );

  const ToggleSwitch = ({
    checked,
    onChange,
    className = ""
  }: {
    checked: boolean;
    onChange: () => void;
    className?: string;
  }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#10a37f]" : "bg-white/20"
        } ${className}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? "left-5" : "left-1"
          }`}
      />
    </button>
  );

  const StyledSelect = ({
    value,
    onChange,
    options,
    className = "",
    maxWidth = "180px"
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{ value: string; label: string }>;
    className?: string;
    maxWidth?: string;
  }) => (
    <select
      value={value}
      onChange={onChange}
      className={`flex-1 max-w-[${maxWidth}] bg-transparent border-none text-sm text-white font-medium cursor-pointer focus:outline-none text-right appearance-none ${className}`}
      style={{ direction: "rtl" }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  const StyledInput = ({
    value,
    onChange,
    placeholder,
    type = "text",
    className = ""
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    className?: string;
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex-1 bg-white/5 border border-white/10 rounded-lg h-9 px-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors ${className}`}
    />
  );

  // Fonction pour résoudre une expression en utilisant les données d'exécution
  const resolveExpression = (expression: string, currentNodeId: number): string => {
    if (!expression || !expression.trim()) return '';

    // Nettoyer l'expression (enlever {{ et }})
    let cleanExpr = expression.replace(/^\{\{|\}\}$/g, '').trim();

    // Si l'expression commence par un point (ex: .lastUserMessage), chercher dans le contexte global
    if (cleanExpr.startsWith('.')) {
      cleanExpr = cleanExpr.substring(1);
    }

    // Résoudre les chemins comme previous.output.field, contact.phone, etc.
    const parts = cleanExpr.split('.');
    let resolved: any = null;

    // Chercher dans les nœuds précédents
    const precedingNodes = nodes.filter(n => {
      const node = nodes.find(nd => nd.id === currentNodeId);
      if (!node) return false;
      // Vérifier si ce nœud est connecté au nœud actuel
      return n.connectedTo === currentNodeId ||
        (node.type === 'condition' && (n.connectedToTrue === currentNodeId || n.connectedToFalse === currentNodeId));
    });

    // Si l'expression commence par "previous.output"
    if (parts[0] === 'previous' && parts[1] === 'output') {
      const lastNode = precedingNodes[precedingNodes.length - 1];
      if (lastNode && nodeExecutionData[lastNode.id]?.output) {
        resolved = nodeExecutionData[lastNode.id].output;
        // Naviguer dans l'objet
        for (let i = 2; i < parts.length; i++) {
          resolved = resolved?.[parts[i]];
        }
      }
    }
    // Si l'expression commence par "contact"
    else if (parts[0] === 'contact') {
      // Utiliser les données d'exécution du trigger
      const triggerNode = nodes.find(n => n.type === 'whatsapp_message' || n.type === 'telegram_message');
      if (triggerNode && nodeExecutionData[triggerNode.id]?.output?.contact) {
        resolved = nodeExecutionData[triggerNode.id].output.contact;
        for (let i = 1; i < parts.length; i++) {
          resolved = resolved?.[parts[i]];
        }
      }
    }
    // Si l'expression commence par "message"
    else if (parts[0] === 'message') {
      const triggerNode = nodes.find(n => n.type === 'whatsapp_message' || n.type === 'telegram_message');
      if (triggerNode && nodeExecutionData[triggerNode.id]?.output) {
        resolved = nodeExecutionData[triggerNode.id].output;
        for (let i = 1; i < parts.length; i++) {
          resolved = resolved?.[parts[i]];
        }
      }
    }
    // Variables globales ($workflow, etc.)
    else if (parts[0] === '$workflow') {
      if (parts[1] === 'id') {
        resolved = automationId || 'N/A';
      }
    }
    // Variables du contexte d'exécution (lastUserMessage, etc.)
    else if (parts[0] === 'lastUserMessage' || cleanExpr === 'lastUserMessage') {
      const triggerNode = nodes.find(n => n.type === 'whatsapp_message' || n.type === 'telegram_message');
      if (triggerNode && nodeExecutionData[triggerNode.id]?.input?.lastUserMessage) {
        resolved = nodeExecutionData[triggerNode.id].input.lastUserMessage;
      } else if (triggerNode && nodeExecutionData[triggerNode.id]?.output?.text) {
        resolved = nodeExecutionData[triggerNode.id].output.text;
      }
    }
    // Autres variables du contexte
    else {
      // Chercher dans le contexte d'exécution du nœud actuel
      if (nodeExecutionData[currentNodeId]?.input) {
        const input = nodeExecutionData[currentNodeId].input;
        resolved = input;
        for (let i = 0; i < parts.length; i++) {
          resolved = resolved?.[parts[i]];
          if (resolved === undefined) break;
        }
      }

      // Si pas trouvé, chercher dans les nœuds précédents
      if (resolved === null || resolved === undefined) {
        for (const prevNode of precedingNodes.reverse()) {
          if (nodeExecutionData[prevNode.id]?.output) {
            resolved = nodeExecutionData[prevNode.id].output;
            for (let i = 0; i < parts.length; i++) {
              resolved = resolved?.[parts[i]];
            }
            if (resolved !== undefined) break;
          }
        }
      }
    }

    if (resolved === null || resolved === undefined) {
      return '—';
    }

    // Formater la valeur
    if (typeof resolved === 'object') {
      return JSON.stringify(resolved);
    }
    return String(resolved);
  };

  // Composant ExpressionInput avec syntax highlighting et preview (style CodeMirror/n8n)
  // Mémorisé pour éviter les re-renders inutiles
  const ExpressionInput = React.memo(({
    value: propValue,
    onChange,
    placeholder,
    className = "",
    isTextarea = false,
    onDrop,
    onDragOver,
    onDragLeave,
    currentNodeId
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    isTextarea?: boolean;
    onDrop?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
    currentNodeId?: number;
  }) => {
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const [hoveredExpression, setHoveredExpression] = useState<string | null>(null);
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    // Approche complètement non contrôlée : gérer la valeur directement via le DOM
    const onChangeRef = useRef(onChange);
    const isMountedRef = useRef(true);
    const [displayValue, setDisplayValue] = useState(propValue); // Pour le highlight uniquement
    const handleChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialValueRef = useRef(propValue);
    const isInitialMountRef = useRef(true);

    // Mettre à jour la ref de onChange
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Synchroniser la valeur d'affichage uniquement si le champ n'est pas focus
    useEffect(() => {
      if (isInitialMountRef.current) {
        isInitialMountRef.current = false;
        initialValueRef.current = propValue;
        return;
      }

      const activeElement = document.activeElement;
      if (activeElement !== inputRef.current) {
        // Mettre à jour la valeur de l'input si elle existe et n'est pas focus
        if (inputRef.current && (inputRef.current instanceof HTMLTextAreaElement || inputRef.current instanceof HTMLInputElement)) {
          inputRef.current.value = propValue;
          setDisplayValue(propValue);
        }
      }
    }, [propValue]);

    // Handler pour onChange - met à jour uniquement l'affichage, pas le parent
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (!isMountedRef.current) return;

      const newValue = e.currentTarget.value;
      setDisplayValue(newValue); // Pour le highlight uniquement

      // Ne pas appeler onChange pendant la saisie - seulement au blur
      // Cela évite complètement les re-renders pendant la saisie
    }, []);

    // Handler pour onBlur - synchronise avec le parent uniquement quand on quitte le champ
    const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newValue = e.currentTarget.value;

      // Synchroniser la valeur finale lors du blur
      if (isMountedRef.current && newValue !== propValue) {
        onChangeRef.current(newValue);
      }

      // Délai pour permettre les clics sur les éléments interactifs (dropdown, etc.)
      setTimeout(() => {
        const activeElement = document.activeElement;
        const target = e.currentTarget;
        // Vérifier si le focus est vraiment perdu (pas juste déplacé vers un enfant)
        if (activeElement !== target && !target.contains(activeElement)) {
          setIsFocused(false);
        }
      }, 150);
    }, [propValue]);

    // Cleanup au démontage
    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
        if (handleChangeTimeoutRef.current) {
          clearTimeout(handleChangeTimeoutRef.current);
        }
      };
    }, []);

    // Fonction pour créer le HTML avec syntax highlighting
    const getHighlightedHTML = (text: string): string => {
      if (!text) return '';
      // Échapper les caractères HTML
      const escapeHtml = (str: string) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      };

      // Regex pour trouver les expressions {{...}}
      const regex = /\{\{([^}]+)\}\}/g;
      let lastIndex = 0;
      let match;
      let result = '';

      while ((match = regex.exec(text)) !== null) {
        // Ajouter le texte avant l'expression
        if (match.index > lastIndex) {
          result += escapeHtml(text.substring(lastIndex, match.index));
        }

        const expr = match[1].trim();
        const resolvedValue = currentNodeId ? resolveExpression(expr, currentNodeId) : '—';

        // Ajouter l'expression colorée avec data attributes pour le tooltip
        result += `<span 
          class="text-[#10a37f] font-semibold cursor-help expression-tooltip" 
          data-expression="${escapeHtml(expr)}"
          data-resolved="${escapeHtml(resolvedValue)}"
        >${escapeHtml(`{{${match[1]}}}`)}</span>`;

        lastIndex = regex.lastIndex;
      }

      // Ajouter le texte restant
      if (lastIndex < text.length) {
        result += escapeHtml(text.substring(lastIndex));
      }

      return result || escapeHtml(text);
    };

    // Fonction pour résoudre toute l'expression (preview en bas)
    const getResolvedPreview = (text: string): string => {
      if (!text) return '';

      // Remplacer toutes les expressions {{...}} par leurs valeurs résolues
      const regex = /\{\{([^}]+)\}\}/g;
      let result = text;
      let match;

      while ((match = regex.exec(text)) !== null) {
        const expr = match[1].trim();
        const resolved = currentNodeId ? resolveExpression(expr, currentNodeId) : '—';
        result = result.replace(match[0], resolved);
      }

      return result;
    };

    // Synchroniser le scroll entre input et highlight
    const syncScroll = () => {
      if (inputRef.current && highlightRef.current) {
        highlightRef.current.scrollTop = (inputRef.current as HTMLTextAreaElement).scrollTop || 0;
        highlightRef.current.scrollLeft = (inputRef.current as HTMLInputElement).scrollLeft || 0;
      }
    };

    // Classes de base (sans padding/height pour éviter les duplications)
    const baseClasses = `w-full bg-white/5 border border-white/10 rounded-lg font-mono text-xs focus:border-primary/50 focus:outline-none transition-colors ${className}`;
    // Classes spécifiques pour le type d'input
    const inputClasses = isTextarea
      ? `p-3 pr-10 resize-none min-h-[60px] overflow-y-auto text-transparent caret-white`
      : `h-9 px-3 pr-10 text-transparent caret-white`;


    if (isTextarea) {
      return (
        <div className="relative">
          {/* Textarea transparent pour la saisie */}
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            defaultValue={initialValueRef.current}
            key={`textarea-${currentNodeId || 'default'}`} // Key stable basée sur currentNodeId
            onChange={(e) => {
              syncScroll();
              handleChange(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              // Forcer le focus pour éviter qu'il soit perdu
              if (e.currentTarget !== document.activeElement) {
                e.currentTarget.focus();
              }
            }}
            onBlur={handleBlur}
            onScroll={syncScroll}
            onDrop={(e) => {
              e.preventDefault();
              const data = e.dataTransfer.getData('text/plain');
              if (data.startsWith('{{')) {
                const textarea = e.currentTarget;
                const currentValue = textarea.value;
                const cursorPos = textarea.selectionStart || currentValue.length;
                const newValue = currentValue.slice(0, cursorPos) + data + currentValue.slice(cursorPos);
                textarea.value = newValue;
                setDisplayValue(newValue);
                // Déclencher onChange manuellement
                const syntheticEvent = {
                  currentTarget: textarea,
                } as React.ChangeEvent<HTMLTextAreaElement>;
                handleChange(syntheticEvent);
                // Préserver le focus après le drop
                requestAnimationFrame(() => {
                  if (textarea) {
                    textarea.focus();
                    const newCursorPos = cursorPos + data.length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                  }
                });
              }
              if (onDrop) onDrop(e);
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`${baseClasses} ${inputClasses}`}
            style={{
              color: 'transparent',
              caretColor: 'white',
              position: 'relative',
              zIndex: 10,
              background: 'transparent'
            }}
            placeholder={placeholder}
            spellCheck={false}
          />
          {/* Overlay avec syntax highlighting - pointer-events none pour permettre la saisie */}
          <div
            ref={highlightRef}
            className="absolute inset-0 font-mono text-xs whitespace-pre-wrap break-words overflow-hidden text-white pointer-events-none"
            style={{
              padding: '12px',
              borderRadius: '8px',
              minHeight: '60px',
              overflowY: 'auto',
              overflowX: 'hidden',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('expression-tooltip')) {
                const expr = target.getAttribute('data-expression');
                if (expr) {
                  setHoveredExpression(expr);
                  setHoverPosition({ x: e.clientX, y: e.clientY });
                }
              }
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('expression-tooltip')) {
                setHoveredExpression(null);
                setHoverPosition(null);
              }
            }}
            onMouseMove={(e) => {
              if (hoveredExpression) {
                setHoverPosition({ x: e.clientX, y: e.clientY });
              }
            }}
            dangerouslySetInnerHTML={{ __html: getHighlightedHTML(displayValue) || `<span class="text-white/30">${placeholder || ''}</span>` }}
          />

          {/* Preview résolu en bas - texte simple */}
          {displayValue && displayValue.includes('{{') && (
            <div className="mt-2">
              <div className="text-[9px] text-muted-foreground/60 mb-0.5">Résultat résolu:</div>
              <div className="text-[10px] font-mono text-white/80 break-words">
                {getResolvedPreview(displayValue) || '—'}
              </div>
            </div>
          )}

          {/* Tooltip au survol */}
          {hoveredExpression && hoverPosition && (
            <div
              className="fixed z-50 px-2 py-1 rounded bg-black/95 border border-white/20 shadow-lg pointer-events-none"
              style={{
                left: `${hoverPosition.x + 10}px`,
                top: `${hoverPosition.y + 10}px`,
                maxWidth: '300px'
              }}
            >
              <div className="text-[9px] text-white/60 mb-0.5">{hoveredExpression}</div>
              <div className="text-[10px] font-mono text-[#10a37f] font-semibold">
                {currentNodeId ? resolveExpression(hoveredExpression, currentNodeId) : '—'}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Input transparent pour la saisie - doit être au-dessus */}
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          defaultValue={initialValueRef.current}
          key={`input-${currentNodeId || 'default'}`} // Key stable basée sur currentNodeId
          onChange={(e) => {
            syncScroll();
            handleChange(e);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onScroll={syncScroll}
          onDrop={(e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            if (data.startsWith('{{')) {
              const input = e.currentTarget;
              const currentValue = input.value;
              const cursorPos = input.selectionStart || currentValue.length;
              const newValue = currentValue.slice(0, cursorPos) + data + currentValue.slice(cursorPos);
              input.value = newValue;
              setDisplayValue(newValue);
              // Déclencher onChange manuellement
              const syntheticEvent = {
                currentTarget: input,
              } as React.ChangeEvent<HTMLInputElement>;
              handleChange(syntheticEvent);
              // Préserver le focus après le drop
              requestAnimationFrame(() => {
                if (input) {
                  input.focus();
                  const newCursorPos = cursorPos + data.length;
                  input.setSelectionRange(newCursorPos, newCursorPos);
                }
              });
            }
            if (onDrop) onDrop(e);
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`${baseClasses} ${inputClasses}`}
          style={{
            color: 'transparent',
            caretColor: 'white',
            position: 'relative',
            zIndex: 10,
            background: 'transparent'
          }}
          placeholder={placeholder}
          spellCheck={false}
        />
        {/* Overlay avec syntax highlighting - pointer-events none sauf pour les tooltips */}
        <div
          ref={highlightRef}
          className="absolute inset-0 font-mono text-xs flex items-center overflow-hidden text-white pointer-events-none"
          style={{
            padding: '0 12px',
            borderRadius: '8px',
            height: '36px',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('expression-tooltip')) {
              const expr = target.getAttribute('data-expression');
              if (expr) {
                setHoveredExpression(expr);
                setHoverPosition({ x: e.clientX, y: e.clientY });
              }
            }
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('expression-tooltip')) {
              setHoveredExpression(null);
              setHoverPosition(null);
            }
          }}
          onMouseMove={(e) => {
            if (hoveredExpression) {
              setHoverPosition({ x: e.clientX, y: e.clientY });
            }
          }}
          dangerouslySetInnerHTML={{ __html: getHighlightedHTML(displayValue) || `<span class="text-white/30">${placeholder || ''}</span>` }}
        />

        {/* Preview résolu en bas - texte simple */}
        {displayValue && displayValue.includes('{{') && (
          <div className="mt-1.5">
            <div className="text-[9px] text-muted-foreground/60 mb-0.5">Résultat:</div>
            <div className="text-[10px] font-mono text-white/80 truncate" title={getResolvedPreview(displayValue)}>
              {getResolvedPreview(displayValue) || '—'}
            </div>
          </div>
        )}

        {/* Tooltip au survol */}
        {hoveredExpression && hoverPosition && (
          <div
            className="fixed z-50 px-2 py-1 rounded bg-black/95 border border-white/20 shadow-lg pointer-events-none"
            style={{
              left: `${hoverPosition.x + 10}px`,
              top: `${hoverPosition.y + 10}px`,
              maxWidth: '300px'
            }}
          >
            <div className="text-[9px] text-white/60 mb-0.5">{hoveredExpression}</div>
            <div className="text-[10px] font-mono text-[#10a37f] font-semibold">
              {currentNodeId ? resolveExpression(hoveredExpression, currentNodeId) : '—'}
            </div>
          </div>
        )}
      </div>
    );
  });

  // Fonction pour obtenir les outputs disponibles d'un nœud basé sur son type
  const getNodeOutputs = (nodeType: string, nodeConfig?: string): Record<string, any> => {
    try {
      const config = nodeConfig ? JSON.parse(nodeConfig) : {};

      switch (nodeType) {
        case 'gpt_analyze':
          // Outputs basés sur les intentions configurées par l'utilisateur
          const configuredIntents = config.intents || [];
          if (configuredIntents.length > 0) {
            const intentNames = configuredIntents.map((i: any) => i.name).filter(Boolean);
            const outputs: Record<string, any> = {
              intent: `string - Intention détectée parmi: ${intentNames.join(', ')}`,
              intent_confidence: 'number - Score de confiance (0-100)',
            };
            // Ajouter un booléen pour chaque intention
            configuredIntents.forEach((intent: any) => {
              if (intent.name) {
                const safeKey = `is_${intent.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                outputs[safeKey] = `boolean - Vrai si intention "${intent.name}"`;
              }
            });
            return outputs;
          }
          // Aucune intention configurée - retourner un avertissement
          return {
            _warning: '⚠️ Configurez des intentions dans le panneau de droite'
          };

        case 'gpt_respond':
          return {
            response: 'string - Réponse générée par l\'IA',
            tokens: 'number - Nombre de tokens utilisés',
            temperature: 'number - Température utilisée pour la génération (0-1)'
          };

        case 'ai_agent':
          return {
            response: 'string - Réponse de l\'agent IA',
            toolCalls: 'array - Outils utilisés',
            tokens: 'number - Nombre de tokens utilisés'
          };

        case 'sentiment':
          // Outputs basés sur les options cochées
          const sentimentOutputs: Record<string, any> = {
            sentiment: 'string - Sentiment (positif/négatif/neutre)',
            score: 'number - Score de sentiment (0-100)',
          };
          if (config.detectEmotions !== false) {
            sentimentOutputs.emotion = 'string - Émotion détectée (joie, colère, tristesse...)';
          }
          if (config.detectTone !== false) {
            sentimentOutputs.tone = 'string - Ton du message (formel, informel, urgent...)';
          }
          if (config.detectUrgency !== false) {
            sentimentOutputs.urgency = 'string - Niveau d\'urgence (faible, moyen, élevé)';
          }
          return sentimentOutputs;

        case 'condition':
          return {
            conditionPassed: 'boolean - Résultat de la condition (true/false)',
            testValue: 'any - Valeur testée',
            operator: 'string - Opérateur utilisé'
          };

        case 'show_catalog':
          return {
            products: 'array - Liste des produits affichés',
            totalProducts: 'number - Nombre total de produits'
          };

        case 'add_to_cart':
          return {
            cart: 'array - Panier mis à jour',
            item: 'object - Article ajouté',
            totalPrice: 'number - Prix total du panier'
          };

        case 'show_cart':
          return {
            cart: 'array - Contenu du panier',
            totalPrice: 'number - Prix total',
            itemCount: 'number - Nombre d\'articles'
          };

        case 'checkout':
          return {
            paymentUrl: 'string - URL de paiement',
            orderId: 'string - ID de la commande',
            totalAmount: 'number - Montant total'
          };

        case 'apply_promo':
          return {
            discount: 'number - Montant de la réduction',
            newTotal: 'number - Nouveau total après réduction',
            promoCode: 'string - Code promo appliqué'
          };

        case 'save_contact':
          return {
            contactId: 'string - ID du contact créé',
            phone: 'string - Numéro de téléphone',
            tags: 'array - Tags appliqués'
          };

        case 'check_availability':
          return {
            available: 'boolean - Créneau disponible',
            slots: 'array - Créneaux disponibles',
            nextAvailable: 'string - Prochain créneau disponible'
          };

        case 'book_appointment':
          return {
            appointmentId: 'string - ID du rendez-vous',
            date: 'string - Date réservée',
            time: 'string - Heure réservée',
            confirmationCode: 'string - Code de confirmation'
          };

        case 'http_request':
          return {
            status: 'number - Code de statut HTTP',
            data: 'any - Données de la réponse',
            headers: 'object - En-têtes de la réponse'
          };

        case 'database_query':
          return {
            results: 'array - Résultats de la requête',
            rowCount: 'number - Nombre de lignes retournées'
          };

        case 'ai_generate_image':
          return {
            imageUrl: 'string - URL de l\'image générée',
            prompt: 'string - Prompt utilisé'
          };

        case 'ai_analyze_image':
          return {
            description: 'string - Description de l\'image',
            objects: 'array - Objets détectés',
            text: 'string - Texte extrait (OCR)'
          };

        case 'ai_generate_audio':
          return {
            audioUrl: 'string - URL de l\'audio généré',
            duration: 'number - Durée en secondes'
          };

        case 'ai_transcribe':
          return {
            text: 'string - Texte transcrit',
            language: 'string - Langue détectée'
          };

        case 'ai_translate':
          return {
            translatedText: 'string - Texte traduit',
            sourceLanguage: 'string - Langue source',
            targetLanguage: 'string - Langue cible'
          };

        case 'ai_summarize':
          return {
            summary: 'string - Résumé de la conversation',
            keyPoints: 'array - Points clés extraits',
            wordCount: 'number - Nombre de mots'
          };

        case 'ai_moderation':
          return {
            isViolation: 'boolean - Violation détectée',
            category: 'string - Catégorie de violation',
            confidence: 'number - Niveau de confiance'
          };

        case 'delay':
          return {
            delayed: 'boolean - Délai terminé',
            duration: 'number - Durée du délai en secondes'
          };

        case 'set_variable':
          return {
            variableName: 'string - Nom de la variable',
            variableValue: 'any - Valeur de la variable'
          };

        case 'loop':
          return {
            iterations: 'number - Nombre d\'itérations',
            currentIndex: 'number - Index actuel',
            items: 'array - Éléments traités'
          };

        case 'random_choice':
          return {
            selectedPath: 'string - Chemin sélectionné',
            randomValue: 'number - Valeur aléatoire générée'
          };

        case 'add_tag':
        case 'remove_tag':
          return {
            tags: 'array - Tags mis à jour',
            contactId: 'string - ID du contact'
          };

        case 'update_contact':
          return {
            contactId: 'string - ID du contact mis à jour',
            updatedFields: 'object - Champs mis à jour'
          };

        case 'assign_agent':
          return {
            agentId: 'string - ID de l\'agent assigné',
            contactId: 'string - ID du contact'
          };

        case 'add_note':
          return {
            noteId: 'string - ID de la note',
            contactId: 'string - ID du contact'
          };

        case 'cancel_appointment':
          return {
            appointmentId: 'string - ID du rendez-vous annulé',
            cancelled: 'boolean - Annulation réussie'
          };

        case 'send_reminder':
          return {
            reminderSent: 'boolean - Rappel envoyé',
            appointmentId: 'string - ID du rendez-vous'
          };

        case 'order_status':
          return {
            status: 'string - Statut de la commande',
            trackingNumber: 'string - Numéro de suivi',
            estimatedDelivery: 'string - Date de livraison estimée'
          };

        case 'create_group':
          return {
            groupId: 'string - ID du groupe créé',
            groupName: 'string - Nom du groupe'
          };

        case 'add_participant':
        case 'remove_participant':
          return {
            success: 'boolean - Opération réussie',
            participants: 'array - Liste des participants'
          };

        case 'group_announcement':
          return {
            messageId: 'string - ID du message',
            sent: 'boolean - Message envoyé'
          };

        case 'bulk_add_members':
          return {
            added: 'number - Nombre de membres ajoutés',
            failed: 'number - Nombre d\'échecs'
          };

        case 'google_sheets':
          return {
            rows: 'array - Lignes retournées',
            rowCount: 'number - Nombre de lignes'
          };

        case 'run_javascript':
          return {
            result: 'any - Résultat du code JavaScript',
            executionTime: 'number - Temps d\'exécution en ms'
          };

        case 'whatsapp_message':
        case 'telegram_message':
        case 'keyword':
        case 'new_contact':
        case 'scheduled':
        case 'webhook_trigger':
          return {
            message: 'string - Message reçu',
            from: 'string - Numéro/ID de l\'expéditeur',
            timestamp: 'string - Horodatage du message',
            contact: 'object - Informations du contact'
          };

        default:
          return {
            output: 'any - Sortie du nœud',
            success: 'boolean - Succès de l\'exécution'
          };
      }
    } catch (e) {
      return {
        output: 'any - Sortie du nœud'
      };
    }
  };

  // Fonction pour obtenir les outputs disponibles des nœuds précédents
  const getAvailableOutputs = (currentNodeId: number) => {
    const outputs: Array<{ nodeId: number; nodeName: string; nodeType: string; outputs: Array<{ key: string; label: string; description: string }> }> = [];

    // D'abord, ajouter les outputs des triggers (toujours disponibles)
    const triggerNodes = nodes.filter(n =>
      n.type === 'whatsapp_message' ||
      n.type === 'telegram_message' ||
      n.type === 'keyword' ||
      n.type === 'new_contact' ||
      n.type === 'scheduled' ||
      n.type === 'webhook_trigger'
    );

    triggerNodes.forEach(triggerNode => {
      const nodeInfo = nodeCategories
        .flatMap(cat => cat.nodes)
        .find(n => n.id === triggerNode.type);

      const nodeOutputs: Array<{ key: string; label: string; description: string }> = [];

      // Outputs spécifiques pour les triggers WhatsApp/Telegram
      if (triggerNode.type === 'whatsapp_message' || triggerNode.type === 'telegram_message') {
        nodeOutputs.push(
          { key: 'message', label: 'Message', description: 'Le contenu du message reçu' },
          { key: 'from', label: 'Expéditeur', description: 'Le numéro/ID de l\'expéditeur' },
          { key: 'timestamp', label: 'Horodatage', description: 'La date et heure du message' },
          { key: 'contact.phone', label: 'Téléphone contact', description: 'Le numéro de téléphone du contact' },
          { key: 'contact.name', label: 'Nom contact', description: 'Le nom du contact' },
          { key: 'contact.id', label: 'ID contact', description: 'L\'identifiant unique du contact' },
          { key: 'messageId', label: 'ID message', description: 'L\'identifiant unique du message' },
          { key: 'messageType', label: 'Type message', description: 'Le type de message (text, image, audio, etc.)' }
        );
      } else {
        // Pour les autres triggers, utiliser les outputs génériques
        const triggerOutputs = getNodeOutputs(triggerNode.type, triggerNode.config);
        Object.entries(triggerOutputs).forEach(([key, desc]) => {
          const description = typeof desc === 'string' ? desc : 'Output du trigger';
          nodeOutputs.push({ key, label: key, description });
        });
      }

      if (nodeOutputs.length > 0) {
        outputs.push({
          nodeId: triggerNode.id,
          nodeName: nodeInfo?.name || triggerNode.type,
          nodeType: triggerNode.type,
          outputs: nodeOutputs
        });
      }
    });

    // Trouver tous les nœuds qui précèdent le nœud actuel dans le workflow
    const visited = new Set<number>();
    const findPrecedingNodes = (nodeId: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Ignorer les triggers (déjà ajoutés)
      if (node.type === 'whatsapp_message' ||
        node.type === 'telegram_message' ||
        node.type === 'keyword' ||
        node.type === 'new_contact' ||
        node.type === 'scheduled' ||
        node.type === 'webhook_trigger') {
        return;
      }

      // Si ce nœud est connecté au nœud actuel, ajouter ses outputs
      if (node.connectedTo === currentNodeId) {
        const nodeInfo = nodeCategories
          .flatMap(cat => cat.nodes)
          .find(n => n.id === node.type);

        const nodeOutputs: Array<{ key: string; label: string; description: string }> = [];

        // Définir les outputs selon le type de nœud
        switch (node.type) {
          case 'gpt_analyze':
            // Générer les outputs basés sur les intentions configurées
            const analyzeConfig = node.config ? JSON.parse(node.config) : {};
            const configuredIntents = analyzeConfig.intents || [];

            if (configuredIntents.length > 0) {
              // Output principal : l'intention détectée parmi celles configurées
              const intentNames = configuredIntents.map((i: any) => i.name).filter(Boolean).join(', ');
              nodeOutputs.push(
                { key: '{intent}', label: 'Intention détectée', description: `L'intention parmi: ${intentNames}` },
                { key: '{intent_confidence}', label: 'Confiance', description: 'Score de confiance (0-100)' }
              );
              // Ajouter un output pour chaque intention configurée
              configuredIntents.forEach((intent: any) => {
                if (intent.name) {
                  const safeKey = intent.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                  nodeOutputs.push(
                    { key: `{is_${safeKey}}`, label: `Est "${intent.name}"`, description: `Vrai si l'intention est "${intent.name}"` }
                  );
                }
              });
            } else {
              // Aucune intention configurée - afficher un avertissement
              nodeOutputs.push(
                { key: '{intent}', label: '⚠️ Non configuré', description: 'Configurez des intentions dans le panneau de droite' }
              );
            }
            break;
          case 'gpt_respond':
          case 'ai_agent':
            nodeOutputs.push(
              { key: '{ai_response}', label: 'Réponse IA', description: 'La réponse générée par l\'IA' },
              { key: '{ai_message}', label: 'Message IA', description: 'Le message complet de l\'IA' }
            );
            break;
          case 'sentiment':
            // Outputs dynamiques basés sur la configuration
            const sentCfg = node.config ? JSON.parse(node.config) : {};
            nodeOutputs.push(
              { key: '{sentiment}', label: 'Sentiment', description: 'Positif, négatif ou neutre' },
              { key: '{score}', label: 'Score', description: 'Score de 0 à 100' }
            );
            if (sentCfg.detectEmotions !== false) {
              nodeOutputs.push({ key: '{emotion}', label: 'Émotion', description: 'Joie, colère, tristesse...' });
            }
            if (sentCfg.detectTone !== false) {
              nodeOutputs.push({ key: '{tone}', label: 'Ton', description: 'Formel, informel, urgent...' });
            }
            if (sentCfg.detectUrgency !== false) {
              nodeOutputs.push({ key: '{urgency}', label: 'Urgence', description: 'Faible, moyen, élevé' });
            }
            break;
          case 'ai_translate':
            nodeOutputs.push(
              { key: '{translated_text}', label: 'Texte traduit', description: 'Le texte traduit' },
              { key: '{source_language}', label: 'Langue source', description: 'La langue d\'origine détectée' },
              { key: '{target_language}', label: 'Langue cible', description: 'La langue de traduction' }
            );
            break;
          case 'ai_summarize':
            nodeOutputs.push(
              { key: '{summary}', label: 'Résumé', description: 'Le résumé de la conversation' },
              { key: '{summary_length}', label: 'Longueur résumé', description: 'Le nombre de mots du résumé' }
            );
            break;
          case 'ai_moderation':
            nodeOutputs.push(
              { key: '{moderation_result}', label: 'Résultat modération', description: 'Le résultat de la modération' },
              { key: '{is_violation}', label: 'Violation détectée', description: 'Si une violation a été détectée' },
              { key: '{violation_category}', label: 'Catégorie violation', description: 'La catégorie de violation' }
            );
            break;
          case 'ai_analyze_image':
            nodeOutputs.push(
              { key: '{image_description}', label: 'Description image', description: 'La description de l\'image' },
              { key: '{image_analysis}', label: 'Analyse image', description: 'L\'analyse complète de l\'image' }
            );
            break;
          case 'ai_generate_image':
            nodeOutputs.push(
              { key: '{generated_image_url}', label: 'URL image générée', description: 'L\'URL de l\'image générée' },
              { key: '{image_prompt}', label: 'Prompt utilisé', description: 'Le prompt utilisé pour générer l\'image' }
            );
            break;
          case 'ai_transcribe':
            nodeOutputs.push(
              { key: '{transcription}', label: 'Transcription', description: 'Le texte transcrit de l\'audio' },
              { key: '{audio_language}', label: 'Langue audio', description: 'La langue détectée dans l\'audio' }
            );
            break;
          case 'add_to_cart':
            nodeOutputs.push(
              { key: '{product_added}', label: 'Produit ajouté', description: 'Le nom du produit ajouté' },
              { key: '{product_id}', label: 'ID produit', description: 'L\'ID du produit ajouté' },
              { key: '{quantity}', label: 'Quantité', description: 'La quantité ajoutée' }
            );
            break;
          case 'checkout':
            nodeOutputs.push(
              { key: '{order_id}', label: 'ID commande', description: 'L\'ID de la commande créée' },
              { key: '{order_total}', label: 'Total commande', description: 'Le total de la commande' },
              { key: '{payment_url}', label: 'URL paiement', description: 'L\'URL de paiement' }
            );
            break;
          case 'order_status':
            nodeOutputs.push(
              { key: '{order_status}', label: 'Statut commande', description: 'Le statut de la commande' },
              { key: '{delivery_date}', label: 'Date livraison', description: 'La date de livraison prévue' }
            );
            break;
          case 'apply_promo':
            nodeOutputs.push(
              { key: '{promo_code}', label: 'Code promo', description: 'Le code promo appliqué' },
              { key: '{discount_amount}', label: 'Montant réduction', description: 'Le montant de la réduction' },
              { key: '{final_total}', label: 'Total final', description: 'Le total après réduction' }
            );
            break;
          case 'condition':
            nodeOutputs.push(
              { key: '{condition_result}', label: 'Résultat condition', description: 'Le résultat de la condition (true/false)' }
            );
            break;
          case 'set_variable':
            nodeOutputs.push(
              { key: '{variable_value}', label: 'Valeur variable', description: 'La valeur de la variable définie' }
            );
            break;
        }

        // Outputs généraux disponibles pour tous les nœuds
        const generalOutputs = [
          { key: '{last_user_message}', label: 'Dernier message', description: 'Le dernier message reçu du client' },
          { key: '{user_name}', label: 'Nom utilisateur', description: 'Le nom du client' },
          { key: '{user_phone}', label: 'Téléphone', description: 'Le numéro de téléphone du client' },
          { key: '{user_email}', label: 'Email', description: 'L\'email du client' }
        ];

        if (nodeOutputs.length > 0) {
          outputs.push({
            nodeId: node.id,
            nodeName: node.name || nodeInfo?.name || 'Nœud',
            nodeType: node.type,
            outputs: nodeOutputs
          });
        }

        // Ajouter les outputs généraux une seule fois
        if (outputs.length === 0 || !outputs.some(o => o.outputs.some(out => out.key === '{last_user_message}'))) {
          outputs.push({
            nodeId: -1,
            nodeName: 'Variables globales',
            nodeType: 'global',
            outputs: generalOutputs
          });
        }
      }

      // Continuer à chercher les nœuds précédents
      nodes.forEach(n => {
        const isTargetMatch = n.connectedTo === nodeId ||
          (n.conditionalConnections && Object.values(n.conditionalConnections).includes(nodeId));
        if (isTargetMatch) {
          findPrecedingNodes(n.id);
        }
      });

    };

    // Commencer depuis tous les nœuds déclencheurs
    nodes.forEach(n => {
      if (['whatsapp_message', 'telegram_message', 'keyword', 'new_contact'].includes(n.type)) {
        findPrecedingNodes(n.id);
      }
    });

    return outputs;
  };

  // Composant OutputSelector pour insérer des outputs dans les champs
  const OutputSelector = ({
    onInsert,
    currentNodeId,
    className = ""
  }: {
    onInsert: (value: string) => void;
    currentNodeId: number;
    className?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const availableOutputs = getAvailableOutputs(currentNodeId);

    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-[10px] font-bold uppercase transition-all"
        >
          <Zap className="h-3 w-3" />
          <span>Variables</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-black/95 border border-white/10 rounded-xl shadow-2xl z-50 p-3 space-y-2">
            {availableOutputs.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-xs">
                Aucune variable disponible. Les variables apparaîtront après avoir ajouté des nœuds précédents.
              </div>
            ) : (
              availableOutputs.map((nodeOutput) => (
                <div key={nodeOutput.nodeId} className="space-y-1">
                  <div className="px-2 py-1 text-[9px] font-bold uppercase text-primary/60 tracking-wider">
                    {nodeOutput.nodeName}
                  </div>
                  {nodeOutput.outputs.map((output) => (
                    <button
                      key={output.key}
                      type="button"
                      onClick={() => {
                        onInsert(output.key);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-[10px] font-mono text-primary group-hover:text-primary font-bold">
                          {output.key}
                        </code>
                        <Sparkles className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-[9px] text-white/80 font-medium">{output.label}</div>
                      <div className="text-[8px] text-white/40 mt-0.5">{output.description}</div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  // Composant VariableInsertButton - version compacte pour les champs d'expression
  const VariableInsertButton = ({
    onInsert,
    currentNodeId,
    className = ""
  }: {
    onInsert: (value: string) => void;
    currentNodeId: number;
    className?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const availableOutputs = getAvailableOutputs(currentNodeId);

    // Fermer le menu si on clique en dehors
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    return (
      <div className={`relative inline-flex items-center ${className}`} ref={buttonRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors shrink-0"
          title="Insérer une variable"
        >
          <Zap className="h-3.5 w-3.5" />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-80 max-h-96 overflow-y-auto bg-black/95 border border-white/10 rounded-lg shadow-xl z-[100] p-3 space-y-2 custom-scrollbar">
            {availableOutputs.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-xs">
                Aucune variable disponible
              </div>
            ) : (
              availableOutputs.map((nodeOutput) => (
                <div key={nodeOutput.nodeId} className="space-y-1">
                  <div className="px-2 py-1 text-[9px] font-bold uppercase text-primary/60 tracking-wider">
                    {nodeOutput.nodeName}
                  </div>
                  {nodeOutput.outputs.map((output) => (
                    <button
                      key={output.key}
                      type="button"
                      onClick={() => {
                        onInsert(`{{${output.key}}}`);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-[10px] font-mono text-[#10a37f] group-hover:text-[#10a37f] font-semibold">
                          {`{{${output.key}}}`}
                        </code>
                        <Sparkles className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-[9px] text-white/80 font-medium">{output.label}</div>
                      <div className="text-[8px] text-white/40 mt-0.5">{output.description}</div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const addNodeAtPosition = (
    nodeType: string,
    nodeName: string,
    x?: number,
    y?: number,
  ) => {
    const isTriggerType = [
      "whatsapp_message",
      "keyword",
      "new_contact",
    ].includes(nodeType);
    if (isTriggerType && hasTrigger) {
      alert("Un workflow ne peut avoir qu'un seul déclencheur.");
      return;
    }

    const lastNode = nodes[nodes.length - 1];
    const newX = x ?? (lastNode ? lastNode.x + 250 : 100);
    const newY = y ?? (lastNode ? lastNode.y : 100);

    // Default configs based on type - now using structured JSON
    let defaultConfig = "{}";

    if (nodeType === "whatsapp_message" || nodeType === "telegram_message") {
      defaultConfig = JSON.stringify({ aiInstructions: "" });
    } else if (nodeType === "gpt_analyze") {
      defaultConfig = JSON.stringify({
        model: "gpt-4o",
        system: "Tu es un expert en analyse d'intention client. Ton rôle est de comprendre précisément ce que veut le client : identifier ses besoins, ses intentions, ses émotions et les actions qu'il souhaite entreprendre. Analyse le message et fournis une réponse structurée avec : l'intention principale, les besoins identifiés, le niveau d'urgence, et les prochaines actions recommandées.",
        temperature: 0.7,
        aiInstructions: "",
      });
    } else if (nodeType === "gpt_respond") {
      defaultConfig = JSON.stringify({
        model: "gpt-4o",
        system: "Tu es un assistant utile.",
        temperature: 0.7,
        aiInstructions: "",
      });
    } else if (nodeType === "sentiment") {
      defaultConfig = JSON.stringify({
        model: "gpt-4o-mini",
        target: "last_message",
        outputFormat: "score",
        threshold: -0.5,
        detectEmotions: true,
        detectTone: true,
        detectUrgency: true,
        actions: {
          positive: "continue",
          negative: "escalate",
          neutral: "continue",
        },
      });
    } else if (nodeType === "send_text") {
      defaultConfig = JSON.stringify({
        text: "",
        aiInstructions: "",
      });
    } else if (nodeType === "show_catalog") {
      defaultConfig = JSON.stringify({
        category: "all",
        layout: "grid",
        selectedProducts: [],
        aiInstructions: "",
      });
    } else if (nodeType === "add_to_cart") {
      defaultConfig = JSON.stringify({
        productId: "",
        quantity: 1,
        autoDetect: true,
      });
    } else if (nodeType === "show_cart") {
      defaultConfig = JSON.stringify({});
    } else if (nodeType === "checkout") {
      defaultConfig = JSON.stringify({
        gateway: "moneroo",
        currency: "XOF",
        paymentUrl: "",
        successUrl: "",
        failureUrl: "",
        testMode: true,
      });
    } else if (nodeType === "order_status") {
      defaultConfig = JSON.stringify({
        orderId: "",
        autoDetect: true,
      });
    } else if (nodeType === "apply_promo") {
      defaultConfig = JSON.stringify({
        promoCode: "",
        discountType: "percentage",
        discountValue: 10,
      });
    } else if (nodeType === "anti_ban") {
      defaultConfig = JSON.stringify({ min: 2, max: 10 });
    } else if (nodeType === "keyword") {
      defaultConfig = JSON.stringify({ keywords: "", aiInstructions: "" });
    } else if (nodeType === "delay") {
      defaultConfig = JSON.stringify({ delaySeconds: 5, aiInstructions: "" });
    } else if (nodeType === "chariow") {
      defaultConfig = JSON.stringify({
        action: "view",
        currency: "XOF",
        aiInstructions: "",
      });
    } else if (nodeType === "switch_router") {
      defaultConfig = JSON.stringify({
        field: "intent",
        cases: [
          { id: Date.now(), value: "commande", label: "Commande", color: "#10b981" },
          { id: Date.now() + 1, value: "question", label: "Question", color: "#3b82f6" },
          { id: Date.now() + 2, value: "plainte", label: "Plainte", color: "#ef4444" },
        ],
        hasDefault: true
      });
    } else if (nodeType === "condition") {
      defaultConfig = JSON.stringify({
        field: "intent",
        operator: "equals",
        value: "",
        templateType: "my_intent"
      });
    }


    const newNode = {
      id: Date.now(),
      type: nodeType,
      name: nodeName,
      config: defaultConfig,
      x: newX,
      y: newY,
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeIds(new Set([newNode.id]));
    setIsRightPanelOpen(true);
    setRightPanelTab("inspect");
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);

    if (templateId === "chatbot_intelligent") {
      setNodes([
        { id: 1, type: "whatsapp_message", name: "WhatsApp Reçu", config: JSON.stringify({ autoReply: true }), x: 50, y: 250, connectedTo: 2 },
        { id: 2, type: "rag_knowledge", name: "Base de Connaissances", config: JSON.stringify({ knowledgeBaseId: "manual", knowledgeContent: "Expert Wozif Connect." }), x: 300, y: 250, connectedTo: 3 },
        { id: 3, type: "send_text", name: "Réponse IA", config: JSON.stringify({ text: "{{aiAnswer}}" }), x: 550, y: 250 },
      ]);
      setWorkflowName("Mon Chatbot IA");
    } else if (templateId === "agent_expert_pro") {
      setNodes([
        { id: 1, type: "whatsapp_message", name: "Message Client", config: JSON.stringify({ autoReply: true }), x: 50, y: 250, connectedTo: 2 },
        { id: 2, type: "ai_agent", name: "Agent IA Expert", config: JSON.stringify({ instructions: "Expert Agent", model: "gpt-4o", dataSources: { urls: ["https://wozif.com"], files: [], mcpProviders: [] } }), x: 300, y: 250, connectedTo: 3 },
        { id: 3, type: "send_text", name: "Envoi", config: JSON.stringify({ text: "{{aiAnswer}}" }), x: 550, y: 250 },
      ]);
      setWorkflowName("Agent IA Complet");
    } else if (templateId === "python_workflow") {
      setNodes([
        { id: 1, type: "whatsapp_message", name: "Entrée", config: JSON.stringify({}), x: 50, y: 250, connectedTo: 2 },
        { id: 2, type: "python_script", name: "Script Python", config: JSON.stringify({ script: "results['message'] = 'Hello'" }), x: 300, y: 250, connectedTo: 3 },
        { id: 3, type: "send_text", name: "Sortie", config: JSON.stringify({ text: "{{message}}" }), x: 550, y: 250 },
      ]);
      setWorkflowName("Workflow Python");
    } else if (templateId === "service_client_intelligent") {
      setNodes([
        {
          id: 1,
          type: "whatsapp_message",
          name: "Message Client",
          config: JSON.stringify({ autoReply: true }),
          x: 50,
          y: 300,
          connectedTo: 2
        },
        {
          id: 2,
          type: "gpt_analyze",
          name: "Analyse Intention & Sentiment",
          config: JSON.stringify({
            categories: "salutation,question_prix,demande_produit,plainte,remerciement,demande_aide,commande,annulation,autre",
            aiInstructions: "Analyse le message du client pour détecter son intention et son sentiment."
          }),
          x: 300,
          y: 300,
          connectedTo: 3
        },
        {
          id: 3,
          type: "condition",
          name: "Client Mécontent ?",
          config: JSON.stringify({
            field: "sentiment_score",
            operator: "less_than",
            value: "-0.3"
          }),
          x: 550,
          y: 300,
          connectedToTrue: 4,
          connectedToFalse: 5
        },
        {
          id: 4,
          type: "gpt_respond",
          name: "Réponse Empathique",
          config: JSON.stringify({
            system: "Tu es un conseiller empathique. Le client est mécontent (sentiment: {{sentiment}}, urgence: {{urgency}}/5). Excuse-toi et propose une solution rapide. Reste bref (2-3 phrases).",
            model: "gpt-4o"
          }),
          x: 800,
          y: 150
        },
        {
          id: 5,
          type: "gpt_respond",
          name: "Réponse Standard",
          config: JSON.stringify({
            system: "Tu es un assistant amical. L'intention du client est: {{intent}}. Réponds de manière concise et utile (2-3 phrases).",
            model: "gpt-4o"
          }),
          x: 800,
          y: 450
        },
        {
          id: 6,
          type: "end_flow",
          name: "Fin",
          config: JSON.stringify({}),
          x: 1050,
          y: 300
        }
      ]);
      setWorkflowName("Service Client IA");
    } else if (templateId === "booking_pro") {
      setNodes([
        {
          id: 1,
          type: "whatsapp_message",
          name: "Message Client",
          config: JSON.stringify({ autoReply: true }),
          x: 50,
          y: 300,
          connectedTo: 2
        },
        {
          id: 2,
          type: "gpt_analyze",
          name: "Analyse Intention",
          config: JSON.stringify({
            categories: "reservation,information,autre",
            aiInstructions: "Détecte si le client veut prendre un rendez-vous (reservation)."
          }),
          x: 300,
          y: 300,
          connectedTo: 3
        },
        {
          id: 3,
          type: "switch_router",
          name: "Routage RDV",
          config: JSON.stringify({
            field: "intent",
            cases: [
              { id: 1, value: "reservation", label: "Réservation", color: "#f43f5e" }
            ],
            hasDefault: true
          }),
          x: 550,
          y: 300,
          conditionalConnections: {
            case_0: 4,
            default: 7
          }
        },
        {
          id: 4,
          type: "check_availability",
          name: "Vérifier Disponibilités",
          config: JSON.stringify({
            duration: 30,
            dateRange: 7,
            timezone: "Africa/Abidjan"
          }),
          x: 900,
          y: 150,
          connectedTo: 5
        },
        {
          id: 5,
          type: "send_text",
          name: "Proposer Créneaux",
          config: JSON.stringify({
            text: "C'est noté ! Voici nos disponibilités pour les 7 prochains jours :\n\n{{formatted_slots}}\n\nLequel vous convient ?"
          }),
          x: 1150,
          y: 150,
          connectedTo: 6
        },
        {
          id: 6,
          type: "book_appointment",
          name: "Réserver",
          config: JSON.stringify({
            title: "RDV Client {{userName}}",
            duration: 30
          }),
          x: 1400,
          y: 150
        },
        {
          id: 7,
          type: "gpt_respond",
          name: "Réponse Aide",
          config: JSON.stringify({
            system: "Le client demande autre chose qu'un RDV. Réponds poliment et demande comment tu peux l'aider d'autre.",
            model: "gpt-4o"
          }),
          x: 900,
          y: 450
        }
      ]);
      setWorkflowName("Système de RDV Automatique");
    } else if (templateId === "booking_mcp") {
      setNodes([
        {
          id: 1,
          type: "whatsapp_message",
          name: "Message Client",
          config: JSON.stringify({ autoReply: true }),
          x: 50,
          y: 300,
          connectedTo: 2
        },
        {
          id: 2,
          type: "ai_agent",
          name: "Agent Réservations Expert",
          config: JSON.stringify({
            instructions: "Tu es un agent expert en réservations. Ton rôle est de vérifier les disponibilités sur Google Calendar ou Calendly et d'aider le client à réserver un créneau. Tu peux aussi envoyer des emails de confirmation via Gmail.",
            model: "gpt-4o",
            dataSources: {
              urls: [],
              files: [],
              mcpProviders: [
                "http://localhost:3003",
                "http://localhost:3004",
                "http://localhost:3005"
              ]
            }
          }),
          x: 350,
          y: 300,
          connectedTo: 3
        },
        {
          id: 3,
          type: "send_text",
          name: "Réponse Agent",
          config: JSON.stringify({ text: "{{aiAnswer}}" }),
          x: 650,
          y: 300
        }
      ]);
      setWorkflowName("RDV Expert (Google & Calendly)");
    } else if (templateId === "custom") {

      setNodes([]);
      setWorkflowName("Nouveau Workflow");
    }


    setViewMode("builder");
  };
  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;

    // Simuler la génération IA avec des positions
    setNodes([
      {
        id: 1,
        type: "whatsapp_message",
        name: "Déclencheur",
        config: JSON.stringify({ aiInstructions: `Contexte: ${aiPrompt}` }),
        x: 100,
        y: 300,
        connectedTo: 2,
      },
      {
        id: 2,
        type: "gpt_analyze",
        name: "Analyse IA",
        config: JSON.stringify({
          model: "gpt-4o",
          system: `Analyse la demande suivante: ${aiPrompt}`,
          aiInstructions: "Sois perspicace.",
        }),
        x: 300,
        y: 300,
        connectedTo: 3,
      },
      {
        id: 3,
        type: "gpt_respond",
        name: "Action",
        config: JSON.stringify({
          model: "gpt-4o",
          system: `Réponds à la situation: ${aiPrompt}`,
          aiInstructions: "Ton amical et pro.",
        }),
        x: 500,
        y: 300,
      },
    ]);
    setWorkflowName("Workflow IA - " + aiPrompt.slice(0, 20) + "...");
    setViewMode("builder");
  };

  const getNodeInfo = (nodeType: string) => {
    for (const category of nodeCategories) {
      const node = category.nodes.find((n) => n.id === nodeType);
      if (node) return { ...node, category };
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader />

        {/* Mode: Templates Selection */}
        <AnimatePresence mode="wait">
          {viewMode === "templates" && (
            <motion.div
              key="templates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-8"
            >
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-black text-white mb-3">
                    Créez votre Automatisation WhatsApp
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                    Choisissez un template pour démarrer rapidement ou décrivez
                    ce que vous voulez à notre IA
                  </p>
                </div>

                {/* AI Assistant Card */}
                <Card className="border-primary/30 bg-primary/5 mb-8 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Wand2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                          Assistant IA{" "}
                          <Badge className="bg-primary text-black text-[9px]">
                            Nouveau
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Décrivez simplement ce que vous voulez automatiser et
                          notre IA créera le workflow pour vous
                        </p>
                        <div className="flex gap-2">
                          <Input
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Ex: Je veux un bot qui répond aux questions sur mes produits et prend les commandes..."
                            className="flex-1 bg-black/20 border-white/10 text-sm"
                          />
                          <Button
                            onClick={handleAIGenerate}
                            className="bg-primary text-black font-bold gap-2"
                          >
                            <Sparkles className="h-4 w-4" /> Générer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Creations Section - Premium Design */}
                {userAutomations.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                      <Zap className="h-4 w-4" /> Mes créations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {userAutomations.map((automation) => (
                        <motion.div
                          key={automation.id}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className="relative cursor-pointer group"
                            onClick={() =>
                              handleLoadUserAutomation(automation.id)
                            }
                          >
                            {/* Card Background with Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 overflow-hidden">
                              {/* Glow Effect */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />

                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <Zap className="h-5 w-5 text-primary" />
                                </div>

                                {/* Status Badge */}
                                <div
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${automation.status === "ACTIVE"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    }`}
                                >
                                  <div
                                    className={`h-1.5 w-1.5 rounded-full ${automation.status === "ACTIVE"
                                      ? "bg-emerald-500 animate-pulse"
                                      : "bg-amber-500"
                                      }`}
                                  />
                                  {automation.status === "ACTIVE"
                                    ? "Actif"
                                    : "Brouillon"}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="space-y-2 mb-4">
                                <h3 className="text-white font-black text-lg truncate group-hover:text-primary transition-colors italic tracking-tighter uppercase">
                                  {automation.name || "Sans titre"}
                                </h3>
                                <p className="text-muted-foreground/60 text-[11px] line-clamp-2 font-medium uppercase tracking-wider">
                                  {automation.description ||
                                    "Automatisation créée pour votre business"}
                                </p>
                              </div>

                              {/* Stats / Metadata */}
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1.5">
                                  <Activity className="h-3 w-3 text-muted-foreground/50" />
                                  <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-widest">
                                    {automation.triggerCount || 0} déclencheurs
                                  </span>
                                </div>
                                {automation.whatsappNumber && (
                                  <div className="flex items-center gap-1.5">
                                    <Smartphone className="h-3 w-3 text-emerald-500/50" />
                                    <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-widest">
                                      Connecté
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3 text-muted-foreground/40" />
                                  <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">
                                    {new Date(
                                      automation.updatedAt,
                                    ).toLocaleDateString("fr-FR", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                  <span className="text-[10px] font-black uppercase tracking-widest">
                                    Ouvrir
                                  </span>
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Templates Grid */}
                <div className="mb-6">
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Ou choisissez un template
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflowTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="border-white/10 bg-card hover:border-primary/30 cursor-pointer transition-all h-full relative overflow-hidden group"
                          onClick={() => handleSelectTemplate(template.id)}
                        >
                          {template.popular && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-orange-500/20 text-orange-400 text-[9px]">
                                <Star className="h-2.5 w-2.5 mr-1 fill-current" />{" "}
                                Populaire
                              </Badge>
                            </div>
                          )}
                          <CardContent className="p-5">
                            <div
                              className={`h-12 w-12 rounded-2xl ${template.bg} flex items-center justify-center mb-4`}
                            >
                              <template.icon
                                className={`h-6 w-6 ${template.color}`}
                              />
                            </div>
                            <h3 className="text-white font-bold mb-1">
                              {template.name}
                            </h3>
                            <p className="text-muted-foreground text-xs mb-4 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {template.features
                                .slice(0, 3)
                                .map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground"
                                  >
                                    {feature}
                                  </span>
                                ))}
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="h-5 w-5 text-primary" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mode: Workflow Builder */}
          {viewMode === "builder" && (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Editor Header */}
              <div className="h-14 border-b border-white/10 bg-card px-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-white/5"
                    onClick={() => setViewMode("templates")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="h-4 w-px bg-white/10" />
                  <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="bg-transparent border-none text-sm font-bold focus-visible:ring-0 w-64 p-0 h-auto"
                  />
                  {selectedTemplate && (
                    <Badge
                      variant="outline"
                      className="text-[8px] font-bold uppercase border-primary/20 text-primary"
                    >
                      {
                        workflowTemplates.find((t) => t.id === selectedTemplate)
                          ?.name
                      }
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-2 text-primary hover:bg-primary/10"
                    onClick={() => {
                      setRightPanelTab("simulate");
                      setIsRightPanelOpen(true);
                    }}
                  >
                    <Play className="h-3.5 w-3.5" /> Tester & Simuler
                  </Button>
                  <div className="h-4 w-px bg-white/10 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-2"
                    onClick={() => setViewMode("products")}
                  >
                    <Package className="h-3.5 w-3.5" /> Produits (
                    {products.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-2 border-white/10 hover:bg-white/5"
                    onClick={handleManualSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" /> Sauvegarder
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-black font-bold text-xs gap-2 px-4 shadow-[0_0_20px_rgba(135,169,255,0.3)]"
                    onClick={() => setShowPublishModal(true)}
                  >
                    Publier l'automatisation
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden relative">
                {/* Toggle Button for Left Sidebar */}
                {!isLeftSidebarOpen && (
                  <button
                    onClick={() => setIsLeftSidebarOpen(true)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-50 h-12 w-6 bg-card/80 border-r border-white/10 rounded-r-lg flex items-center justify-center hover:bg-card transition-colors group"
                    title="Afficher les blocs"
                  >
                    <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                )}

                {/* Nodes Palette - Left Panel */}
                <AnimatePresence>
                  {isLeftSidebarOpen && (
                    <motion.aside
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 288, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="border-r border-white/10 bg-card/60 flex flex-col overflow-hidden shrink-0"
                    >
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Blocs Disponibles
                          </h3>
                          <p className="text-[10px] text-muted-foreground/60">
                            Glissez les blocs sur le canvas pour construire votre
                            workflow
                          </p>
                        </div>
                        <button
                          onClick={() => setIsLeftSidebarOpen(false)}
                          className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
                          title="Masquer les blocs"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {nodeCategories.map((category) => {
                          const isExpanded = expandedCategory === category.id;

                          return (
                            <div
                              key={category.id}
                              className="rounded-xl overflow-hidden border border-white/5"
                            >
                              <button
                                onClick={() =>
                                  setExpandedCategory(
                                    isExpanded ? null : category.id,
                                  )
                                }
                                className="w-full p-3 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <category.icon className="h-4 w-4 text-primary" />
                                  <span className="text-xs font-bold text-white">
                                    {category.name}
                                  </span>
                                </div>
                                <ChevronDown
                                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
                                />
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-2 space-y-1 bg-black/20">
                                      {category.nodes.map((node) => {
                                        const isTriggerType =
                                          category.id === "triggers";
                                        const isDisabled =
                                          isTriggerType && hasTrigger;

                                        return (
                                          <motion.div
                                            key={node.id}
                                            whileHover={isDisabled ? {} : { x: 4 }}
                                            className={`p-2.5 rounded-lg transition-all border border-transparent
                                                                                ${isDisabled ? "opacity-40 cursor-not-allowed grayscale bg-white/[0.01]" : "bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer group hover:border-white/10"}
                                                                            `}
                                            onClick={() =>
                                              !isDisabled &&
                                              addNodeAtPosition(node.id, node.name)
                                            }
                                          >
                                            <div
                                              draggable={!isDisabled}
                                              onDragStart={(e) => {
                                                if (isDisabled) {
                                                  e.preventDefault();
                                                  return;
                                                }
                                                e.dataTransfer.setData(
                                                  "nodeType",
                                                  node.id,
                                                );
                                                e.dataTransfer.setData(
                                                  "nodeName",
                                                  node.name,
                                                );
                                              }}
                                              className="w-full h-full"
                                            >
                                              <div className="flex items-center gap-2">
                                                <node.icon
                                                  className={`h-3.5 w-3.5 transition-colors ${isDisabled ? "text-muted-foreground" : "text-muted-foreground group-hover:text-primary"}`}
                                                />
                                                <span
                                                  className={`text-[11px] font-medium transition-colors ${isDisabled ? "text-muted-foreground" : "text-white/80 group-hover:text-white"}`}
                                                >
                                                  {node.name}
                                                </span>
                                              </div>
                                              <p className="text-[9px] text-muted-foreground/60 mt-1 pl-5">
                                                {node.description}
                                              </p>
                                            </div>
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* Help Box */}
                      <div className="p-4 border-t border-white/10">
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase">
                              Besoin d'aide ?
                            </span>
                          </div>
                          <p className="text-[9px] text-muted-foreground leading-relaxed">
                            Glissez un bloc du panneau de gauche sur le canvas pour
                            construire votre workflow. Testez avec le simulateur à
                            droite.
                          </p>
                        </div>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>

                {/* Canvas Wrapper - for positioning zoom controls */}
                <div className="flex-1 relative">
                  {/* Scrollable Canvas Area - n8n inspired */}
                  <div
                    ref={canvasRef}
                    className="absolute inset-0 overflow-auto select-none"
                    style={{
                      backgroundColor: '#1a1a1a',
                    }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    onWheel={(e) => {
                      if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        const delta = e.deltaY > 0 ? -0.1 : 0.1;
                        setZoom((prev) => Math.max(0.25, Math.min(2, prev + delta)));
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const canvas = e.currentTarget as HTMLDivElement;
                      const rect = canvas.getBoundingClientRect();
                      const nodeType = e.dataTransfer.getData("nodeType");
                      const nodeName = e.dataTransfer.getData("nodeName");
                      if (!nodeType) return;

                      const x = (e.clientX - rect.left + canvas.scrollLeft) / zoom;
                      const y = (e.clientY - rect.top + canvas.scrollTop) / zoom;
                      addNodeAtPosition(nodeType, nodeName, x, y);
                    }}
                  >

                    {/* Canvas Content - with zoom transform */}
                    <div
                      className="relative origin-top-left transition-transform duration-200"
                      style={{
                        width: `${4000 * zoom}px`,
                        height: `${3000 * zoom}px`,
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <div className="relative w-[4000px] h-[3000px]">
                        {/* n8n-style Background - Simple dot pattern */}
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="absolute inset-0 w-full h-full">
                            <defs>
                              <pattern
                                id="n8n-dot-pattern"
                                x="0"
                                y="0"
                                width="16"
                                height="16"
                                patternUnits="userSpaceOnUse"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="0.75"
                                  fill="rgba(255, 255, 255, 0.08)"
                                />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#n8n-dot-pattern)" />
                          </svg>
                        </div>
                        {/* Selection Rectangle Overlay - Modern glassmorphism */}
                        {selectionRect && (
                          <div
                            className="absolute border border-indigo-400/50 bg-indigo-500/10 backdrop-blur-[1px] pointer-events-none z-[2000] rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.15),inset_0_0_20px_rgba(99,102,241,0.05)]"
                            style={{
                              left: Math.min(selectionRect.x1, selectionRect.x2),
                              top: Math.min(selectionRect.y1, selectionRect.y2),
                              width: Math.abs(
                                selectionRect.x1 - selectionRect.x2,
                              ),
                              height: Math.abs(
                                selectionRect.y1 - selectionRect.y2,
                              ),
                            }}
                          />
                        )}
                        {nodes.length === 0 ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                            <div className="relative mb-8">
                              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
                              <div className="relative h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                                <Plus className="h-10 w-10 text-primary animate-pulse" />
                              </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 italic uppercase tracking-tight">
                              Construisez votre Workflow
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                              Glissez un bloc du panneau de gauche ou choisissez
                              un template pour commencer l'automatisation.
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Connection lines between nodes (SVG) */}
                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              style={{ zIndex: 0 }}
                            >
                              {/* n8n style arrow head marker */}
                              <defs>
                                <marker
                                  id="n8n-arrow-head"
                                  viewBox="-10 -10 20 20"
                                  refX="0"
                                  refY="0"
                                  markerWidth="12.5"
                                  markerHeight="12.5"
                                  markerUnits="strokeWidth"
                                  orient="auto-start-reverse"
                                >
                                  <polyline
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points="-5,-4 0,0 -5,4 -5,-4"
                                    strokeWidth="2"
                                    stroke="#b1b1b7"
                                    fill="#b1b1b7"
                                  />
                                </marker>
                              </defs>
                              {nodes.flatMap((node, idx) => {
                                // For switch/router nodes, handle multiple output connections
                                if (node.type === "switch_router") {
                                  const parsedCfg = (() => {
                                    try {
                                      return typeof node.config === 'string' ? JSON.parse(node.config) : node.config;
                                    } catch { return {}; }
                                  })();

                                  const cases = parsedCfg?.cases || [];
                                  const hasDefault = parsedCfg?.hasDefault !== false;
                                  const outputCount = cases.length + (hasDefault ? 1 : 0);
                                  const nodeH = Math.max(120, 60 + outputCount * 40);
                                  const nodeW = 160;

                                  const connections: Array<{ target: WorkflowNode; color: string; startY: number; branch: string }> = [];

                                  // Map cases
                                  cases.forEach((c: any, cIdx: number) => {
                                    const branch = `case_${cIdx}`;
                                    const targetId = node.conditionalConnections?.[branch];
                                    if (targetId) {
                                      const target = nodes.find(n => n.id === targetId);
                                      if (target) {
                                        const caseColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444", "#06b6d4", "#84cc16"];
                                        const color = c.color || caseColors[cIdx % caseColors.length];
                                        const yPercent = ((cIdx + 1) / (outputCount + 1));
                                        connections.push({
                                          target,
                                          color,
                                          startY: nodeH * yPercent,
                                          branch
                                        });
                                      }
                                    }
                                  });

                                  // Map default
                                  if (hasDefault) {
                                    const targetId = node.conditionalConnections?.default;
                                    if (targetId) {
                                      const target = nodes.find(n => n.id === targetId);
                                      if (target) {
                                        const yPercent = ((cases.length + 1) / (outputCount + 1));
                                        connections.push({
                                          target,
                                          color: "#71717a",
                                          startY: nodeH * yPercent,
                                          branch: "default"
                                        });
                                      }
                                    }
                                  }

                                  return connections.map(({ target: targetNode, color, startY, branch }) => {
                                    const startX = node.x + nodeW + 40; // +40 for the n8n style offset
                                    const startYPos = node.y + startY;
                                    const targetW = targetNode.type === "ai_agent" ? 224 : 96;
                                    const endX = targetNode.x;
                                    const endY = targetNode.y + 48;

                                    const dist = Math.abs(endX - startX);
                                    const cpOffset = Math.min(dist * 0.4, 120);
                                    const pathD = `M ${startX} ${startYPos} C ${startX + cpOffset} ${startYPos}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;

                                    return (
                                      <g key={`line-switch-${node.id}-${targetNode.id}-${branch}`} className="group/line">
                                        <path d={pathD} fill="none" stroke="transparent" strokeWidth="20" className="cursor-pointer" />
                                        <path
                                          d={pathD}
                                          stroke={color}
                                          strokeWidth="2"
                                          fill="none"
                                          strokeLinecap="round"
                                          markerEnd="url(#n8n-arrow-head)"
                                        />
                                      </g>
                                    );
                                  });
                                }

                                // For condition nodes, handle conditional connections
                                if (node.type === "condition" && node.conditionalConnections) {
                                  const connections: Array<{ target: WorkflowNode; branch: "true" | "false"; color: string; startY: number }> = [];

                                  if (node.conditionalConnections.true) {
                                    const trueTarget = nodes.find(n => n.id === node.conditionalConnections!.true);
                                    if (trueTarget) {
                                      connections.push({
                                        target: trueTarget,
                                        branch: "true",
                                        color: "#10b981",
                                        startY: 24,
                                      });
                                    }
                                  }

                                  if (node.conditionalConnections.false) {
                                    const falseTarget = nodes.find(n => n.id === node.conditionalConnections!.false);
                                    if (falseTarget) {
                                      connections.push({
                                        target: falseTarget,
                                        branch: "false",
                                        color: "#ef4444",
                                        startY: 72,
                                      });
                                    }
                                  }

                                  return connections.map(({ target: targetNode, color, startY, branch }) => {
                                    const sourceNodeWidth = 96;
                                    const targetNodeWidth = targetNode.type === "ai_agent" ? 224 : 96;

                                    const startX = node.x + sourceNodeWidth;
                                    const startYPos = node.y + startY;
                                    const endX = targetNode.x;
                                    const endY = targetNode.y + 48;

                                    const dist = Math.abs(endX - startX);
                                    const cpOffset = Math.min(dist * 0.4, 120);

                                    const midX = (startX + endX) / 2;
                                    const midY = (startYPos + endY) / 2;

                                    const pathD = `M ${startX} ${startYPos} C ${startX + cpOffset} ${startYPos}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;
                                    const connectionId = `conn-${node.id}-${targetNode.id}-${branch}`;

                                    return (
                                      <g
                                        key={`line-${node.id}-${targetNode.id}-${branch}`}
                                        className="group/line"
                                      >
                                        <path
                                          d={pathD}
                                          fill="none"
                                          stroke="transparent"
                                          strokeWidth="20"
                                          className="cursor-pointer"
                                        />
                                        <path
                                          d={pathD}
                                          stroke={color}
                                          strokeWidth="2"
                                          fill="none"
                                          strokeLinecap="round"
                                          markerEnd="url(#n8n-arrow-head)"
                                          className="group-hover/line:opacity-80 transition-opacity duration-200"
                                        />
                                        <AnimatePresence>
                                          {activeStep === idx + 0.5 && (
                                            <motion.circle
                                              r="4"
                                              fill={color}
                                              initial={{
                                                opacity: 0,
                                                offsetDistance: "0%",
                                              }}
                                              animate={{
                                                opacity: 1,
                                                offsetDistance: "100%",
                                              }}
                                              exit={{ opacity: 0 }}
                                              transition={{
                                                offsetDistance: {
                                                  duration: 0.6,
                                                  ease: [0.4, 0, 0.2, 1],
                                                },
                                                opacity: { duration: 0.15 },
                                              }}
                                              style={{
                                                offsetPath: `path('${pathD}')`,
                                                filter: `drop-shadow(0 0 6px ${color})`,
                                              }}
                                            />
                                          )}
                                        </AnimatePresence>
                                      </g>
                                    );
                                  });
                                }

                                // Skip if this node is explicitly disconnected (connectedTo = -1)
                                if (node.connectedTo === -1) {
                                  return [];
                                }

                                // Determine target node: explicit connectedTo or next sequential
                                let targetNode: WorkflowNode | undefined;
                                if (
                                  node.connectedTo !== undefined &&
                                  node.connectedTo !== -1
                                ) {
                                  // Explicit connection
                                  targetNode = nodes.find(
                                    (n) => n.id === node.connectedTo,
                                  );
                                } else if (idx < nodes.length - 1) {
                                  // Default sequential connection
                                  targetNode = nodes[idx + 1];
                                }

                                if (targetNode) {
                                  // Port offsets: AI Agent nodes are 224px wide, others are 96px
                                  const sourceNodeWidth = node.type === "ai_agent" ? 224 : 96;
                                  const targetNodeWidth = targetNode.type === "ai_agent" ? 224 : 96;

                                  const startX = node.x + sourceNodeWidth;
                                  const startY = node.y + 48; // Center of 96px height
                                  const endX = targetNode.x;
                                  const endY = targetNode.y + 48;

                                  // Dynamic curve offset based on distance
                                  const dist = Math.abs(endX - startX);
                                  const cpOffset = Math.min(dist * 0.4, 120);

                                  const midX = (startX + endX) / 2;
                                  const midY = (startY + endY) / 2;

                                  const pathD = `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;
                                  const connectionId = `conn-${node.id}-${targetNode.id}`;

                                  return (
                                    <g
                                      key={`line-${node.id}-${targetNode.id}`}
                                      className="group/line"
                                      style={{
                                        // @ts-ignore - CSS custom properties
                                        '--canvas-edge--color': '#b1b1b7',
                                      } as React.CSSProperties}
                                    >
                                      {/* Invisible interaction path for easier hover/click */}
                                      <path
                                        d={pathD}
                                        fill="none"
                                        stroke="transparent"
                                        strokeWidth="20"
                                        className="cursor-pointer"
                                      />

                                      {/* Main connection path - n8n style */}
                                      <path
                                        d={pathD}
                                        stroke="#b1b1b7"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        markerEnd="url(#n8n-arrow-head)"
                                        className="group-hover/line:stroke-[#a78bfa] transition-colors duration-200"
                                      />

                                      {/* Flow Animation Particle - n8n style */}
                                      <AnimatePresence>
                                        {activeStep === idx + 0.5 && (
                                          <motion.circle
                                            r="4"
                                            fill="#10b981"
                                            initial={{
                                              opacity: 0,
                                              offsetDistance: "0%",
                                            }}
                                            animate={{
                                              opacity: 1,
                                              offsetDistance: "100%",
                                            }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                              offsetDistance: {
                                                duration: 0.6,
                                                ease: [0.4, 0, 0.2, 1],
                                              },
                                              opacity: { duration: 0.15 },
                                            }}
                                            style={{
                                              offsetPath: `path('${pathD}')`,
                                              filter: "drop-shadow(0 0 6px #10b981)",
                                            }}
                                          />
                                        )}
                                      </AnimatePresence>
                                      <g
                                        className="cursor-pointer pointer-events-auto group/btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setNodePickerPos({
                                            x: midX,
                                            y: midY,
                                            index: idx + 1,
                                          });
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      >
                                        {/* Transparent HIT AREA larger than the visual button */}
                                        <circle
                                          cx={midX}
                                          cy={midY}
                                          r="20"
                                          fill="transparent"
                                        />

                                        <circle
                                          cx={midX}
                                          cy={midY}
                                          r="12"
                                          fill="#171717"
                                          stroke="#3f3f46"
                                          className="group-hover/btn:stroke-primary group-hover/line:stroke-primary group-hover/btn:scale-110 transition-all origin-center"
                                          style={{ transformBox: "fill-box" }}
                                        />
                                        <path
                                          d={`M ${midX - 3} ${midY} L ${midX + 3} ${midY} M ${midX} ${midY - 3} L ${midX} ${midY + 3}`}
                                          stroke="white"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          className="pointer-events-none group-hover/btn:scale-110 transition-all origin-center"
                                          style={{ transformBox: "fill-box" }}
                                        />
                                      </g>

                                      {/* Disconnect Button - appears on hover */}
                                      <g
                                        className="cursor-pointer pointer-events-auto group/disconnect opacity-0 group-hover/line:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Mark the current node as disconnected from the next
                                          setNodes((prevNodes) =>
                                            prevNodes.map((n) =>
                                              n.id === node.id
                                                ? { ...n, connectedTo: -1 }
                                                : n,
                                            ),
                                          );
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      >
                                        <circle
                                          cx={midX + 30}
                                          cy={midY}
                                          r="14"
                                          fill="transparent"
                                        />
                                        <circle
                                          cx={midX + 30}
                                          cy={midY}
                                          r="10"
                                          fill="#171717"
                                          stroke="#ef4444"
                                          strokeOpacity="0.6"
                                          className="group-hover/disconnect:stroke-opacity-100 group-hover/disconnect:fill-red-500/10 transition-all"
                                        />
                                        <path
                                          d={`M ${midX + 30 - 3} ${midY - 3} L ${midX + 30 + 3} ${midY + 3} M ${midX + 30 + 3} ${midY - 3} L ${midX + 30 - 3} ${midY + 3}`}
                                          stroke="#ef4444"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          className="pointer-events-none"
                                        />
                                      </g>
                                    </g>
                                  );
                                }
                                return [];
                              })}

                              {/* Temporary connection line when dragging */}
                              {connectingFrom !== null &&
                                (() => {
                                  const sourceNode = nodes.find(
                                    (n) => n.id === connectingFrom,
                                  );
                                  if (!sourceNode) return null;

                                  // Determine start Y position based on branch
                                  let startYOffset = 48; // Default center
                                  let strokeColor = '#87a9ff'; // Default color

                                  if (connectingBranch === 'true') {
                                    startYOffset = 24; // Top quarter
                                    strokeColor = '#10b981'; // Green
                                  } else if (connectingBranch === 'false') {
                                    startYOffset = 72; // Bottom quarter
                                    strokeColor = '#ef4444'; // Red
                                  }

                                  const startX = sourceNode.x + 96;
                                  const startY = sourceNode.y + startYOffset;
                                  const endX = mousePos.x;
                                  const endY = mousePos.y;

                                  const dist = Math.abs(endX - startX);
                                  const cpOffset = Math.min(dist * 0.4, 120);

                                  const pathD = `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;

                                  return (
                                    <path
                                      d={pathD}
                                      stroke={strokeColor}
                                      strokeWidth="3"
                                      fill="none"
                                      strokeOpacity="0.8"
                                      strokeLinecap="round"
                                      strokeDasharray="8 4"
                                      className="animate-pulse"
                                    />
                                  );
                                })()}
                            </svg>

                            {/* Draggable Nodes */}
                            {nodes.map((node, idx) => {
                              const nodeInfo = getNodeInfo(node.type);
                              return (
                                <DraggableNode
                                  key={node.id}
                                  node={node}
                                  nodeInfo={nodeInfo}
                                  isSelected={selectedNodeIds.has(node.id)}
                                  isActiveStep={activeStep === idx}
                                  executionStatus={nodeStatuses[node.id]}
                                  onPositionChange={handlePositionChange}
                                  onSelect={() => {
                                    setRightPanelTab("inspect");
                                    setIsRightPanelOpen(true);
                                  }}
                                  onDelete={() =>
                                    setNodes(
                                      nodes.filter((n) => n.id !== node.id),
                                    )
                                  }
                                  zoom={zoom}
                                  onNodeSelectOnly={(e) =>
                                    handleNodeSelect(node.id, e)
                                  }
                                  onOpenSettings={() => {
                                    setSelectedNodeIds(new Set([node.id]));
                                    setRightPanelTab("inspect");
                                    setIsRightPanelOpen(true);
                                  }}
                                  onStartConnect={(branch) => {
                                    setConnectingFrom(node.id);
                                    setConnectingBranch(branch || null);
                                    setMousePos({
                                      x: node.x + 96,
                                      y: node.y + 48,
                                    });
                                  }}
                                  onCompleteConnect={() =>
                                    handleNodeConnect(node.id)
                                  }
                                  onAddNext={() =>
                                    setNodePickerPos({
                                      x: node.x + 140,
                                      y: node.y,
                                      index: idx + 1,
                                    })
                                  }
                                  isConnecting={connectingFrom !== null}
                                  isDisconnected={node.connectedTo === -1}
                                  isWhatsAppConnected={isWhatsAppConnected}
                                />
                              );
                            })}

                            {/* Floating Node Picker for Insertion */}
                            <AnimatePresence>
                              {nodePickerPos && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                  className="absolute z-[3000] bg-[#171717] border border-white/10 rounded-2xl shadow-2xl p-4 w-[280px] backdrop-blur-xl"
                                  style={{
                                    left: nodePickerPos.x - 140,
                                    top: nodePickerPos.y + 20,
                                  }}
                                >
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">
                                    Insérer un bloc
                                  </h4>
                                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                    {nodeCategories.map((category) => (
                                      <div
                                        key={category.id}
                                        className="space-y-1"
                                      >
                                        <p className="text-[8px] font-black uppercase text-white/30 px-2">
                                          {category.name}
                                        </p>
                                        <div className="grid grid-cols-1 gap-1">
                                          {category.nodes.map((node) => {
                                            const isTriggerType =
                                              category.id === "triggers";
                                            const isDisabled =
                                              isTriggerType && hasTrigger;

                                            return (
                                              <button
                                                key={node.id}
                                                disabled={isDisabled}
                                                onClick={() =>
                                                  insertNode(
                                                    nodePickerPos.index,
                                                    node.id,
                                                    node.name,
                                                    nodePickerPos.x - 48,
                                                    nodePickerPos.y - 24,
                                                  )
                                                }
                                                className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors
                                                                                                ${isDisabled ? "opacity-40 cursor-not-allowed grayscale" : "hover:bg-white/5 group"}
                                                                                            `}
                                              >
                                                <div
                                                  className={`h-7 w-7 rounded-md bg-white/5 flex items-center justify-center ${isDisabled ? "" : "group-hover:bg-primary/20"} transition-colors`}
                                                >
                                                  <node.icon
                                                    className={`h-3.5 w-3.5 ${isDisabled ? "text-muted-foreground" : "text-muted-foreground group-hover:text-primary"}`}
                                                  />
                                                </div>
                                                <span
                                                  className={`text-xs font-medium ${isDisabled ? "text-muted-foreground" : "text-white/80 group-hover:text-white"}`}
                                                >
                                                  {node.name}
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Zoom Controls - Premium glassmorphism style */}
                  <div className="absolute bottom-6 left-6 z-[100] flex items-center gap-3 pointer-events-auto">
                    {/* Zoom Panel - Glassmorphism */}
                    <div className="flex items-center gap-0.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-1.5 shadow-2xl shadow-black/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomOut();
                        }}
                        className="h-9 w-9 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                        title="Dézoomer"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomReset();
                        }}
                        className="h-9 px-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center justify-center text-[11px] font-semibold text-white/70 hover:text-white transition-all duration-200 min-w-[52px] tabular-nums"
                        title="Réinitialiser le zoom"
                      >
                        {Math.round(zoom * 100)}%
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomIn();
                        }}
                        className="h-9 w-9 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                        title="Zoomer"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <div className="w-px h-5 bg-white/[0.08] mx-1" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomFit();
                        }}
                        className="h-9 w-9 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                        title="Vue d'ensemble"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Selection Indicator - Modern pill */}
                    {selectedNodeIds.size > 0 && (
                      <div className="flex items-center gap-2 bg-indigo-500/15 backdrop-blur-xl rounded-2xl border border-indigo-400/20 px-4 py-2 shadow-2xl shadow-indigo-500/10">
                        <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-xs font-semibold text-indigo-300">
                          {selectedNodeIds.size} sélectionné{selectedNodeIds.size > 1 ? "s" : ""}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeIds(new Set());
                          }}
                          className="h-6 w-6 rounded-lg hover:bg-indigo-400/20 flex items-center justify-center text-indigo-300 hover:text-indigo-200 transition-all duration-200"
                          title="Désélectionner"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Connection Mode Indicator - Animated */}
                    {connectingFrom !== null && (
                      <div className="flex items-center gap-2.5 bg-emerald-500/15 backdrop-blur-xl rounded-2xl border border-emerald-400/20 px-4 py-2 shadow-2xl shadow-emerald-500/10">
                        <div className="relative h-2.5 w-2.5">
                          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                          <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-emerald-400">
                          Connexion en cours...
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConnectingFrom(null);
                          }}
                          className="h-6 w-6 rounded-md hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition-colors"
                          title="Annuler"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Right Panel - n8n Style with 3 Columns */}
                <AnimatePresence>
                  {isRightPanelOpen && selectedNodeIds.size === 1 && rightPanelTab === "inspect" && (() => {
                    const selectedId = Array.from(selectedNodeIds)[0];
                    const node = nodes.find((n) => n.id === selectedId);
                    const nodeInfo = node ? getNodeInfo(node.type) : null;

                    if (!node) return <></>;

                    // Get available inputs from previous nodes
                    const availableInputs = getAvailableOutputs(node.id);
                    const availableOutputs = getNodeOutputs(node.type, node.config);

                    return (
                      <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 200,
                        }}
                        className="absolute top-0 right-0 bottom-0 w-[90vw] max-w-[1400px] z-[100] bg-[#171717] border-l border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                      >
                        {/* Header */}
                        <header className="flex items-center justify-between px-4 h-12 border-b border-white/10 bg-black/40 shrink-0">
                          <div className="flex items-center gap-3">
                            {nodeInfo && (
                              <div className={`h-6 w-6 rounded flex items-center justify-center ${nodeInfo.category?.id === "triggers" ? "bg-emerald-500/20 text-emerald-400" :
                                nodeInfo.category?.id === "ai" ? "bg-purple-500/20 text-purple-400" :
                                  "bg-primary/20 text-primary"
                                }`}>
                                <nodeInfo.icon className="h-4 w-4" />
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <input
                                value={node.name}
                                onChange={(e) => {
                                  setNodes(nodes.map((n) => n.id === node.id ? { ...n, name: e.target.value } : n));
                                }}
                                className="bg-transparent border-none text-sm font-semibold text-white focus:outline-none focus:ring-0 px-0"
                                style={{ width: `${Math.max(100, node.name.length * 8)}px` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setRightPanelTab("simulate")}
                              className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-white/60 hover:text-white transition-colors"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setIsRightPanelOpen(false)}
                              className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </header>

                        {/* Three Column Layout */}
                        <div className="flex-1 flex overflow-hidden">
                          {/* Left Column - Input (n8n style) */}
                          <div className="w-[30%] border-r border-white/10 bg-black/20 flex flex-col">
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
                              <h3 className="text-xs font-semibold text-white/80">Input</h3>
                              <div className="flex items-center gap-1">
                                <button className="px-2 py-1 text-[10px] rounded bg-white/5 text-white/60 hover:text-white">Schema</button>
                                <button className="px-2 py-1 text-[10px] rounded text-white/40 hover:text-white/60">Table</button>
                                <button className="px-2 py-1 text-[10px] rounded text-white/40 hover:text-white/60">JSON</button>
                              </div>
                            </div>

                            {/* Search bar */}
                            <div className="px-4 py-2 border-b border-white/10 shrink-0">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                                <input
                                  type="text"
                                  placeholder="Search previous nodes' fields"
                                  className="w-full h-8 pl-8 pr-2 bg-white/5 border border-white/10 rounded text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
                                />
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                              {(() => {
                                // Si on a des données d'exécution, les afficher
                                const executionInput = nodeExecutionData[node.id]?.input;

                                if (executionInput) {
                                  return (
                                    <div className="p-2 space-y-1">
                                      <SchemaHeader
                                        title="Input (exécution)"
                                        icon={Zap}
                                        isExpanded={true}
                                        isTrigger={false}
                                      >
                                        <RecursiveObjectItem obj={executionInput} basePath="" depth={1} />
                                      </SchemaHeader>
                                    </div>
                                  );
                                }

                                // Sinon, afficher les outputs disponibles des nœuds précédents
                                if (availableInputs.length === 0) {
                                  return (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                      <div className="mb-4 opacity-20">
                                        <svg width="112" height="80" viewBox="0 0 112 80" fill="none">
                                          <rect width="112" height="80" fill="url(#pattern)" fillOpacity="0.6" />
                                        </svg>
                                      </div>
                                      <h4 className="text-sm font-medium text-white/40 mb-2">No input connected</h4>
                                      <p className="text-xs text-white/20">Connect a node to see input data</p>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="p-2 space-y-1">
                                    {/* Variables globales */}
                                    <SchemaHeader
                                      title="Variables and context"
                                      icon={Box}
                                      isExpanded={true}
                                    >
                                      <SchemaItem
                                        name="$now"
                                        path=".$now"
                                        value={new Date().toISOString()}
                                        type="string"
                                        depth={1}
                                      />
                                      <SchemaItem
                                        name="$today"
                                        path=".$today"
                                        value={new Date().toISOString().split('T')[0] + 'T00:00:00.000+00:00'}
                                        type="string"
                                        depth={1}
                                      />
                                      <SchemaItem
                                        name="$vars"
                                        path=".$vars"
                                        value={{}}
                                        type="object"
                                        depth={1}
                                        isCollapsible={true}
                                      />
                                      <SchemaItem
                                        name="$execution"
                                        path=".$execution"
                                        value={{
                                          id: '[filled at execution time]',
                                          mode: 'test',
                                          resumeUrl: 'The URL for resuming a \'Wait\' node'
                                        }}
                                        type="object"
                                        depth={1}
                                        isCollapsible={true}
                                      />
                                      <SchemaItem
                                        name="$workflow"
                                        path=".$workflow"
                                        value={{
                                          id: automationId || 'workflow-id',
                                          name: workflowName || 'My workflow',
                                          active: false
                                        }}
                                        type="object"
                                        depth={1}
                                        isCollapsible={true}
                                      />
                                    </SchemaHeader>

                                    {/* Outputs des nœuds précédents */}
                                    {availableInputs.map((outputGroup, idx) => {
                                      const prevNode = nodes.find(n => n.id === outputGroup.nodeId);
                                      const prevNodeInfo = prevNode ? getNodeInfo(prevNode.type) : null;

                                      return (
                                        <SchemaHeader
                                          key={idx}
                                          title={outputGroup.nodeName}
                                          icon={prevNodeInfo?.icon || Zap}
                                          isExpanded={true}
                                          isTrigger={prevNode?.type === 'whatsapp_message' || prevNode?.type === 'telegram_message'}
                                        >
                                          {outputGroup.outputs.map((output, oIdx) => {
                                            // Convertir la clé en format utilisable
                                            const cleanKey = output.key.replace(/[{}]/g, '');
                                            const path = `.${cleanKey}`;

                                            return (
                                              <SchemaItem
                                                key={oIdx}
                                                name={cleanKey}
                                                path={path}
                                                value={output.description || '[value]'}
                                                type="string"
                                                depth={1}
                                              />
                                            );
                                          })}
                                        </SchemaHeader>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Middle Column - Configuration */}
                          <div className="w-[40%] border-r border-white/10 flex flex-col">
                            {/* Header with Tabs and Execute Button */}
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                                  <button
                                    onClick={() => setParameterTab("parameters")}
                                    className={`px-3 py-1.5 text-[10px] font-medium rounded transition-colors ${parameterTab === "parameters"
                                      ? "bg-white/10 text-white"
                                      : "text-white/50 hover:text-white/70"
                                      }`}
                                  >
                                    Parameters
                                  </button>
                                  <button
                                    onClick={() => setParameterTab("settings")}
                                    className={`px-3 py-1.5 text-[10px] font-medium rounded transition-colors ${parameterTab === "settings"
                                      ? "bg-white/10 text-white"
                                      : "text-white/50 hover:text-white/70"
                                      }`}
                                  >
                                    Settings
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={async () => {
                                  if (!node || executingNodeId === node.id) return;

                                  setExecutingNodeId(node.id);

                                  try {
                                    // 1. Build initial context with global settings
                                    const context: ExecutionContext = {
                                      lastUserMessage: "Bonjour",
                                      products: products,
                                      currency: "FCFA",
                                      variables: {},
                                      previous: {},
                                      messages: [],
                                      cart: [],
                                      userId: clientUserId || undefined,
                                      isManualExecution: true,
                                      userPhone: clientWhatsAppNumber,
                                      addMessage: () => { },
                                    };

                                    // 2. Find ALL incoming nodes (predecessors)
                                    const incomingNodes = nodes.filter(n =>
                                      n.connectedTo === node.id ||
                                      n.connectedToTrue === node.id ||
                                      n.connectedToFalse === node.id
                                    );

                                    // Use the first predecessor that has execution data (the most recent/valid one)
                                    const activePrevNode = incomingNodes.find(n => nodeExecutionData[n.id]?.output);

                                    if (activePrevNode) {
                                      const pData = nodeExecutionData[activePrevNode.id];
                                      if (pData.context) Object.assign(context, pData.context);
                                      // IMPORTANT: Map the output of the predecessor to context.previous.output
                                      context.previous = { output: pData.output };
                                    }

                                    // 3. Find global trigger data (very important for contact info and original message)
                                    const triggerNode = nodes.find(n =>
                                      ["whatsapp_message", "telegram_message", "keyword", "new_contact", "webhook_trigger"].includes(n.type)
                                    );

                                    if (triggerNode && nodeExecutionData[triggerNode.id]) {
                                      const tData = nodeExecutionData[triggerNode.id];
                                      if (tData.output) {
                                        // Merge contact and message info from trigger if not already provided by predecessor
                                        context.contact = context.contact || tData.output.contact;
                                        context.message = context.message || tData.output.message;
                                        context.from = context.from || tData.output.from;
                                        if (tData.output.message) {
                                          context.lastUserMessage = typeof tData.output.message === 'string'
                                            ? tData.output.message
                                            : (tData.output.message.text || "Bonjour");
                                        }
                                      }
                                    }

                                    // 4. Run the node
                                    const result = await executeNode(node, context);
                                    console.log("Manual execution result:", result);

                                    // 5. Update execution data with BOTH input and output
                                    setNodeExecutionData((prev) => ({
                                      ...prev,
                                      [node.id]: {
                                        input: context,
                                        output: result.data || result,
                                        context: context,
                                      },
                                    }));
                                  } catch (error) {
                                    console.error("Manual execution error:", error);
                                  } finally {
                                    setExecutingNodeId(null);
                                  }
                                }}
                                className={`ml-2 px-3 py-1.5 border rounded-lg flex items-center gap-1.5 text-[10px] font-medium transition-all ${executingNodeId === node.id
                                  ? "bg-primary/10 border-primary/20 text-primary/50 cursor-wait"
                                  : "bg-primary/20 hover:bg-primary/30 border-primary/30 text-primary"
                                  }`}
                                title="Exécuter ce nœud"
                                disabled={executingNodeId === node.id}
                              >
                                {executingNodeId === node.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <FlaskConical className="h-3 w-3" />
                                )}
                                <span>{executingNodeId === node.id ? "Executing..." : "Execute step"}</span>
                              </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                              {parameterTab === "parameters" ? (
                                <div className="p-4">
                                  {/* Configuration content - moved from old panel */}
                                  {(() => {
                                    if (!node) return null;

                                    return (
                                      <div className="space-y-4">
                                        <div>
                                          <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                              Configuration
                                            </h3>
                                            <Badge
                                              variant="outline"
                                              className="text-[8px] opacity-50 uppercase tracking-tighter"
                                            >
                                              ID: {node.id}
                                            </Badge>
                                          </div>
                                          <div className="space-y-4">
                                            <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                                Nom de cette étape
                                              </label>
                                              <Input
                                                value={node.name}
                                                onChange={(e) => {
                                                  setNodes(
                                                    nodes.map((n) =>
                                                      n.id === node.id
                                                        ? {
                                                          ...n,
                                                          name: e.target.value,
                                                        }
                                                        : n,
                                                    ),
                                                  );
                                                }}
                                                className="bg-white/5 border-white/10 h-10 focus:border-primary/50 transition-colors text-xs"
                                              />
                                            </div>

                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-inner">
                                              <div className="flex items-center gap-4 mb-4">
                                                <div
                                                  className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${nodeInfo?.category?.id ===
                                                    "triggers"
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : nodeInfo?.category?.id ===
                                                      "ai"
                                                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                      : "bg-primary/20 text-primary border border-primary/30"
                                                    }`}
                                                >
                                                  {nodeInfo ? (
                                                    <nodeInfo.icon className="h-6 w-6" />
                                                  ) : (
                                                    <Zap className="h-6 w-6" />
                                                  )}
                                                </div>
                                                <div>
                                                  <p className="text-sm font-black text-white uppercase tracking-tight">
                                                    {nodeInfo?.name || node.type}
                                                  </p>
                                                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                                                    {nodeInfo?.category?.name ||
                                                      "Étape"}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="h-px bg-white/5 w-full mb-3" />
                                              <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic">
                                                {nodeInfo?.description ||
                                                  "Configurez cette action pour définir ce qu'elle doit faire."}
                                              </p>
                                            </div>

                                            {/* Outputs disponibles et Output (exécution) sont maintenant affichés dans la colonne Output à droite */}

                                            <div className="space-y-3 pt-2">
                                              <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                                Autres options de l'étape
                                              </label>

                                              {(() => {
                                                // Helper to get/set JSON config
                                                const cfg = (defaultValue = {}) => {
                                                  try {
                                                    return {
                                                      ...defaultValue,
                                                      ...JSON.parse(node.config),
                                                    };
                                                  } catch (e) {
                                                    return defaultValue;
                                                  }
                                                };
                                                const updateCfg = (newCfg: any) => {
                                                  setNodes(
                                                    nodes.map((n) =>
                                                      n.id === node.id
                                                        ? {
                                                          ...n,
                                                          config:
                                                            JSON.stringify(
                                                              newCfg,
                                                            ),
                                                        }
                                                        : n,
                                                    ),
                                                  );
                                                };

                                                const currentCfg = cfg();

                                                const instructionsUI = (
                                                  <div className="mt-6 pt-2 border-t border-white/5">
                                                    <button
                                                      onClick={() =>
                                                        setIsAiInstructionsOpen(
                                                          !isAiInstructionsOpen,
                                                        )
                                                      }
                                                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                                    >
                                                      <div className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                          <Bot className="h-3 w-3 text-primary" />
                                                        </div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/90 cursor-pointer">
                                                          Consignes de l'IA
                                                        </label>
                                                      </div>
                                                      <ChevronRight
                                                        className={`h-3 w-3 text-white/40 transition-transform duration-200 ${isAiInstructionsOpen ? "rotate-90" : ""}`}
                                                      />
                                                    </button>

                                                    <AnimatePresence>
                                                      {isAiInstructionsOpen && (
                                                        <motion.div
                                                          initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                          }}
                                                          animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                          }}
                                                          exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                          }}
                                                          className="overflow-hidden"
                                                        >
                                                          <div className="pt-2 pb-1 space-y-3 px-1">
                                                            <textarea
                                                              value={
                                                                currentCfg.aiInstructions ||
                                                                ""
                                                              }
                                                              onChange={(e) =>
                                                                updateCfg({
                                                                  ...currentCfg,
                                                                  aiInstructions:
                                                                    e.target.value,
                                                                })
                                                              }
                                                              className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] text-white/80 focus:border-primary/50 transition-all font-medium leading-relaxed resize-none"
                                                              placeholder="Ex: Réponds avec enthousiasme et aide le client à choisir..."
                                                            />
                                                            <div className="flex items-center gap-2">
                                                              <Sparkles className="h-2.5 w-2.5 text-primary opacity-50" />
                                                              <p className="text-[8px] text-muted-foreground italic font-medium">
                                                                Définissez ici comment l'IA doit agir pour cette étape précise.
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </motion.div>
                                                      )}
                                                    </AnimatePresence>
                                                  </div>
                                                );
                                                return (
                                                  <>
                                                    {(() => {
                                                      switch (node.type) {
                                                        case "whatsapp_message":
                                                        case "telegram_message":
                                                          return (
                                                            <div className="space-y-4">
                                                              {/* Statut de connexion client */}
                                                              <div
                                                                className={`p-8 rounded-3xl bg-gradient-to-br ${isClientWhatsAppConnected ? "from-emerald-500/10" : "from-amber-500/10"} to-transparent border ${isClientWhatsAppConnected ? "border-emerald-500/20 hover:border-emerald-500/30" : "border-amber-500/20 hover:border-amber-500/30"} flex flex-col items-center justify-center text-center space-y-4 shadow-inner relative overflow-hidden transition-all group`}
                                                              >
                                                                <div
                                                                  className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_${isClientWhatsAppConnected ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)"}_0%,_transparent_70%)] pointer-events-none`}
                                                                />
                                                                <div
                                                                  className={`h-20 w-20 rounded-[2.5rem] ${isClientWhatsAppConnected ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"} flex items-center justify-center border-2 shadow-[0_20px_40px_-10px_${isClientWhatsAppConnected ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}] group-hover:scale-105 transition-transform duration-500`}
                                                                >
                                                                  {node.type ===
                                                                    "whatsapp_message" ? (
                                                                    <WhatsAppIcon className="h-10 w-10" />
                                                                  ) : (
                                                                    <TelegramIcon className="h-10 w-10" />
                                                                  )}
                                                                </div>
                                                                <div className="space-y-1 relative">
                                                                  <h4 className="text-[13px] font-black uppercase text-white tracking-[0.3em] italic">
                                                                    {isClientWhatsAppConnected
                                                                      ? "Écoute Active"
                                                                      : "Configuration Requise"}
                                                                  </h4>
                                                                  <p
                                                                    className={`text-[9px] ${isClientWhatsAppConnected ? "text-emerald-400/60" : "text-amber-400/60"} font-black uppercase tracking-widest`}
                                                                  >
                                                                    {isClientWhatsAppConnected
                                                                      ? "Votre WhatsApp Business"
                                                                      : "Connectez votre WhatsApp"}
                                                                  </p>
                                                                </div>

                                                                {isClientWhatsAppConnected ? (
                                                                  <>
                                                                    <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 relative">
                                                                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[ping_1.5s_infinite]" />
                                                                      <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-400">
                                                                        Connecté{" "}
                                                                        {clientWhatsAppNumber &&
                                                                          `• ${clientWhatsAppNumber}`}
                                                                      </span>
                                                                    </div>
                                                                  </>
                                                                ) : (
                                                                  <>
                                                                    <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 relative">
                                                                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                                      <span className="text-[9px] font-black uppercase tracking-tighter text-amber-400">
                                                                        WhatsApp Non
                                                                        Connecté
                                                                      </span>
                                                                    </div>
                                                                    <Button
                                                                      onClick={() =>
                                                                        setShowConnectionModal(
                                                                          true,
                                                                        )
                                                                      }
                                                                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 rounded-xl gap-2 mt-2"
                                                                    >
                                                                      <Smartphone className="h-4 w-4" />{" "}
                                                                      Connecter mon
                                                                      WhatsApp
                                                                    </Button>
                                                                  </>
                                                                )}
                                                              </div>

                                                              {/* Info box */}
                                                              <div
                                                                className={`p-4 rounded-2xl ${isClientWhatsAppConnected ? "bg-white/5 border-white/5" : "bg-amber-500/5 border-amber-500/10"} border`}
                                                              >
                                                                <p className="text-[10px] text-muted-foreground text-center leading-relaxed font-medium italic">
                                                                  {isClientWhatsAppConnected
                                                                    ? `Dès qu'un client envoie un message sur votre ${node.type === "whatsapp_message" ? "WhatsApp" : "Telegram"}, ce bloc lancera instantanément la suite du workflow.`
                                                                    : `⚠️ Chaque automatisation nécessite son propre numéro WhatsApp. Connectez un numéro dédié à ce workflow pour recevoir les messages de vos clients. Une fois publié, ce workflow sera actif 24/7.`}
                                                                </p>
                                                              </div>

                                                              {/* ID de l'automatisation pour référence */}
                                                              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                                                <p className="text-[8px] text-muted-foreground/60 text-center font-mono">
                                                                  ID: {automationId}
                                                                </p>
                                                              </div>

                                                              {/* Indicateur Simulateur (séparé) */}
                                                              {isWhatsAppConnected && (
                                                                <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center gap-3">
                                                                  <div className="h-8 w-8 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                                                                    <Zap className="h-4 w-4 text-zinc-400" />
                                                                  </div>
                                                                  <div className="flex-1">
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                                                      Simulateur
                                                                    </p>
                                                                    <p className="text-[8px] text-zinc-500">
                                                                      Instance de
                                                                      test
                                                                      disponible
                                                                    </p>
                                                                  </div>
                                                                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                </div>
                                                              )}
                                                            </div>
                                                          );

                                                        case "new_contact":
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex flex-col items-center justify-center text-center space-y-4 shadow-inner group transition-all hover:border-blue-500/30">
                                                                <div className="h-20 w-20 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/30 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-500">
                                                                  <Users className="h-10 w-10 text-blue-400" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                  <h4 className="text-[13px] font-black uppercase text-white tracking-[0.3em] italic">
                                                                    Nouveau Contact
                                                                  </h4>
                                                                  <p className="text-[9px] text-blue-400/60 font-black uppercase tracking-widest">
                                                                    Acquisition
                                                                    client
                                                                  </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                                                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
                                                                    Premier Message
                                                                  </span>
                                                                </div>
                                                              </div>
                                                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                                <p className="text-[10px] text-muted-foreground text-center leading-relaxed font-medium italic">
                                                                  Ce bloc est idéal
                                                                  pour envoyer un
                                                                  message de
                                                                  bienvenue
                                                                  personnalisé ou un
                                                                  cadeau aux
                                                                  nouveaux
                                                                  prospects.
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "gpt_analyze":
                                                          const analyzeCfg = cfg({
                                                            model: "gpt-4o",
                                                            system: "Tu es un expert en analyse d'intention client. Ton rôle est de comprendre précisément ce que veut le client : identifier ses besoins, ses intentions, ses émotions et les actions qu'il souhaite entreprendre. Analyse le message et fournis une réponse structurée avec : l'intention principale, les besoins identifiés, le niveau d'urgence, et les prochaines actions recommandées.",
                                                            temperature: 0.7,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Analyser intention</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">L'IA comprend ce que veut le client</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Modèle">
                                                                  <StyledSelect
                                                                    value={analyzeCfg.model}
                                                                    onChange={(e) => updateCfg({ ...analyzeCfg, model: e.target.value })}
                                                                    options={[
                                                                      { value: "gpt-4o", label: "gpt-4o" },
                                                                      { value: "gpt-4o-mini", label: "gpt-4o-mini" },
                                                                      { value: "gpt-4-turbo", label: "gpt-4-turbo" },
                                                                      { value: "o1-preview", label: "o1-preview" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                {/* Section Analyse Automatique */}
                                                                <div className="space-y-4 pt-4 border-t border-white/5">
                                                                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                      <Sparkles className="h-4 w-4 text-emerald-400" />
                                                                      <span className="text-sm font-bold text-emerald-400">Détection Automatique</span>
                                                                    </div>
                                                                    <p className="text-[11px] text-white/60 leading-relaxed">
                                                                      Ce bloc analyse automatiquement chaque message pour détecter :
                                                                    </p>
                                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                                                        <Target className="h-3 w-3 text-purple-400" />
                                                                        <span className="text-[10px] text-white/70">Intention</span>
                                                                      </div>
                                                                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                                                        <Smile className="h-3 w-3 text-amber-400" />
                                                                        <span className="text-[10px] text-white/70">Sentiment</span>
                                                                      </div>
                                                                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                                                        <Flame className="h-3 w-3 text-red-400" />
                                                                        <span className="text-[10px] text-white/70">Urgence (1-5)</span>
                                                                      </div>
                                                                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                                                        <Check className="h-3 w-3 text-blue-400" />
                                                                        <span className="text-[10px] text-white/70">Auto-résolvable</span>
                                                                      </div>
                                                                    </div>
                                                                  </div>

                                                                  {/* Intentions détectées */}
                                                                  <div className="space-y-2">
                                                                    <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                      <Target className="h-4 w-4 text-purple-400" />
                                                                      Intentions détectées
                                                                    </label>
                                                                    <p className="text-[10px] text-muted-foreground/60 italic">
                                                                      L'IA identifie automatiquement l'intention du message :
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                      {[
                                                                        { name: "salutation", emoji: "👋", color: "#10b981" },
                                                                        { name: "question_prix", emoji: "💰", color: "#3b82f6" },
                                                                        { name: "demande_produit", emoji: "📦", color: "#8b5cf6" },
                                                                        { name: "plainte", emoji: "😤", color: "#ef4444" },
                                                                        { name: "remerciement", emoji: "🙏", color: "#10b981" },
                                                                        { name: "demande_aide", emoji: "🆘", color: "#f59e0b" },
                                                                        { name: "commande", emoji: "🛒", color: "#ec4899" },
                                                                        { name: "reservation", emoji: "📅", color: "#f59e0b" },
                                                                        { name: "annulation", emoji: "❌", color: "#ef4444" },
                                                                      ].map((intent) => (
                                                                        <div
                                                                          key={intent.name}
                                                                          className="px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5"
                                                                          style={{
                                                                            backgroundColor: `${intent.color}15`,
                                                                            color: intent.color,
                                                                            border: `1px solid ${intent.color}30`
                                                                          }}
                                                                        >
                                                                          <span>{intent.emoji}</span>
                                                                          <span>{intent.name}</span>
                                                                        </div>
                                                                      ))}
                                                                    </div>
                                                                  </div>

                                                                  {/* Variables disponibles */}
                                                                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                      <Code className="h-3.5 w-3.5 text-blue-400" />
                                                                      <span className="text-xs font-medium text-white/80">Variables disponibles</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                                                      <code className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono">{"{{intent}}"}</code>
                                                                      <code className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-mono">{"{{sentiment}}"}</code>
                                                                      <code className="px-2 py-1 rounded bg-red-500/10 text-red-400 font-mono">{"{{urgency}}"}</code>
                                                                      <code className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-mono">{"{{sentiment_score}}"}</code>
                                                                      <code className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono">{"{{auto_resolvable}}"}</code>
                                                                      <code className="px-2 py-1 rounded bg-pink-500/10 text-pink-400 font-mono">{"{{emotions}}"}</code>
                                                                    </div>
                                                                  </div>

                                                                  {/* Section Intentions Personnalisées */}
                                                                  <div className="pt-4 border-t border-white/5 space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                      <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                        <Settings className="h-4 w-4 text-purple-400" />
                                                                        Intentions personnalisées
                                                                      </label>
                                                                      <button
                                                                        onClick={() => updateCfg({ ...analyzeCfg, useCustomIntents: !analyzeCfg.useCustomIntents })}
                                                                        className={`relative w-10 h-5 rounded-full transition-colors ${analyzeCfg.useCustomIntents ? 'bg-purple-500' : 'bg-white/20'}`}
                                                                      >
                                                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${analyzeCfg.useCustomIntents ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                                      </button>
                                                                    </div>

                                                                    {analyzeCfg.useCustomIntents && (
                                                                      <div className="space-y-3">
                                                                        <p className="text-[10px] text-muted-foreground/60 italic">
                                                                          Définissez vos propres intentions que l'IA doit détecter (une par ligne).
                                                                        </p>
                                                                        <textarea
                                                                          value={analyzeCfg.customIntents || ""}
                                                                          onChange={(e) => updateCfg({ ...analyzeCfg, customIntents: e.target.value })}
                                                                          placeholder={`devis
reservation
suivi_commande
retour_produit
partenariat
reclamation_livraison`}
                                                                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none transition-colors resize-none min-h-[100px] font-mono"
                                                                        />
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                          {(analyzeCfg.customIntents || "").split('\n').filter((i: string) => i.trim()).map((intent: string, idx: number) => (
                                                                            <span
                                                                              key={idx}
                                                                              className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                                                            >
                                                                              {intent.trim()}
                                                                            </span>
                                                                          ))}
                                                                        </div>
                                                                        <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
                                                                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                                                                          <p className="text-[10px] text-amber-400/80">
                                                                            Ces intentions remplaceront les intentions par défaut. L'IA classifiera chaque message selon vos catégories.
                                                                          </p>
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                  </div>

                                                                  {/* Instructions supplémentaires */}
                                                                  <div className="pt-4 border-t border-white/5 space-y-2">
                                                                    <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                      <MessageSquare className="h-4 w-4 text-blue-400" />
                                                                      Instructions supplémentaires
                                                                    </label>
                                                                    <textarea
                                                                      value={analyzeCfg.aiInstructions || ""}
                                                                      onChange={(e) => updateCfg({ ...analyzeCfg, aiInstructions: e.target.value })}
                                                                      placeholder="Ex: Considère 'urgent' tout message mentionnant une livraison en retard. Les questions sur les prix doivent être marquées comme 'demande_aide' si le client semble perdu..."
                                                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none transition-colors resize-none min-h-[80px]"
                                                                    />
                                                                  </div>
                                                                </div>


                                                              </div>
                                                            </div>
                                                          );

                                                        case "gpt_respond":
                                                          const gpt = cfg({
                                                            model: "gpt-4o",
                                                            personality: "professionnel",
                                                            domain: "",
                                                            language: "fr",
                                                            responseLength: "moyen",
                                                            rules: [] as string[],
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Réponse IA</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Génère une réponse personnalisée avec GPT</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                {/* Modèle */}
                                                                <FormField label="Modèle">
                                                                  <StyledSelect
                                                                    value={gpt.model}
                                                                    onChange={(e) => updateCfg({ ...gpt, model: e.target.value })}
                                                                    options={[
                                                                      { value: "gpt-4o", label: "gpt-4o" },
                                                                      { value: "gpt-4o-mini", label: "gpt-4o-mini (rapide)" },
                                                                      { value: "gpt-4-turbo", label: "gpt-4-turbo" },
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                {/* Personnalité */}
                                                                <div className="space-y-2">
                                                                  <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                    <Smile className="h-4 w-4 text-purple-400" />
                                                                    Personnalité
                                                                  </label>
                                                                  <div className="grid grid-cols-2 gap-2">
                                                                    {[
                                                                      { id: "professionnel", label: "Professionnel", emoji: "👔", desc: "Formel et courtois" },
                                                                      { id: "amical", label: "Amical", emoji: "😊", desc: "Chaleureux et accessible" },
                                                                      { id: "expert", label: "Expert", emoji: "🎓", desc: "Technique et précis" },
                                                                      { id: "vendeur", label: "Vendeur", emoji: "💼", desc: "Persuasif et engageant" },
                                                                    ].map((p) => (
                                                                      <button
                                                                        key={p.id}
                                                                        onClick={() => updateCfg({ ...gpt, personality: p.id })}
                                                                        className={`p-3 rounded-xl border text-left transition-all ${gpt.personality === p.id
                                                                          ? "border-purple-500/50 bg-purple-500/10"
                                                                          : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                                                                          }`}
                                                                      >
                                                                        <div className="flex items-center gap-2">
                                                                          <span className="text-lg">{p.emoji}</span>
                                                                          <span className="text-xs font-medium text-white">{p.label}</span>
                                                                        </div>
                                                                        <p className="text-[10px] text-white/50 mt-1">{p.desc}</p>
                                                                      </button>
                                                                    ))}
                                                                  </div>
                                                                </div>

                                                                {/* Domaine d'expertise */}
                                                                <div className="space-y-2">
                                                                  <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                    <Briefcase className="h-4 w-4 text-blue-400" />
                                                                    Domaine d'expertise
                                                                  </label>
                                                                  <input
                                                                    type="text"
                                                                    value={gpt.domain || ""}
                                                                    onChange={(e) => updateCfg({ ...gpt, domain: e.target.value })}
                                                                    placeholder="Ex: E-commerce de vêtements, Support technique, Immobilier..."
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none transition-colors"
                                                                  />
                                                                </div>

                                                                {/* Longueur des réponses */}
                                                                <div className="space-y-2">
                                                                  <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-emerald-400" />
                                                                    Longueur des réponses
                                                                  </label>
                                                                  <div className="flex gap-2">
                                                                    {[
                                                                      { id: "court", label: "Court", desc: "1-2 phrases" },
                                                                      { id: "moyen", label: "Moyen", desc: "3-5 phrases" },
                                                                      { id: "long", label: "Détaillé", desc: "Complet" },
                                                                    ].map((l) => (
                                                                      <button
                                                                        key={l.id}
                                                                        onClick={() => updateCfg({ ...gpt, responseLength: l.id })}
                                                                        className={`flex-1 p-2.5 rounded-lg border text-center transition-all ${gpt.responseLength === l.id
                                                                          ? "border-emerald-500/50 bg-emerald-500/10"
                                                                          : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                                                                          }`}
                                                                      >
                                                                        <span className="text-xs font-medium text-white">{l.label}</span>
                                                                        <p className="text-[9px] text-white/40 mt-0.5">{l.desc}</p>
                                                                      </button>
                                                                    ))}
                                                                  </div>
                                                                </div>

                                                                {/* Langue */}
                                                                <FormField label="Langue de réponse">
                                                                  <StyledSelect
                                                                    value={gpt.language || "fr"}
                                                                    onChange={(e) => updateCfg({ ...gpt, language: e.target.value })}
                                                                    options={[
                                                                      { value: "fr", label: "🇫🇷 Français" },
                                                                      { value: "en", label: "🇬🇧 Anglais" },
                                                                      { value: "es", label: "🇪🇸 Espagnol" },
                                                                      { value: "auto", label: "🌍 Auto (langue du client)" },
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                {/* Règles personnalisées */}
                                                                <div className="space-y-2 pt-3 border-t border-white/5">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                      <ListChecks className="h-4 w-4 text-amber-400" />
                                                                      Règles personnalisées
                                                                    </label>
                                                                    <button
                                                                      onClick={() => {
                                                                        const currentRules = gpt.rules || [];
                                                                        updateCfg({ ...gpt, rules: [...currentRules, ""] });
                                                                      }}
                                                                      className="h-6 px-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1 transition-colors"
                                                                    >
                                                                      <Plus className="h-3 w-3" />
                                                                      Ajouter
                                                                    </button>
                                                                  </div>
                                                                  <p className="text-[10px] text-muted-foreground/60 italic">
                                                                    Instructions spécifiques que l'IA doit suivre.
                                                                  </p>

                                                                  {(gpt.rules || []).length === 0 ? (
                                                                    <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center">
                                                                      <p className="text-[11px] text-muted-foreground/50">Aucune règle définie (optionnel)</p>
                                                                    </div>
                                                                  ) : (
                                                                    <div className="space-y-2">
                                                                      {(gpt.rules || []).map((rule: string, ruleIndex: number) => (
                                                                        <div key={ruleIndex} className="flex items-center gap-2">
                                                                          <span className="text-[10px] text-amber-400/60 w-4">{ruleIndex + 1}.</span>
                                                                          <input
                                                                            type="text"
                                                                            value={rule}
                                                                            onChange={(e) => {
                                                                              const newRules = [...(gpt.rules || [])];
                                                                              newRules[ruleIndex] = e.target.value;
                                                                              updateCfg({ ...gpt, rules: newRules });
                                                                            }}
                                                                            placeholder="Ex: Ne jamais donner de prix sans validation"
                                                                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"
                                                                          />
                                                                          <button
                                                                            onClick={() => {
                                                                              const newRules = (gpt.rules || []).filter((_: string, i: number) => i !== ruleIndex);
                                                                              updateCfg({ ...gpt, rules: newRules });
                                                                            }}
                                                                            className="h-6 w-6 rounded hover:bg-white/5 text-white/30 hover:text-red-400 flex items-center justify-center transition-colors"
                                                                          >
                                                                            <X className="h-3 w-3" />
                                                                          </button>
                                                                        </div>
                                                                      ))}
                                                                    </div>
                                                                  )}

                                                                  {/* Suggestions de règles */}
                                                                  {(gpt.rules || []).length === 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                      {[
                                                                        "Toujours proposer de l'aide",
                                                                        "Répondre en moins de 3 phrases",
                                                                        "Utiliser des emojis",
                                                                        "Ne pas parler de la concurrence",
                                                                      ].map((suggestion) => (
                                                                        <button
                                                                          key={suggestion}
                                                                          onClick={() => updateCfg({ ...gpt, rules: [suggestion] })}
                                                                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/50 hover:text-white/70 transition-colors"
                                                                        >
                                                                          + {suggestion}
                                                                        </button>
                                                                      ))}
                                                                    </div>
                                                                  )}
                                                                </div>

                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_agent":
                                                          const agentCfg = cfg({
                                                            name: "Mon Agent",
                                                            model: "gpt-4o",
                                                            agentType: "assistant",
                                                            instructions: "Tu es un assistant utile.",
                                                            dataSources: {
                                                              urls: [] as string[],
                                                              files: [] as string[],
                                                              mcpProviders: [] as string[],
                                                            },
                                                            domain: "",
                                                            personality: "professionnel",
                                                            capabilities: [] as string[],
                                                            rules: [] as string[],
                                                            includeHistory: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              {/* Header */}
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">{agentCfg.name || "Mon Agent"}</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Agent IA autonome avec outils et mémoire</p>
                                                              </div>

                                                              <div className="py-4 space-y-6">
                                                                {/* Instructions de l'Agent (PROMPT) */}
                                                                <div className="space-y-2">
                                                                  <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                    <Wand2 className="h-4 w-4 text-purple-400" />
                                                                    Instructions (Prompt Système)
                                                                  </label>
                                                                  <textarea
                                                                    value={agentCfg.instructions}
                                                                    onChange={(e) => updateCfg({ ...agentCfg, instructions: e.target.value })}
                                                                    placeholder="Dis à l'IA comment elle doit se comporter et ce qu'elle doit faire..."
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-purple-500/50 outline-none min-h-[100px] transition-all"
                                                                  />
                                                                </div>

                                                                {/* Sources de Données & MCP */}
                                                                <div className="space-y-3 pt-4 border-t border-white/5">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                      <Database className="h-4 w-4 text-emerald-400" />
                                                                      Sources de Données & MCP
                                                                    </label>
                                                                    <div className="flex gap-2">
                                                                      <button
                                                                        onClick={() => {
                                                                          const urls = agentCfg.dataSources?.urls || [];
                                                                          updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, urls: [...urls, ""] } });
                                                                        }}
                                                                        className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                                                        title="Ajouter un lien Web"
                                                                      >
                                                                        <Globe className="h-3.5 w-3.5" />
                                                                      </button>
                                                                      <button
                                                                        onClick={() => {
                                                                          const files = agentCfg.dataSources?.files || [];
                                                                          updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, files: [...files, ""] } });
                                                                        }}
                                                                        className="p-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                                                        title="Uploader un fichier"
                                                                      >
                                                                        <Upload className="h-3.5 w-3.5" />
                                                                      </button>
                                                                      <button
                                                                        onClick={() => {
                                                                          const mcps = agentCfg.dataSources?.mcpProviders || [];
                                                                          updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, mcpProviders: [...mcps, ""] } });
                                                                        }}
                                                                        className="p-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                                                                        title="Ajouter un serveur MCP"
                                                                      >
                                                                        <Cpu className="h-3.5 w-3.5" />
                                                                      </button>
                                                                    </div>
                                                                  </div>

                                                                  <div className="space-y-3">
                                                                    {/* Liste des URLs */}
                                                                    {(agentCfg.dataSources?.urls || []).map((url: string, i: number) => (
                                                                      <div key={`url-${i}`} className="flex items-center gap-2">
                                                                        <Globe className="h-3 w-3 text-emerald-400/60" />
                                                                        <input
                                                                          type="text"
                                                                          value={url}
                                                                          onChange={(e) => {
                                                                            const urls = [...agentCfg.dataSources.urls];
                                                                            urls[i] = e.target.value;
                                                                            updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, urls } });
                                                                          }}
                                                                          placeholder="https://votre-site.com"
                                                                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none"
                                                                        />
                                                                        <button onClick={() => {
                                                                          const urls = agentCfg.dataSources.urls.filter((_: any, idx: number) => idx !== i);
                                                                          updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, urls } });
                                                                        }} className="text-white/20 hover:text-red-400"><X className="h-3 w-3" /></button>
                                                                      </div>
                                                                    ))}

                                                                    {/* Liste des Fichiers */}
                                                                    {(agentCfg.dataSources?.files || []).map((file: any, i: number) => (
                                                                      <div key={`file-${i}`} className="flex items-center gap-2">
                                                                        <FileText className="h-3 w-3 text-blue-400/60" />
                                                                        <label className="flex-1 flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 cursor-pointer hover:border-blue-500/30 transition-colors">
                                                                          <span className="text-[10px] text-white/60 truncate max-w-[150px]">
                                                                            {typeof file === 'object' && file.name ? file.name : 'Cliquer pour uploader PDF/Doc...'}
                                                                          </span>
                                                                          <Upload className="h-2.5 w-2.5 text-white/40" />
                                                                          <input
                                                                            type="file"
                                                                            accept=".pdf,.doc,.docx,.txt"
                                                                            className="hidden"
                                                                            onChange={(e) => {
                                                                              const uploadedFile = e.target.files?.[0];
                                                                              if (uploadedFile) {
                                                                                const reader = new FileReader();
                                                                                reader.onloadend = () => {
                                                                                  const files = [...(agentCfg.dataSources?.files || [])];
                                                                                  files[i] = {
                                                                                    name: uploadedFile.name,
                                                                                    type: uploadedFile.type,
                                                                                    size: uploadedFile.size,
                                                                                    data: reader.result
                                                                                  };
                                                                                  updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, files } });
                                                                                };
                                                                                reader.readAsDataURL(uploadedFile);
                                                                              }
                                                                            }}
                                                                          />
                                                                        </label>
                                                                        <button onClick={() => {
                                                                          const files = (agentCfg.dataSources?.files || []).filter((_: any, idx: number) => idx !== i);
                                                                          updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, files } });
                                                                        }} className="text-white/20 hover:text-red-400"><X className="h-3 w-3" /></button>
                                                                      </div>
                                                                    ))}

                                                                    {/* Liste des MCP */}
                                                                    {(agentCfg.dataSources?.mcpProviders || []).map((mcp: string, i: number) => (
                                                                      <div key={`mcp-${i}`} className="flex items-center gap-2">
                                                                        <Cpu className="h-3 w-3 text-amber-400/60" />
                                                                        <input
                                                                          type="text"
                                                                          value={mcp}
                                                                          onChange={(e) => {
                                                                            const mcps = [...agentCfg.dataSources.mcpProviders];
                                                                            mcps[i] = e.target.value;
                                                                            updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, mcpProviders: mcps } });
                                                                          }}
                                                                          placeholder="Endpoint serveur MCP"
                                                                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none"
                                                                        />
                                                                        <button onClick={() => {
                                                                          const mcps = agentCfg.dataSources.mcpProviders.filter((_: any, idx: number) => idx !== i);
                                                                          updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, mcpProviders: mcps } });
                                                                        }} className="text-white/20 hover:text-red-400"><X className="h-3 w-3" /></button>
                                                                      </div>
                                                                    ))}

                                                                    {/* Suggestions MCP */}
                                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                                      {[
                                                                        { name: "Google Calendar", endpoint: "http://localhost:3003", icon: "📅" },
                                                                        { name: "Gmail", endpoint: "http://localhost:3004", icon: "📧" },
                                                                        { name: "Calendly", endpoint: "http://localhost:3005", icon: "🔗" },
                                                                        { name: "Brave Search", endpoint: "http://localhost:3006", icon: "🔍" },
                                                                        { name: "Devises", endpoint: "http://localhost:3007", icon: "🪙" },
                                                                        { name: "Notion", endpoint: "http://localhost:3008", icon: "📝" },
                                                                        { name: "Slack", endpoint: "http://localhost:3009", icon: "💬" },
                                                                        { name: "Sheets", endpoint: "http://localhost:3010", icon: "📊" },
                                                                        { name: "Maps", endpoint: "http://localhost:3011", icon: "📍" },
                                                                      ].map((mcpSuggestion) => (
                                                                        <button
                                                                          key={mcpSuggestion.name}
                                                                          onClick={() => {
                                                                            const mcps = agentCfg.dataSources?.mcpProviders || [];
                                                                            if (!mcps.includes(mcpSuggestion.endpoint)) {
                                                                              updateCfg({ ...agentCfg, dataSources: { ...agentCfg.dataSources, mcpProviders: [...mcps, mcpSuggestion.endpoint] } });
                                                                            }
                                                                          }}
                                                                          className="px-2 py-1 rounded-md bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 text-[9px] text-amber-500/70 hover:text-amber-500 transition-colors flex items-center gap-1.5"
                                                                        >
                                                                          <span>{mcpSuggestion.icon}</span>
                                                                          {mcpSuggestion.name}
                                                                        </button>
                                                                      ))}
                                                                    </div>
                                                                  </div>
                                                                </div>

                                                                {/* Paramètres de base */}


                                                                <div className="pt-4 border-t border-white/5 space-y-4">
                                                                  <div className="space-y-2">
                                                                    <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                      <Bot className="h-4 w-4 text-purple-400" />
                                                                      Nom de l'agent
                                                                    </label>
                                                                    <input
                                                                      type="text"
                                                                      value={agentCfg.name}
                                                                      onChange={(e) => updateCfg({ ...agentCfg, name: e.target.value })}
                                                                      placeholder="Ex: Sophie, Assistant Commercial..."
                                                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500/50 transition-colors"
                                                                    />
                                                                  </div>

                                                                  <FormField label="Modèle IA">
                                                                    <StyledSelect
                                                                      value={agentCfg.model}
                                                                      onChange={(e) => updateCfg({ ...agentCfg, model: e.target.value })}
                                                                      options={[
                                                                        { value: "gpt-4o", label: "gpt-4o (recommandé)" },
                                                                        { value: "gpt-4o-mini", label: "gpt-4o-mini (rapide)" },
                                                                        { value: "o1-preview", label: "o1-preview (raisonnement)" },
                                                                      ]}
                                                                    />
                                                                  </FormField>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "sentiment":
                                                          const sentimentCfg = cfg({
                                                            model: "gpt-4o-mini",
                                                            target: "last_message",
                                                            outputFormat: "score",
                                                            threshold: -0.5,
                                                            detectEmotions: true,
                                                            detectTone: true,
                                                            detectUrgency: true,
                                                            actions: {
                                                              positive: "continue",
                                                              negative: "escalate",
                                                              neutral: "continue",
                                                            },
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Analyse sentiment</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Détecte si le client est satisfait ou frustré</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Modèle">
                                                                  <StyledSelect
                                                                    value={sentimentCfg.model}
                                                                    onChange={(e) => updateCfg({ ...sentimentCfg, model: e.target.value })}
                                                                    options={[
                                                                      { value: "gpt-4o-mini", label: "gpt-4o-mini" },
                                                                      { value: "gpt-4o", label: "gpt-4o" },
                                                                      { value: "gpt-4-turbo", label: "gpt-4-turbo" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Cible de l'analyse">
                                                                  <StyledSelect
                                                                    value={sentimentCfg.target}
                                                                    onChange={(e) => updateCfg({ ...sentimentCfg, target: e.target.value })}
                                                                    options={[
                                                                      { value: "last_message", label: "Dernier message uniquement" },
                                                                      { value: "conversation", label: "Toute la conversation" },
                                                                      { value: "last_5_messages", label: "5 derniers messages" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Format de sortie">
                                                                  <StyledSelect
                                                                    value={sentimentCfg.outputFormat}
                                                                    onChange={(e) => updateCfg({ ...sentimentCfg, outputFormat: e.target.value })}
                                                                    options={[
                                                                      { value: "score", label: "Score numérique (-1 à 1)" },
                                                                      { value: "category", label: "Catégorie (positif/négatif/neutre)" },
                                                                      { value: "detailed", label: "Analyse détaillée (émotions)" },
                                                                      { value: "json", label: "JSON structuré" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <div className="space-y-3">
                                                                  <div className="text-xs font-medium text-muted-foreground">Éléments à détecter</div>
                                                                  <div className="grid grid-cols-3 gap-2">
                                                                    {[
                                                                      { key: "detectEmotions", label: "Émotions", icon: "😊" },
                                                                      { key: "detectTone", label: "Ton", icon: "🎭" },
                                                                      { key: "detectUrgency", label: "Urgence", icon: "⚡" },
                                                                    ].map((option) => (
                                                                      <label
                                                                        key={option.key}
                                                                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg cursor-pointer transition-all border ${(sentimentCfg as any)[option.key]
                                                                          ? "bg-pink-500/10 border-pink-500/30"
                                                                          : "bg-white/5 border-white/10 hover:border-pink-500/20"
                                                                          }`}
                                                                      >
                                                                        <input
                                                                          type="checkbox"
                                                                          checked={(sentimentCfg as any)[option.key] || false}
                                                                          onChange={(e) =>
                                                                            updateCfg({
                                                                              ...sentimentCfg,
                                                                              [option.key]: e.target.checked,
                                                                            })
                                                                          }
                                                                          className="sr-only"
                                                                        />
                                                                        <span className="text-lg">{option.icon}</span>
                                                                        <span className="text-[9px] font-medium text-white/80 text-center">
                                                                          {option.label}
                                                                        </span>
                                                                      </label>
                                                                    ))}
                                                                  </div>
                                                                </div>

                                                                <FormField label="Seuil d'alerte (négatif)">
                                                                  <div className="flex items-center gap-3 flex-1">
                                                                    <input
                                                                      type="range"
                                                                      min="-1"
                                                                      max="0"
                                                                      step="0.1"
                                                                      value={sentimentCfg.threshold}
                                                                      onChange={(e) => updateCfg({ ...sentimentCfg, threshold: parseFloat(e.target.value) })}
                                                                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                                                    />
                                                                    <span className="text-sm font-bold text-pink-400 w-12 text-right">
                                                                      {sentimentCfg.threshold}
                                                                    </span>
                                                                  </div>
                                                                </FormField>

                                                                <div className="pt-2">
                                                                  <button
                                                                    onClick={() => setShowAdvancedSentiment(!showAdvancedSentiment)}
                                                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                                                                  >
                                                                    <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedSentiment ? "rotate-180" : ""}`} />
                                                                    <span>{showAdvancedSentiment ? "Moins" : "Plus"}</span>
                                                                  </button>
                                                                </div>

                                                                {showAdvancedSentiment && (
                                                                  <div className="space-y-4 pt-2">
                                                                    <div className="text-xs font-medium text-muted-foreground">Actions selon le sentiment</div>
                                                                    {Object.entries({
                                                                      positive: { label: "Positif", desc: "Client satisfait" },
                                                                      neutral: { label: "Neutre", desc: "Sentiment neutre" },
                                                                      negative: { label: "Négatif", desc: "Client frustré" },
                                                                    }).map(([key, { label, desc }]) => (
                                                                      <FormField key={key} label={label}>
                                                                        <StyledSelect
                                                                          value={(sentimentCfg.actions as any)[key] || "continue"}
                                                                          onChange={(e) => updateCfg({
                                                                            ...sentimentCfg,
                                                                            actions: { ...sentimentCfg.actions, [key]: e.target.value },
                                                                          })}
                                                                          options={[
                                                                            { value: "continue", label: "Continuer le flux" },
                                                                            { value: "escalate", label: "Escalader à un humain" },
                                                                            { value: "special_response", label: "Réponse spéciale" },
                                                                            { value: "stop", label: "Arrêter le workflow" }
                                                                          ]}
                                                                        />
                                                                      </FormField>
                                                                    ))}
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </div>
                                                          );

                                                        case "rag_knowledge":
                                                          const ragCfg = cfg({
                                                            knowledgeBaseId: "default",
                                                            searchMode: "semantic",
                                                            maxDocuments: 3,
                                                            temperature: 0,
                                                            fallbackMessage: "Désolé, je n'ai pas trouvé d'information à ce sujet dans mes documents.",
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Base de Connaissances</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Répond en utilisant vos documents (PDF, Doc)</p>
                                                              </div>
                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Base de connaissances">
                                                                  <StyledSelect
                                                                    value={ragCfg.knowledgeBaseId}
                                                                    onChange={(e) => updateCfg({ ...ragCfg, knowledgeBaseId: e.target.value })}
                                                                    options={[
                                                                      { value: "default", label: "Base par défaut" },
                                                                      { value: "manual", label: "Saisie manuelle" },
                                                                      { value: "produits", label: "Fiches Produits" },
                                                                      { value: "legal", label: "Documents Légaux" },
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                {ragCfg.knowledgeBaseId === "manual" && (
                                                                  <div className="space-y-2">
                                                                    <label className="text-xs font-medium text-white/70">Contenu de la base (Texte ou PDF extrait)</label>
                                                                    <textarea
                                                                      value={ragCfg.knowledgeContent || ""}
                                                                      onChange={(e) => updateCfg({ ...ragCfg, knowledgeContent: e.target.value })}
                                                                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[11px] text-white focus:border-purple-500/50 outline-none min-h-[150px] transition-all"
                                                                      placeholder="Collez ici les informations de votre entreprise..."
                                                                    />
                                                                    <p className="text-[9px] text-muted-foreground italic">
                                                                      Astuce : Plus vous donnez de détails, plus l'IA sera précise.
                                                                    </p>
                                                                  </div>
                                                                )}

                                                                <FormField label="Nombre de docs à consulter">
                                                                  <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="10"
                                                                    value={ragCfg.maxDocuments}
                                                                    onChange={(e) => updateCfg({ ...ragCfg, maxDocuments: parseInt(e.target.value) })}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg h-9 px-3 text-xs text-white"
                                                                  />
                                                                </FormField>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "python_script":
                                                          const scriptCfg = cfg({
                                                            script: "# Écrivez votre code Python ici\n# Utilisez 'context' pour accéder aux données\n# Stockez les résultats dans 'results'\n\nresults['message'] = f'Bonjour {context.get(\"userName\", \"client\")}!'",
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Script Python</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Exécutez du code Python personnalisé</p>
                                                              </div>
                                                              <div className="py-4 space-y-4">
                                                                <div className="space-y-2">
                                                                  <label className="text-xs font-medium text-white/70">Code Python (LangChain Ready)</label>
                                                                  <textarea
                                                                    value={scriptCfg.script}
                                                                    onChange={(e) => updateCfg({ ...scriptCfg, script: e.target.value })}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-[11px] font-mono text-emerald-400 min-h-[200px] focus:border-emerald-500/50 outline-none"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "long_term_memory":
                                                          const memoryCfg = cfg({
                                                            action: "load",
                                                            key: "user_preferences",
                                                            ttl: 30,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Mémoire Long Terme</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Retenir des infos sur le client</p>
                                                              </div>
                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Action">
                                                                  <StyledSelect
                                                                    value={memoryCfg.action}
                                                                    onChange={(e) => updateCfg({ ...memoryCfg, action: e.target.value })}
                                                                    options={[
                                                                      { value: "load", label: "Charger la mémoire" },
                                                                      { value: "store", label: "Enregistrer en mémoire" },
                                                                    ]}
                                                                  />
                                                                </FormField>
                                                                <FormField label="Clé de mémoire">
                                                                  <input
                                                                    type="text"
                                                                    value={memoryCfg.key}
                                                                    onChange={(e) => updateCfg({ ...memoryCfg, key: e.target.value })}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg h-9 px-3 text-xs text-white"
                                                                    placeholder="ex : preferences_achat"
                                                                  />
                                                                </FormField>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_translate":
                                                          const translateCfg = cfg({
                                                            sourceLanguage: "auto",
                                                            targetLanguage: "fr",
                                                            preserveTone: true,
                                                            formalityLevel: "neutral",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-5 relative overflow-hidden">
                                                                <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                                                      <Globe className="h-3.5 w-3.5 text-blue-400" />
                                                                    </div>
                                                                    <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
                                                                      Traduction IA
                                                                    </label>
                                                                  </div>
                                                                  <Badge className="bg-blue-500/20 text-blue-400 border-none text-[8px] uppercase font-black px-2">
                                                                    Multi-langues
                                                                  </Badge>
                                                                </div>

                                                                {/* Source Language */}
                                                                <div className="space-y-2">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                    Langue Source
                                                                  </label>
                                                                  <select
                                                                    value={translateCfg.sourceLanguage}
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...translateCfg,
                                                                        sourceLanguage: e.target.value,
                                                                      })
                                                                    }
                                                                    className="w-full bg-black/60 border border-white/10 rounded-xl h-10 text-xs px-3 text-white appearance-none cursor-pointer hover:border-blue-500/30 transition-all font-bold"
                                                                  >
                                                                    <option value="auto">🔍 Détection automatique</option>
                                                                    <option value="en">🇬🇧 Anglais</option>
                                                                    <option value="fr">🇫🇷 Français</option>
                                                                    <option value="es">🇪🇸 Espagnol</option>
                                                                    <option value="de">🇩🇪 Allemand</option>
                                                                    <option value="ar">🇸🇦 Arabe</option>
                                                                    <option value="zh">🇨🇳 Chinois</option>
                                                                    <option value="pt">🇧🇷 Portugais</option>
                                                                  </select>
                                                                </div>

                                                                {/* Target Language */}
                                                                <div className="space-y-2">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                    Langue Cible *
                                                                  </label>
                                                                  <select
                                                                    value={translateCfg.targetLanguage}
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...translateCfg,
                                                                        targetLanguage: e.target.value,
                                                                      })
                                                                    }
                                                                    className="w-full bg-black/60 border border-white/10 rounded-xl h-10 text-xs px-3 text-white appearance-none cursor-pointer hover:border-blue-500/30 transition-all font-bold"
                                                                  >
                                                                    <option value="fr">🇫🇷 Français</option>
                                                                    <option value="en">🇬🇧 Anglais</option>
                                                                    <option value="es">🇪🇸 Espagnol</option>
                                                                    <option value="de">🇩🇪 Allemand</option>
                                                                    <option value="ar">🇸🇦 Arabe</option>
                                                                    <option value="zh">🇨🇳 Chinois</option>
                                                                    <option value="pt">🇧🇷 Portugais</option>
                                                                    <option value="it">🇮🇹 Italien</option>
                                                                    <option value="ja">🇯🇵 Japonais</option>
                                                                    <option value="ko">🇰🇷 Coréen</option>
                                                                  </select>
                                                                </div>

                                                                {/* Formality */}
                                                                <div className="space-y-2">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                    Niveau de Formalité
                                                                  </label>
                                                                  <div className="grid grid-cols-3 gap-2">
                                                                    {["informal", "neutral", "formal"].map((level) => (
                                                                      <button
                                                                        key={level}
                                                                        onClick={() =>
                                                                          updateCfg({
                                                                            ...translateCfg,
                                                                            formalityLevel: level,
                                                                          })
                                                                        }
                                                                        className={`p-2 rounded-lg text-[9px] font-bold uppercase transition-all ${translateCfg.formalityLevel === level
                                                                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                                          : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
                                                                          }`}
                                                                      >
                                                                        {level === "informal" ? "😎 Informel" : level === "neutral" ? "😊 Neutre" : "🎩 Formel"}
                                                                      </button>
                                                                    ))}
                                                                  </div>
                                                                </div>

                                                                {/* Options */}
                                                                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                                                                  <input
                                                                    type="checkbox"
                                                                    checked={translateCfg.preserveTone}
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...translateCfg,
                                                                        preserveTone: e.target.checked,
                                                                      })
                                                                    }
                                                                    className="h-4 w-4 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/20"
                                                                  />
                                                                  <span className="text-[10px] font-medium text-white/80">Préserver le ton et les émojis</span>
                                                                </label>
                                                              </div>

                                                              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                                                                <Globe className="h-4 w-4 text-blue-400 shrink-0 opacity-40" />
                                                                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium italic">
                                                                  Traduction automatique de haute qualité pour communiquer avec vos clients internationaux.
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_summarize":
                                                          const summarizeCfg = cfg({
                                                            mode: "conversation",
                                                            length: "medium",
                                                            format: "bullet",
                                                            includeActionItems: true,
                                                            includeSentiment: false,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 space-y-5 relative overflow-hidden">
                                                                <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                                                                      <FileText className="h-3.5 w-3.5 text-violet-400" />
                                                                    </div>
                                                                    <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
                                                                      Résumé IA
                                                                    </label>
                                                                  </div>
                                                                  <Badge className="bg-violet-500/20 text-violet-400 border-none text-[8px] uppercase font-black px-2">
                                                                    Synthèse
                                                                  </Badge>
                                                                </div>

                                                                {/* Mode */}
                                                                <div className="space-y-2">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                    Type de Contenu
                                                                  </label>
                                                                  <select
                                                                    value={summarizeCfg.mode}
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...summarizeCfg,
                                                                        mode: e.target.value,
                                                                      })
                                                                    }
                                                                    className="w-full bg-black/60 border border-white/10 rounded-xl h-10 text-xs px-3 text-white appearance-none cursor-pointer hover:border-violet-500/30 transition-all font-bold"
                                                                  >
                                                                    <option value="conversation">💬 Conversation complète</option>
                                                                    <option value="last_message">📩 Dernier message</option>
                                                                    <option value="document">📄 Document/Texte</option>
                                                                  </select>
                                                                </div>

                                                                {/* Longueur */}
                                                                <div className="space-y-2">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                    Longueur du Résumé
                                                                  </label>
                                                                  <div className="grid grid-cols-3 gap-2">
                                                                    {["short", "medium", "detailed"].map((len) => (
                                                                      <button
                                                                        key={len}
                                                                        onClick={() =>
                                                                          updateCfg({
                                                                            ...summarizeCfg,
                                                                            length: len,
                                                                          })
                                                                        }
                                                                        className={`p-2 rounded-lg text-[9px] font-bold uppercase transition-all ${summarizeCfg.length === len
                                                                          ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                                                          : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
                                                                          }`}
                                                                      >
                                                                        {len === "short" ? "📝 Court" : len === "medium" ? "📋 Moyen" : "📖 Détaillé"}
                                                                      </button>
                                                                    ))}
                                                                  </div>
                                                                </div>

                                                                {/* Format */}
                                                                <div className="space-y-2">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                    Format de Sortie
                                                                  </label>
                                                                  <select
                                                                    value={summarizeCfg.format}
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...summarizeCfg,
                                                                        format: e.target.value,
                                                                      })
                                                                    }
                                                                    className="w-full bg-black/60 border border-white/10 rounded-xl h-10 text-xs px-3 text-white appearance-none cursor-pointer hover:border-violet-500/30 transition-all font-bold"
                                                                  >
                                                                    <option value="bullet">• Points clés</option>
                                                                    <option value="paragraph">📃 Paragraphe</option>
                                                                    <option value="structured">📊 JSON structuré</option>
                                                                  </select>
                                                                </div>

                                                                {/* Options */}
                                                                <div className="space-y-2 pt-2 border-t border-white/5">
                                                                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                                                                    <input
                                                                      type="checkbox"
                                                                      checked={summarizeCfg.includeActionItems}
                                                                      onChange={(e) =>
                                                                        updateCfg({
                                                                          ...summarizeCfg,
                                                                          includeActionItems: e.target.checked,
                                                                        })
                                                                      }
                                                                      className="h-4 w-4 rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500/20"
                                                                    />
                                                                    <span className="text-[10px] font-medium text-white/80">Extraire les actions à faire</span>
                                                                  </label>
                                                                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                                                                    <input
                                                                      type="checkbox"
                                                                      checked={summarizeCfg.includeSentiment}
                                                                      onChange={(e) =>
                                                                        updateCfg({
                                                                          ...summarizeCfg,
                                                                          includeSentiment: e.target.checked,
                                                                        })
                                                                      }
                                                                      className="h-4 w-4 rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500/20"
                                                                    />
                                                                    <span className="text-[10px] font-medium text-white/80">Inclure l'analyse de sentiment</span>
                                                                  </label>
                                                                </div>
                                                              </div>

                                                              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 flex gap-3">
                                                                <FileText className="h-4 w-4 text-violet-400 shrink-0 opacity-40" />
                                                                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium italic">
                                                                  Créez des résumés intelligents pour garder une trace des demandes clients.
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_moderation":
                                                          const moderationCfg = cfg({
                                                            blockIfFlagged: true,
                                                            threshold: 70,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                                                    <ShieldCheck className="h-5 w-5 text-red-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Modération IA</h4>
                                                                    <p className="text-[10px] text-red-400/60">Détecte contenu inapproprié</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Seuil (0-100)</label>
                                                                  <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={100}
                                                                    value={moderationCfg.threshold}
                                                                    onChange={(e) => updateCfg({ ...moderationCfg, threshold: parseInt(e.target.value) || 70 })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                  />
                                                                </div>
                                                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                                                                  <span className="text-[10px] text-white/70">Bloquer si flaggé</span>
                                                                  <button
                                                                    onClick={() => updateCfg({ ...moderationCfg, blockIfFlagged: !moderationCfg.blockIfFlagged })}
                                                                    className={`relative w-10 h-6 rounded-full transition-colors ${moderationCfg.blockIfFlagged ? "bg-red-500" : "bg-white/20"}`}
                                                                  >
                                                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${moderationCfg.blockIfFlagged ? "left-5" : "left-1"}`} />
                                                                  </button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_analyze_image":
                                                          const analyzeImageCfg = cfg({
                                                            detailed: true,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                                                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Analyser Image</h4>
                                                                    <p className="text-[10px] text-cyan-400/60">GPT-4 Vision décrit l'image</p>
                                                                  </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                                                                  <span className="text-[10px] text-white/70">Description détaillée</span>
                                                                  <button
                                                                    onClick={() => updateCfg({ ...analyzeImageCfg, detailed: !analyzeImageCfg.detailed })}
                                                                    className={`relative w-10 h-6 rounded-full transition-colors ${analyzeImageCfg.detailed ? "bg-cyan-500" : "bg-white/20"}`}
                                                                  >
                                                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${analyzeImageCfg.detailed ? "left-5" : "left-1"}`} />
                                                                  </button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_generate_image":
                                                          const generateImageCfg = cfg({
                                                            size: "1024x1024",
                                                            quality: "standard",
                                                            prompt: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                                                    <ImageIcon className="h-5 w-5 text-purple-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Générer Image (DALL-E)</h4>
                                                                    <p className="text-[10px] text-purple-400/60">Crée une image depuis un prompt</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Prompt</label>
                                                                  <textarea
                                                                    value={generateImageCfg.prompt}
                                                                    onChange={(e) => updateCfg({ ...generateImageCfg, prompt: e.target.value })}
                                                                    className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                                                                    placeholder="Décrivez l'image à générer..."
                                                                  />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                  <div>
                                                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Taille</label>
                                                                    <select
                                                                      value={generateImageCfg.size}
                                                                      onChange={(e) => updateCfg({ ...generateImageCfg, size: e.target.value })}
                                                                      className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                    >
                                                                      <option value="1024x1024">1024x1024</option>
                                                                      <option value="1792x1024">1792x1024</option>
                                                                      <option value="1024x1792">1024x1792</option>
                                                                    </select>
                                                                  </div>
                                                                  <div>
                                                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Qualité</label>
                                                                    <select
                                                                      value={generateImageCfg.quality}
                                                                      onChange={(e) => updateCfg({ ...generateImageCfg, quality: e.target.value })}
                                                                      className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                    >
                                                                      <option value="standard">Standard</option>
                                                                      <option value="hd">HD</option>
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_generate_audio":
                                                          const generateAudioCfg = cfg({
                                                            voice: "alloy",
                                                            speed: 1.0,
                                                            text: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                                                    <Mic className="h-5 w-5 text-orange-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Générer Audio (TTS)</h4>
                                                                    <p className="text-[10px] text-orange-400/60">Convertit texte en voix</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Texte</label>
                                                                  <textarea
                                                                    value={generateAudioCfg.text}
                                                                    onChange={(e) => updateCfg({ ...generateAudioCfg, text: e.target.value })}
                                                                    className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                                                                    placeholder="Texte à convertir en audio..."
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Voix</label>
                                                                  <select
                                                                    value={generateAudioCfg.voice}
                                                                    onChange={(e) => updateCfg({ ...generateAudioCfg, voice: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="alloy">Alloy</option>
                                                                    <option value="echo">Echo</option>
                                                                    <option value="fable">Fable</option>
                                                                    <option value="onyx">Onyx</option>
                                                                    <option value="nova">Nova</option>
                                                                    <option value="shimmer">Shimmer</option>
                                                                  </select>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Vitesse: {generateAudioCfg.speed}x</label>
                                                                  <input
                                                                    type="range"
                                                                    min="0.25"
                                                                    max="4"
                                                                    step="0.25"
                                                                    value={generateAudioCfg.speed}
                                                                    onChange={(e) => updateCfg({ ...generateAudioCfg, speed: parseFloat(e.target.value) })}
                                                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_transcribe":
                                                          const transcribeCfg = cfg({
                                                            language: "auto",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                                    <Mic className="h-5 w-5 text-emerald-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Transcrire Audio (Whisper)</h4>
                                                                    <p className="text-[10px] text-emerald-400/60">Audio → Texte</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Langue</label>
                                                                  <select
                                                                    value={transcribeCfg.language}
                                                                    onChange={(e) => updateCfg({ ...transcribeCfg, language: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="auto">Détection auto</option>
                                                                    <option value="fr">Français</option>
                                                                    <option value="en">Anglais</option>
                                                                    <option value="es">Espagnol</option>
                                                                    <option value="ar">Arabe</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_generate_video":
                                                          const generateVideoCfg = cfg({
                                                            duration: 5,
                                                            prompt: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                                                    <ImageIcon className="h-5 w-5 text-indigo-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Générer Vidéo (Sora)</h4>
                                                                    <p className="text-[10px] text-indigo-400/60">Crée une vidéo depuis un prompt</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Prompt</label>
                                                                  <textarea
                                                                    value={generateVideoCfg.prompt}
                                                                    onChange={(e) => updateCfg({ ...generateVideoCfg, prompt: e.target.value })}
                                                                    className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                                                                    placeholder="Décrivez la vidéo à générer..."
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Durée (secondes)</label>
                                                                  <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={60}
                                                                    value={generateVideoCfg.duration}
                                                                    onChange={(e) => updateCfg({ ...generateVideoCfg, duration: parseInt(e.target.value) || 5 })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_edit_image":
                                                          const editImageCfg = cfg({
                                                            prompt: "",
                                                            size: "1024x1024",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                                                    <ImageIcon className="h-5 w-5 text-pink-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Éditer Image</h4>
                                                                    <p className="text-[10px] text-pink-400/60">Modifie une image avec DALL-E</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Prompt de modification</label>
                                                                  <textarea
                                                                    value={editImageCfg.prompt}
                                                                    onChange={(e) => updateCfg({ ...editImageCfg, prompt: e.target.value })}
                                                                    className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                                                                    placeholder="Décrivez les modifications à apporter..."
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Taille</label>
                                                                  <select
                                                                    value={editImageCfg.size}
                                                                    onChange={(e) => updateCfg({ ...editImageCfg, size: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="1024x1024">1024x1024</option>
                                                                    <option value="1792x1024">1792x1024</option>
                                                                    <option value="1024x1792">1024x1792</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_translate_audio":
                                                          const translateAudioCfg = cfg({
                                                            targetLanguage: "fr",
                                                            format: "text",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                                    <Mic className="h-5 w-5 text-amber-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Traduire Audio</h4>
                                                                    <p className="text-[10px] text-amber-400/60">Traduit un enregistrement audio</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Langue cible</label>
                                                                  <select
                                                                    value={translateAudioCfg.targetLanguage}
                                                                    onChange={(e) => updateCfg({ ...translateAudioCfg, targetLanguage: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="fr">Français</option>
                                                                    <option value="en">Anglais</option>
                                                                    <option value="es">Espagnol</option>
                                                                    <option value="de">Allemand</option>
                                                                    <option value="ar">Arabe</option>
                                                                  </select>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Format de sortie</label>
                                                                  <select
                                                                    value={translateAudioCfg.format}
                                                                    onChange={(e) => updateCfg({ ...translateAudioCfg, format: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="text">Texte</option>
                                                                    <option value="json">JSON</option>
                                                                    <option value="srt">SRT (sous-titres)</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_delete_file":
                                                          const deleteFileCfg = cfg({
                                                            fileId: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                                                    <FileText className="h-5 w-5 text-red-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Supprimer Fichier</h4>
                                                                    <p className="text-[10px] text-red-400/60">Supprime un fichier via OpenAI</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">ID du fichier</label>
                                                                  <Input
                                                                    value={deleteFileCfg.fileId}
                                                                    onChange={(e) => updateCfg({ ...deleteFileCfg, fileId: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="file-xxx"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_list_files":
                                                          const listFilesCfg = cfg({
                                                            purpose: "all",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                                    <FileText className="h-5 w-5 text-blue-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Lister Fichiers</h4>
                                                                    <p className="text-[10px] text-blue-400/60">Liste les fichiers disponibles</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Filtre par usage</label>
                                                                  <select
                                                                    value={listFilesCfg.purpose}
                                                                    onChange={(e) => updateCfg({ ...listFilesCfg, purpose: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="all">Tous</option>
                                                                    <option value="assistants">Assistants</option>
                                                                    <option value="fine-tune">Fine-tuning</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_upload_file":
                                                          const uploadFileCfg = cfg({
                                                            purpose: "assistants",
                                                            fileUrl: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                                    <Upload className="h-5 w-5 text-green-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Téléverser Fichier</h4>
                                                                    <p className="text-[10px] text-green-400/60">Téléverse un fichier vers OpenAI</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">URL du fichier</label>
                                                                  <Input
                                                                    value={uploadFileCfg.fileUrl}
                                                                    onChange={(e) => updateCfg({ ...uploadFileCfg, fileUrl: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="https://..."
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Usage</label>
                                                                  <select
                                                                    value={uploadFileCfg.purpose}
                                                                    onChange={(e) => updateCfg({ ...uploadFileCfg, purpose: e.target.value })}
                                                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                                                                  >
                                                                    <option value="assistants">Assistants</option>
                                                                    <option value="fine-tune">Fine-tuning</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_create_conversation":
                                                          const createConvCfg = cfg({
                                                            name: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                                                    <BotMessageSquare className="h-5 w-5 text-purple-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Créer Conversation</h4>
                                                                    <p className="text-[10px] text-purple-400/60">Crée une nouvelle conversation</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Nom de la conversation</label>
                                                                  <Input
                                                                    value={createConvCfg.name}
                                                                    onChange={(e) => updateCfg({ ...createConvCfg, name: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="Conversation..."
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_get_conversation":
                                                          const getConvCfg = cfg({
                                                            conversationId: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                                                    <BotMessageSquare className="h-5 w-5 text-cyan-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Obtenir Conversation</h4>
                                                                    <p className="text-[10px] text-cyan-400/60">Récupère une conversation existante</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">ID de la conversation</label>
                                                                  <Input
                                                                    value={getConvCfg.conversationId}
                                                                    onChange={(e) => updateCfg({ ...getConvCfg, conversationId: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="conv_xxx"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_remove_conversation":
                                                          const removeConvCfg = cfg({
                                                            conversationId: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                                                    <BotMessageSquare className="h-5 w-5 text-red-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Supprimer Conversation</h4>
                                                                    <p className="text-[10px] text-red-400/60">Supprime une conversation</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">ID de la conversation</label>
                                                                  <Input
                                                                    value={removeConvCfg.conversationId}
                                                                    onChange={(e) => updateCfg({ ...removeConvCfg, conversationId: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="conv_xxx"
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "ai_update_conversation":
                                                          const updateConvCfg = cfg({
                                                            conversationId: "",
                                                            name: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                                                    <BotMessageSquare className="h-5 w-5 text-orange-400" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="text-sm font-bold text-white">Mettre à jour Conversation</h4>
                                                                    <p className="text-[10px] text-orange-400/60">Met à jour une conversation</p>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">ID de la conversation</label>
                                                                  <Input
                                                                    value={updateConvCfg.conversationId}
                                                                    onChange={(e) => updateCfg({ ...updateConvCfg, conversationId: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="conv_xxx"
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Nouveau nom</label>
                                                                  <Input
                                                                    value={updateConvCfg.name}
                                                                    onChange={(e) => updateCfg({ ...updateConvCfg, name: e.target.value })}
                                                                    className="mt-1 bg-black/40 border-white/10 h-10"
                                                                    placeholder="Nouveau nom..."
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "keyword":
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="flex items-center justify-between px-1">
                                                                <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                                                                  Déclencheurs (un
                                                                  par ligne)
                                                                </label>
                                                                <Badge
                                                                  variant="outline"
                                                                  className="text-[7px] border-primary/30 text-primary uppercase font-black"
                                                                >
                                                                  Insensible à la
                                                                  casse
                                                                </Badge>
                                                              </div>
                                                              <textarea
                                                                value={
                                                                  currentCfg.keywords ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  updateCfg({
                                                                    ...currentCfg,
                                                                    keywords:
                                                                      e.target
                                                                        .value,
                                                                  })
                                                                }
                                                                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/90 font-mono focus:border-primary/50 transition-all shadow-inner scrollbar-hide"
                                                                placeholder="devis&#10;prix&#10;commander&#10;acheter"
                                                              />
                                                              <div className="p-3 rounded-xl bg-primary/5 border border-white/5">
                                                                <p className="text-[8px] text-muted-foreground italic px-1 font-medium">
                                                                  L'automatisation
                                                                  se lancera si le
                                                                  message contient
                                                                  l'un de ces mots.
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "delay":
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Attendre</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Pause avant l'action suivante</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Durée (secondes)">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(currentCfg.delaySeconds || 1)}
                                                                    onChange={(e) => updateCfg({ ...currentCfg, delaySeconds: parseInt(e.target.value) || 0 })}
                                                                    placeholder="1"
                                                                  />
                                                                </FormField>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "send_text":
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Envoyer texte</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Envoie un message texte personnalisé</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Contenu du message</label>
                                                                    <div className="flex items-center gap-1">
                                                                      <OutputSelector
                                                                        currentNodeId={node.id}
                                                                        onInsert={(value) => {
                                                                          const currentText = currentCfg.text || "";
                                                                          const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentText.length;
                                                                          const newText = currentText.slice(0, cursorPos) + value + currentText.slice(cursorPos);
                                                                          updateCfg({
                                                                            ...currentCfg,
                                                                            text: newText,
                                                                          });
                                                                        }}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <textarea
                                                                    value={currentCfg.text || ""}
                                                                    onChange={(e) => updateCfg({ ...currentCfg, text: e.target.value })}
                                                                    className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none"
                                                                    placeholder="Écrivez votre message ici... Utilisez Variables pour insérer des données."
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "send_image":
                                                          const img = cfg({
                                                            url: "",
                                                            caption: "",
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Envoyer image</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Envoie une image ou photo</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="URL de l'image">
                                                                  <div className="flex gap-2 flex-1">
                                                                    <StyledInput
                                                                      value={img.url}
                                                                      onChange={(e) => updateCfg({ ...img, url: e.target.value })}
                                                                      placeholder="https://..."
                                                                    />
                                                                    <Button
                                                                      size="icon"
                                                                      variant="outline"
                                                                      className="h-9 w-9 border-white/10 bg-white/5 shrink-0"
                                                                    >
                                                                      <Upload className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                  </div>
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Légende</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentCaption = img.caption || "";
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentCaption.length;
                                                                        const newCaption = currentCaption.slice(0, cursorPos) + value + currentCaption.slice(cursorPos);
                                                                        updateCfg({ ...img, caption: newCaption });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={img.caption}
                                                                    onChange={(e) => updateCfg({ ...img, caption: e.target.value })}
                                                                    className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none"
                                                                    placeholder="Description de la photo..."
                                                                  />
                                                                </div>

                                                                {img.url && (
                                                                  <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/40 flex items-center justify-center">
                                                                    <img src={img.url} alt="Preview" className="max-h-full object-contain" />
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </div>
                                                          );

                                                        case "condition":
                                                          const cond = cfg({
                                                            field: "intent",
                                                            operator: "equals",
                                                            value: "",
                                                            templateType: "custom"
                                                          });

                                                          // Templates de conditions prédéfinies
                                                          const conditionTemplates = [
                                                            { id: "my_intent", label: "🎯 Mon intention", field: "intent", operator: "equals", value: "", color: "#8b5cf6" },
                                                            { id: "negative_sentiment", label: "😤 Client mécontent", field: "sentiment_score", operator: "less_than", value: "-0.3", color: "#ef4444" },
                                                            { id: "positive_sentiment", label: "😊 Client satisfait", field: "sentiment_score", operator: "greater_than", value: "0.3", color: "#10b981" },
                                                            { id: "urgent", label: "🔥 Urgent (4-5)", field: "urgency", operator: "greater_than", value: "3", color: "#f59e0b" },
                                                            { id: "plainte", label: "📢 Plainte détectée", field: "intent", operator: "equals", value: "plainte", color: "#ef4444" },
                                                            { id: "achat", label: "🛒 Intention d'achat", field: "intent", operator: "equals", value: "commande", color: "#10b981" },
                                                            { id: "custom", label: "⚙️ Autre condition", field: "", operator: "", value: "", color: "#6b7280" },
                                                          ];


                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Condition Si/Sinon</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Route le flux selon une condition</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                {/* Templates rapides */}
                                                                <div className="space-y-2">
                                                                  <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                    <Sparkles className="h-4 w-4 text-amber-400" />
                                                                    Conditions rapides
                                                                  </label>
                                                                  <div className="grid grid-cols-2 gap-2">
                                                                    {conditionTemplates.map((tpl) => (
                                                                      <button
                                                                        key={tpl.id}
                                                                        onClick={() => {
                                                                          if (tpl.id === "custom") {
                                                                            updateCfg({ ...cond, templateType: "custom" });
                                                                          } else {
                                                                            updateCfg({
                                                                              ...cond,
                                                                              field: tpl.field,
                                                                              operator: tpl.operator,
                                                                              value: tpl.value,
                                                                              templateType: tpl.id
                                                                            });
                                                                          }
                                                                        }}
                                                                        className={`p-2.5 rounded-xl text-left transition-all text-xs font-medium ${cond.templateType === tpl.id
                                                                          ? "ring-2 ring-offset-1 ring-offset-black"
                                                                          : "hover:scale-[1.02]"
                                                                          }`}
                                                                        style={{
                                                                          backgroundColor: cond.templateType === tpl.id ? `${tpl.color}20` : "rgba(255,255,255,0.03)",
                                                                          borderWidth: "1px",
                                                                          borderStyle: "solid",
                                                                          borderColor: cond.templateType === tpl.id ? `${tpl.color}50` : "rgba(255,255,255,0.1)",
                                                                          color: cond.templateType === tpl.id ? tpl.color : "rgba(255,255,255,0.7)",
                                                                        }}
                                                                      >
                                                                        {tpl.label}
                                                                      </button>

                                                                    ))}
                                                                  </div>
                                                                </div>

                                                                {/* Configuration personnalisée */}
                                                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                                                                  <div className="flex items-center gap-2 text-xs text-white/60">
                                                                    <Settings className="h-3.5 w-3.5" />
                                                                    <span>Configuration de la condition</span>
                                                                  </div>

                                                                  <FormField label="Variable à tester">
                                                                    <StyledSelect
                                                                      value={cond.field}
                                                                      onChange={(e) => updateCfg({ ...cond, field: e.target.value, templateType: "custom" })}
                                                                      options={[
                                                                        { value: "intent", label: "🎯 Intention détectée" },
                                                                        { value: "sentiment", label: "😊 Sentiment (texte)" },
                                                                        { value: "sentiment_score", label: "📊 Score sentiment (-1 à 1)" },
                                                                        { value: "urgency", label: "🔥 Urgence (1-5)" },
                                                                        { value: "auto_resolvable", label: "✅ Auto-résolvable" },
                                                                        { value: "message", label: "💬 Message reçu" },
                                                                        { value: "name", label: "👤 Nom du contact" },
                                                                      ]}
                                                                    />
                                                                  </FormField>

                                                                  <FormField label="Opérateur">
                                                                    <StyledSelect
                                                                      value={cond.operator}
                                                                      onChange={(e) => updateCfg({ ...cond, operator: e.target.value, templateType: "custom" })}
                                                                      options={[
                                                                        { value: "equals", label: "= Est égal à" },
                                                                        { value: "not_equals", label: "≠ N'est pas égal à" },
                                                                        { value: "contains", label: "∈ Contient" },
                                                                        { value: "less_than", label: "< Est inférieur à" },
                                                                        { value: "greater_than", label: "> Est supérieur à" },
                                                                        { value: "is_true", label: "✓ Est vrai" },
                                                                        { value: "is_false", label: "✗ Est faux" },
                                                                      ]}
                                                                    />
                                                                  </FormField>

                                                                  {!["is_true", "is_false"].includes(cond.operator) && (
                                                                    <FormField label="Valeur">
                                                                      {cond.field === "intent" ? (
                                                                        <div className="space-y-2">
                                                                          <StyledInput
                                                                            value={cond.value}
                                                                            onChange={(e) => updateCfg({ ...cond, value: e.target.value, templateType: "custom" })}
                                                                            placeholder="Tapez votre intention (ex: devis, reservation...)"
                                                                          />
                                                                          <div className="flex flex-wrap gap-1.5">
                                                                            <span className="text-[9px] text-white/40 mr-1">Suggestions :</span>
                                                                            {[
                                                                              { name: "salutation", emoji: "👋" },
                                                                              { name: "plainte", emoji: "😤" },
                                                                              { name: "commande", emoji: "🛒" },
                                                                              { name: "demande_aide", emoji: "🆘" },
                                                                              { name: "annulation", emoji: "❌" },
                                                                            ].map((s) => (
                                                                              <button
                                                                                key={s.name}
                                                                                onClick={() => updateCfg({ ...cond, value: s.name, templateType: "custom" })}
                                                                                className={`px-2 py-0.5 rounded text-[9px] transition-all ${cond.value === s.name ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-white/50 hover:text-white/80'}`}
                                                                              >
                                                                                {s.emoji} {s.name}
                                                                              </button>
                                                                            ))}
                                                                          </div>
                                                                        </div>

                                                                      ) : cond.field === "sentiment" ? (
                                                                        <StyledSelect
                                                                          value={cond.value}
                                                                          onChange={(e) => updateCfg({ ...cond, value: e.target.value, templateType: "custom" })}
                                                                          options={[
                                                                            { value: "très_positif", label: "😄 Très positif" },
                                                                            { value: "positif", label: "🙂 Positif" },
                                                                            { value: "neutre", label: "😐 Neutre" },
                                                                            { value: "négatif", label: "😕 Négatif" },
                                                                            { value: "très_négatif", label: "😠 Très négatif" },
                                                                          ]}
                                                                        />
                                                                      ) : (
                                                                        <StyledInput
                                                                          value={cond.value}
                                                                          onChange={(e) => updateCfg({ ...cond, value: e.target.value, templateType: "custom" })}
                                                                          placeholder={
                                                                            cond.field === "sentiment_score" ? "Ex: -0.3" :
                                                                              cond.field === "urgency" ? "Ex: 3" :
                                                                                "Valeur..."
                                                                          }
                                                                        />
                                                                      )}
                                                                    </FormField>
                                                                  )}
                                                                </div>

                                                                {/* Aperçu de la condition */}
                                                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-orange-500/10 border border-white/10">
                                                                  <GitBranch className="h-4 w-4 text-orange-400" />
                                                                  <div className="flex-1">
                                                                    <p className="text-[10px] text-white/80 font-medium">
                                                                      Si <code className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 mx-1">{`{{${cond.field}}}`}</code>
                                                                      <span className="text-amber-400 mx-1">
                                                                        {cond.operator === "equals" ? "=" :
                                                                          cond.operator === "not_equals" ? "≠" :
                                                                            cond.operator === "contains" ? "contient" :
                                                                              cond.operator === "less_than" ? "<" :
                                                                                cond.operator === "greater_than" ? ">" :
                                                                                  cond.operator === "is_true" ? "est vrai" : "est faux"}
                                                                      </span>
                                                                      {!["is_true", "is_false"].includes(cond.operator) && (
                                                                        <code className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{cond.value || "..."}</code>
                                                                      )}
                                                                    </p>
                                                                  </div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2 text-center">
                                                                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                                                    <Check className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                                                                    <p className="text-[10px] font-bold text-emerald-400">VRAI</p>
                                                                  </div>
                                                                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                                                                    <X className="h-4 w-4 text-red-400 mx-auto mb-1" />
                                                                    <p className="text-[10px] font-bold text-red-400">FAUX</p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "switch_router":
                                                          const switchCfg = cfg({
                                                            field: "intent",
                                                            cases: [] as { id: number; value: string; label: string; color: string }[],
                                                            hasDefault: true
                                                          });

                                                          const caseColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444", "#06b6d4", "#84cc16"];

                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Aiguillage Multi-Chemins</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Route vers différents chemins selon la valeur</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                {/* Variable à tester */}
                                                                <FormField label="Variable à tester">
                                                                  <StyledSelect
                                                                    value={switchCfg.field}
                                                                    onChange={(e) => updateCfg({ ...switchCfg, field: e.target.value })}
                                                                    options={[
                                                                      { value: "intent", label: "🎯 Intention détectée" },
                                                                      { value: "sentiment", label: "😊 Sentiment" },
                                                                      { value: "urgency", label: "🔥 Urgence (1-5)" },
                                                                      { value: "message", label: "💬 Message reçu" },
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                {/* Liste des cas */}
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium flex items-center gap-2">
                                                                      <ListChecks className="h-4 w-4 text-purple-400" />
                                                                      Chemins de routage
                                                                    </label>
                                                                    <button
                                                                      onClick={() => {
                                                                        const newCase = {
                                                                          id: Date.now(),
                                                                          value: "",
                                                                          label: `Cas ${(switchCfg.cases || []).length + 1}`,
                                                                          color: caseColors[(switchCfg.cases || []).length % caseColors.length]
                                                                        };
                                                                        updateCfg({ ...switchCfg, cases: [...(switchCfg.cases || []), newCase] });
                                                                      }}
                                                                      className="h-7 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                                                                    >
                                                                      <Plus className="h-3 w-3" />
                                                                      Ajouter
                                                                    </button>
                                                                  </div>

                                                                  <div className="space-y-2">
                                                                    {(switchCfg.cases || []).length === 0 ? (
                                                                      <div className="p-4 rounded-xl border border-dashed border-purple-500/30 bg-purple-500/5 text-center">
                                                                        <Filter className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                                                                        <p className="text-xs text-purple-400">Ajoutez des cas pour créer des chemins</p>
                                                                        <p className="text-[10px] text-purple-400/60 mt-1">Ex: Si intent = "devis" → Chemin 1</p>
                                                                      </div>
                                                                    ) : (
                                                                      (switchCfg.cases || []).map((c: any, idx: number) => (
                                                                        <div
                                                                          key={c.id}
                                                                          className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2"
                                                                          style={{ borderLeftWidth: "3px", borderLeftColor: c.color }}
                                                                        >
                                                                          <div className="flex items-center gap-2">
                                                                            <div
                                                                              className="h-6 w-6 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                                                                              style={{ backgroundColor: `${c.color}30`, color: c.color }}
                                                                            >
                                                                              {idx + 1}
                                                                            </div>
                                                                            <input
                                                                              type="text"
                                                                              value={c.value}
                                                                              onChange={(e) => {
                                                                                const newCases = [...(switchCfg.cases || [])];
                                                                                newCases[idx] = { ...c, value: e.target.value };
                                                                                updateCfg({ ...switchCfg, cases: newCases });
                                                                              }}
                                                                              placeholder={switchCfg.field === "intent" ? "devis, reservation, commande..." : "valeur..."}
                                                                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
                                                                            />
                                                                            <button
                                                                              onClick={() => {
                                                                                const newCases = (switchCfg.cases || []).filter((_: any, i: number) => i !== idx);
                                                                                updateCfg({ ...switchCfg, cases: newCases });
                                                                              }}
                                                                              className="h-6 w-6 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 flex items-center justify-center transition-colors"
                                                                            >
                                                                              <X className="h-3 w-3" />
                                                                            </button>
                                                                          </div>
                                                                          <div className="flex items-center gap-2 pl-8">
                                                                            <ArrowRight className="h-3 w-3 text-white/30" />
                                                                            <span className="text-[10px] text-white/50">Chemin vers le bloc suivant</span>
                                                                          </div>
                                                                        </div>
                                                                      ))
                                                                    )}
                                                                  </div>
                                                                </div>

                                                                {/* Suggestions rapides pour intent */}
                                                                {switchCfg.field === "intent" && (
                                                                  <div className="space-y-2">
                                                                    <p className="text-[10px] text-white/40">Ajouter rapidement :</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                      {[
                                                                        { value: "salutation", emoji: "👋" },
                                                                        { value: "plainte", emoji: "😤" },
                                                                        { value: "commande", emoji: "🛒" },
                                                                        { value: "devis", emoji: "📝" },
                                                                        { value: "reservation", emoji: "📅" },
                                                                        { value: "annulation", emoji: "❌" },
                                                                      ].filter(s => !(switchCfg.cases || []).some((c: any) => c.value === s.value)).map((s) => (
                                                                        <button
                                                                          key={s.value}
                                                                          onClick={() => {
                                                                            const newCase = {
                                                                              id: Date.now(),
                                                                              value: s.value,
                                                                              label: s.value,
                                                                              color: caseColors[(switchCfg.cases || []).length % caseColors.length]
                                                                            };
                                                                            updateCfg({ ...switchCfg, cases: [...(switchCfg.cases || []), newCase] });
                                                                          }}
                                                                          className="px-2 py-1 rounded text-[9px] bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                                                        >
                                                                          {s.emoji} {s.value}
                                                                        </button>
                                                                      ))}
                                                                    </div>
                                                                  </div>
                                                                )}

                                                                {/* Chemin par défaut */}
                                                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-500/10 border border-gray-500/20">
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-lg bg-gray-500/20 flex items-center justify-center">
                                                                      <span className="text-[10px] text-gray-400">∞</span>
                                                                    </div>
                                                                    <div>
                                                                      <p className="text-xs font-medium text-gray-300">Chemin par défaut</p>
                                                                      <p className="text-[9px] text-gray-400">Si aucun cas ne correspond</p>
                                                                    </div>
                                                                  </div>
                                                                  <button
                                                                    onClick={() => updateCfg({ ...switchCfg, hasDefault: !switchCfg.hasDefault })}
                                                                    className={`relative w-10 h-5 rounded-full transition-colors ${switchCfg.hasDefault ? 'bg-gray-500' : 'bg-white/20'}`}
                                                                  >
                                                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${switchCfg.hasDefault ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                                  </button>
                                                                </div>

                                                                {/* Aperçu */}
                                                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                                                  <p className="text-[10px] text-white/60 mb-2">Aperçu du routage :</p>
                                                                  <div className="space-y-1">
                                                                    {(switchCfg.cases || []).map((c: any, idx: number) => (
                                                                      <div key={c.id} className="flex items-center gap-2 text-[10px]">
                                                                        <code className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{`{{${switchCfg.field}}}`}</code>
                                                                        <span className="text-amber-400">=</span>
                                                                        <code className="px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: `${c.color}30`, color: c.color }}>{c.value || "..."}</code>
                                                                        <ArrowRight className="h-3 w-3 text-white/30" />
                                                                        <span className="text-white/60">Chemin {idx + 1}</span>
                                                                      </div>
                                                                    ))}
                                                                    {switchCfg.hasDefault && (
                                                                      <div className="flex items-center gap-2 text-[10px]">
                                                                        <span className="text-gray-400">Sinon</span>
                                                                        <ArrowRight className="h-3 w-3 text-white/30" />
                                                                        <span className="text-gray-400">Chemin par défaut</span>
                                                                      </div>
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "show_catalog":

                                                          const cat = cfg({
                                                            category: "all",
                                                            layout: "grid",
                                                            selectedProducts: [],
                                                          });

                                                          const toggleProduct = (
                                                            pid: number,
                                                          ) => {
                                                            const current =
                                                              cat.selectedProducts ||
                                                              [];
                                                            const next =
                                                              current.includes(pid)
                                                                ? current.filter(
                                                                  (id: number) =>
                                                                    id !== pid,
                                                                )
                                                                : [...current, pid];
                                                            updateCfg({
                                                              ...cat,
                                                              selectedProducts:
                                                                next,
                                                            });
                                                          };

                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Envoyer Catalogue</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Affiche la liste de vos produits</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Sélection des produits</label>
                                                                    <span className="text-xs text-primary font-mono">
                                                                      {(cat.selectedProducts || []).length} sélectionnés
                                                                    </span>
                                                                  </div>

                                                                  <div className="max-h-60 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                                                                    {products.map(
                                                                      (p) => (
                                                                        <div
                                                                          key={p.id}
                                                                          onClick={() =>
                                                                            toggleProduct(
                                                                              p.id,
                                                                            )
                                                                          }
                                                                          className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${(
                                                                            cat.selectedProducts ||
                                                                            []
                                                                          ).includes(
                                                                            p.id,
                                                                          )
                                                                            ? "bg-primary/10 border-primary/30"
                                                                            : "bg-white/5 border-white/5 hover:border-white/10"
                                                                            }`}
                                                                        >
                                                                          <div className="flex items-center gap-3">
                                                                            {p.image?.startsWith(
                                                                              "data:",
                                                                            ) ? (
                                                                              <img
                                                                                src={
                                                                                  p.image
                                                                                }
                                                                                className="w-8 h-8 rounded-md object-cover"
                                                                                alt={
                                                                                  p.name
                                                                                }
                                                                              />
                                                                            ) : (
                                                                              <span className="text-sm">
                                                                                {
                                                                                  p.image
                                                                                }
                                                                              </span>
                                                                            )}
                                                                            <div className="flex flex-col">
                                                                              <span className="text-[11px] font-bold text-white/90">
                                                                                {
                                                                                  p.name
                                                                                }
                                                                              </span>
                                                                              <span className="text-[9px] text-muted-foreground">
                                                                                {p.price.toLocaleString()}{" "}
                                                                                {
                                                                                  currency
                                                                                }
                                                                              </span>
                                                                            </div>
                                                                          </div>
                                                                          <div
                                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${(
                                                                              cat.selectedProducts ||
                                                                              []
                                                                            ).includes(
                                                                              p.id,
                                                                            )
                                                                              ? "bg-primary border-primary"
                                                                              : "border-white/20"
                                                                              }`}
                                                                          >
                                                                            {(
                                                                              cat.selectedProducts ||
                                                                              []
                                                                            ).includes(
                                                                              p.id,
                                                                            ) && (
                                                                                <Check className="h-2.5 w-2.5 text-black font-bold" />
                                                                              )}
                                                                          </div>
                                                                        </div>
                                                                      ),
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "chariow":
                                                          const chariow = cfg({
                                                            action: "view",
                                                            currency: "XOF",
                                                            aiInstructions: "",
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div
                                                                className="
                    relative w-full
                    rounded-2xl
                    bg-[#1a1a1a] border-orange-500/30 border-2
                    flex items-center justify-between p-4
                    ring-2 ring-primary/20 ring-offset-2 ring-offset-background
                    hover:shadow-lg transition-all duration-200
                "
                                                              >
                                                                <div className="text-orange-400">
                                                                  <div className="relative flex items-center justify-center h-10 w-10">
                                                                    <img
                                                                      alt="Chariow"
                                                                      className="w-full h-full object-contain"
                                                                      src="/chariow-logo.png"
                                                                    />
                                                                  </div>
                                                                </div>

                                                                <div className="flex-1 px-4">
                                                                  <label className="text-[11px] font-black uppercase text-white/90 tracking-widest block">
                                                                    Chariow
                                                                  </label>
                                                                  <span className="text-[9px] text-orange-400/80 font-medium">
                                                                    Checkout &
                                                                    Panier
                                                                  </span>
                                                                </div>

                                                                <div className="absolute top-2 right-2 opacity-30">
                                                                  <GripVertical className="h-3 w-3" />
                                                                </div>
                                                              </div>

                                                              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-3">
                                                                <div className="space-y-1.5">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                                                                    Lien de la
                                                                    boutique
                                                                  </label>
                                                                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 focus-within:border-orange-500/50 transition-colors">
                                                                    <Link2 className="h-3.5 w-3.5 text-white/40" />
                                                                    <input
                                                                      type="url"
                                                                      value={
                                                                        chariow.storeUrl ||
                                                                        ""
                                                                      }
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        updateCfg({
                                                                          ...chariow,
                                                                          storeUrl:
                                                                            e.target
                                                                              .value,
                                                                        })
                                                                      }
                                                                      className="w-full h-9 bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:ring-0 px-0"
                                                                      placeholder="https://chariow.com/..."
                                                                    />
                                                                  </div>
                                                                  <p className="text-[8px] text-muted-foreground italic px-1">
                                                                    L'IA utilisera
                                                                    ce lien pour
                                                                    accéder à vos
                                                                    produits.
                                                                  </p>
                                                                </div>

                                                                <div className="space-y-1.5">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                                                                    Action
                                                                  </label>
                                                                  <select
                                                                    value={
                                                                      chariow.action
                                                                    }
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...chariow,
                                                                        action:
                                                                          e.target
                                                                            .value,
                                                                      })
                                                                    }
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-9 text-xs px-2 text-white focus:border-orange-500/50 transition-colors"
                                                                  >
                                                                    <option value="view">
                                                                      Envoyer le
                                                                      Catalogue /
                                                                      Panier
                                                                    </option>
                                                                    <option value="checkout">
                                                                      Envoyer le
                                                                      Lien de
                                                                      Paiement
                                                                    </option>
                                                                    <option value="clear">
                                                                      Vider le
                                                                      Panier du
                                                                      client
                                                                    </option>
                                                                  </select>
                                                                </div>
                                                              </div>

                                                              {instructionsUI}
                                                            </div>
                                                          );

                                                        case "add_to_cart":
                                                          const addToCartCfg = cfg({
                                                            productId: "",
                                                            quantity: 1,
                                                            autoDetect: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Ajouter au panier</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Détecte et ajoute un produit au panier</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Détection automatique">
                                                                  <ToggleSwitch
                                                                    checked={addToCartCfg.autoDetect}
                                                                    onChange={() => updateCfg({ ...addToCartCfg, autoDetect: !addToCartCfg.autoDetect })}
                                                                  />
                                                                </FormField>

                                                                {!addToCartCfg.autoDetect && (
                                                                  <>
                                                                    <FormField label="ID du produit">
                                                                      <StyledInput
                                                                        value={addToCartCfg.productId}
                                                                        onChange={(e) => updateCfg({ ...addToCartCfg, productId: e.target.value })}
                                                                        placeholder="1"
                                                                      />
                                                                    </FormField>

                                                                    <FormField label="Quantité">
                                                                      <StyledInput
                                                                        type="number"
                                                                        value={String(addToCartCfg.quantity)}
                                                                        onChange={(e) => updateCfg({ ...addToCartCfg, quantity: parseInt(e.target.value) || 1 })}
                                                                        placeholder="1"
                                                                      />
                                                                    </FormField>
                                                                  </>
                                                                )}

                                                                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    {addToCartCfg.autoDetect
                                                                      ? "Analyse intelligemment le message du client pour identifier le produit souhaité."
                                                                      : "Ajoute le produit spécifié au panier avec la quantité indiquée."}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        case "show_cart":
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                                                      <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                                                                    </div>
                                                                    <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
                                                                      Afficher Panier
                                                                    </label>
                                                                  </div>
                                                                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] uppercase font-black px-2">
                                                                    Panier
                                                                  </Badge>
                                                                </div>
                                                                <p className="text-[10px] text-white/60 leading-relaxed">
                                                                  Affiche le contenu actuel du panier du client avec tous les articles ajoutés, les quantités et le total.
                                                                </p>
                                                              </div>
                                                              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3 shadow-inner">
                                                                <ShoppingBag className="h-4 w-4 text-emerald-400 shrink-0 opacity-40" />
                                                                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium italic">
                                                                  <b>Astuce:</b> Ce bloc affiche automatiquement tous les produits ajoutés au panier via le bloc "Ajouter au panier".
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "order_status":
                                                          const orderStatusCfg = cfg({
                                                            orderId: "",
                                                            autoDetect: true,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                                                      <Truck className="h-3.5 w-3.5 text-blue-400" />
                                                                    </div>
                                                                    <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
                                                                      Suivi Commande
                                                                    </label>
                                                                  </div>
                                                                  <Badge className="bg-blue-500/20 text-blue-400 border-none text-[8px] uppercase font-black px-2">
                                                                    Statut
                                                                  </Badge>
                                                                </div>
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                      Détection automatique
                                                                    </label>
                                                                    <button
                                                                      onClick={() => updateCfg({ ...orderStatusCfg, autoDetect: !orderStatusCfg.autoDetect })}
                                                                      className={`relative w-10 h-6 rounded-full transition-colors ${orderStatusCfg.autoDetect ? "bg-blue-500" : "bg-white/20"}`}
                                                                    >
                                                                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${orderStatusCfg.autoDetect ? "left-5" : "left-1"}`} />
                                                                    </button>
                                                                  </div>
                                                                  {!orderStatusCfg.autoDetect && (
                                                                    <div>
                                                                      <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
                                                                        ID de commande
                                                                      </label>
                                                                      <Input
                                                                        value={orderStatusCfg.orderId}
                                                                        onChange={(e) => updateCfg({ ...orderStatusCfg, orderId: e.target.value })}
                                                                        className="mt-1 bg-black/40 border-white/10 h-10"
                                                                        placeholder="CMD-12345"
                                                                      />
                                                                    </div>
                                                                  )}
                                                                </div>
                                                                <p className="text-[10px] text-white/60 leading-relaxed">
                                                                  {orderStatusCfg.autoDetect
                                                                    ? "Extrait automatiquement le numéro de commande du message pour donner le statut en temps réel (Préparation, Expédition, Livré, etc)."
                                                                    : "Utilise l'ID de commande spécifié pour afficher le statut."}
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "apply_promo":
                                                          const promoCfg = cfg({
                                                            promoCode: "",
                                                            discountType: "percentage",
                                                            discountValue: 10,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Code promo</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Applique une réduction au panier</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Code promo">
                                                                  <StyledInput
                                                                    value={promoCfg.promoCode}
                                                                    onChange={(e) => updateCfg({ ...promoCfg, promoCode: e.target.value })}
                                                                    placeholder="PROMO10"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Type de réduction">
                                                                  <StyledSelect
                                                                    value={promoCfg.discountType}
                                                                    onChange={(e) => updateCfg({ ...promoCfg, discountType: e.target.value })}
                                                                    options={[
                                                                      { value: "percentage", label: "Pourcentage (%)" },
                                                                      { value: "fixed", label: "Montant fixe" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Valeur de la réduction">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(promoCfg.discountValue)}
                                                                    onChange={(e) => updateCfg({ ...promoCfg, discountValue: parseFloat(e.target.value) || 0 })}
                                                                    placeholder={promoCfg.discountType === "percentage" ? "10" : "1000"}
                                                                  />
                                                                </FormField>

                                                                <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    {promoCfg.discountType === "percentage"
                                                                      ? "Pourcentage de réduction (ex: 10 = 10%)"
                                                                      : "Montant fixe en devise (ex: 1000 = 1000 XOF)"}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "check_availability":
                                                          const availabilityCfg = cfg({
                                                            calendarId: "",
                                                            dateRange: 7,
                                                            duration: 30,
                                                            timezone: "Africa/Abidjan",
                                                            showWeekends: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Vérifier disponibilité</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Affiche les créneaux libres</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="ID Calendrier">
                                                                  <StyledInput
                                                                    value={availabilityCfg.calendarId}
                                                                    onChange={(e) => updateCfg({ ...availabilityCfg, calendarId: e.target.value })}
                                                                    placeholder="cal_123456"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Période (jours)">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(availabilityCfg.dateRange)}
                                                                    onChange={(e) => updateCfg({ ...availabilityCfg, dateRange: parseInt(e.target.value) || 7 })}
                                                                    placeholder="7"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Durée (minutes)">
                                                                  <StyledSelect
                                                                    value={String(availabilityCfg.duration)}
                                                                    onChange={(e) => updateCfg({ ...availabilityCfg, duration: parseInt(e.target.value) })}
                                                                    options={[
                                                                      { value: "15", label: "15 minutes" },
                                                                      { value: "30", label: "30 minutes" },
                                                                      { value: "45", label: "45 minutes" },
                                                                      { value: "60", label: "1 heure" },
                                                                      { value: "90", label: "1h30" },
                                                                      { value: "120", label: "2 heures" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Fuseau horaire">
                                                                  <StyledSelect
                                                                    value={availabilityCfg.timezone}
                                                                    onChange={(e) => updateCfg({ ...availabilityCfg, timezone: e.target.value })}
                                                                    options={[
                                                                      { value: "Africa/Abidjan", label: "Abidjan (GMT+0)" },
                                                                      { value: "Africa/Dakar", label: "Dakar (GMT+0)" },
                                                                      { value: "Europe/Paris", label: "Paris (GMT+1)" },
                                                                      { value: "America/New_York", label: "New York (GMT-5)" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Afficher les week-ends">
                                                                  <ToggleSwitch
                                                                    checked={availabilityCfg.showWeekends}
                                                                    onChange={() => updateCfg({ ...availabilityCfg, showWeekends: !availabilityCfg.showWeekends })}
                                                                  />
                                                                </FormField>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "book_appointment":
                                                          const bookCfg = cfg({
                                                            calendarId: "",
                                                            duration: 30,
                                                            title: "Rendez-vous",
                                                            description: "",
                                                            timezone: "Africa/Abidjan",
                                                            requireConfirmation: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Réserver RDV</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Crée un rendez-vous dans l'agenda</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="ID Calendrier">
                                                                  <StyledInput
                                                                    value={bookCfg.calendarId}
                                                                    onChange={(e) => updateCfg({ ...bookCfg, calendarId: e.target.value })}
                                                                    placeholder="cal_123456"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Titre du RDV">
                                                                  <StyledInput
                                                                    value={bookCfg.title}
                                                                    onChange={(e) => updateCfg({ ...bookCfg, title: e.target.value })}
                                                                    placeholder="Rendez-vous"
                                                                  />
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Description</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentDesc = bookCfg.description || "";
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentDesc.length;
                                                                        const newDesc = currentDesc.slice(0, cursorPos) + value + currentDesc.slice(cursorPos);
                                                                        updateCfg({ ...bookCfg, description: newDesc });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={bookCfg.description}
                                                                    onChange={(e) => updateCfg({ ...bookCfg, description: e.target.value })}
                                                                    className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none"
                                                                    placeholder="Description du rendez-vous..."
                                                                  />
                                                                </div>

                                                                <FormField label="Durée (minutes)">
                                                                  <StyledSelect
                                                                    value={String(bookCfg.duration)}
                                                                    onChange={(e) => updateCfg({ ...bookCfg, duration: parseInt(e.target.value) })}
                                                                    options={[
                                                                      { value: "15", label: "15 minutes" },
                                                                      { value: "30", label: "30 minutes" },
                                                                      { value: "45", label: "45 minutes" },
                                                                      { value: "60", label: "1 heure" },
                                                                      { value: "90", label: "1h30" },
                                                                      { value: "120", label: "2 heures" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Fuseau horaire">
                                                                  <StyledSelect
                                                                    value={bookCfg.timezone}
                                                                    onChange={(e) => updateCfg({ ...bookCfg, timezone: e.target.value })}
                                                                    options={[
                                                                      { value: "Africa/Abidjan", label: "Abidjan (GMT+0)" },
                                                                      { value: "Africa/Dakar", label: "Dakar (GMT+0)" },
                                                                      { value: "Europe/Paris", label: "Paris (GMT+1)" },
                                                                      { value: "America/New_York", label: "New York (GMT-5)" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Demander confirmation">
                                                                  <ToggleSwitch
                                                                    checked={bookCfg.requireConfirmation}
                                                                    onChange={() => updateCfg({ ...bookCfg, requireConfirmation: !bookCfg.requireConfirmation })}
                                                                  />
                                                                </FormField>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "cancel_appointment":
                                                          const cancelCfg = cfg({
                                                            appointmentId: "",
                                                            calendarId: "",
                                                            autoDetect: true,
                                                            sendCancellationMessage: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Annuler RDV</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Annule un rendez-vous existant</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Détection automatique">
                                                                  <ToggleSwitch
                                                                    checked={cancelCfg.autoDetect}
                                                                    onChange={() => updateCfg({ ...cancelCfg, autoDetect: !cancelCfg.autoDetect })}
                                                                  />
                                                                </FormField>

                                                                {!cancelCfg.autoDetect && (
                                                                  <>
                                                                    <FormField label="ID Calendrier">
                                                                      <StyledInput
                                                                        value={cancelCfg.calendarId}
                                                                        onChange={(e) => updateCfg({ ...cancelCfg, calendarId: e.target.value })}
                                                                        placeholder="cal_123456"
                                                                      />
                                                                    </FormField>

                                                                    <FormField label="ID du rendez-vous">
                                                                      <StyledInput
                                                                        value={cancelCfg.appointmentId}
                                                                        onChange={(e) => updateCfg({ ...cancelCfg, appointmentId: e.target.value })}
                                                                        placeholder="appt_123456"
                                                                      />
                                                                    </FormField>
                                                                  </>
                                                                )}

                                                                <FormField label="Envoyer message d'annulation">
                                                                  <ToggleSwitch
                                                                    checked={cancelCfg.sendCancellationMessage}
                                                                    onChange={() => updateCfg({ ...cancelCfg, sendCancellationMessage: !cancelCfg.sendCancellationMessage })}
                                                                  />
                                                                </FormField>

                                                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    {cancelCfg.autoDetect
                                                                      ? "Détecte automatiquement le rendez-vous à annuler depuis le message du client."
                                                                      : "Annule le rendez-vous spécifié par son ID."}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "send_reminder":
                                                          const reminderCfg = cfg({
                                                            appointmentId: "",
                                                            calendarId: "",
                                                            reminderTime: 24,
                                                            reminderUnit: "hours",
                                                            message: "Rappel: Vous avez un rendez-vous demain à {time}",
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Rappel RDV</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Envoie un rappel avant le rendez-vous</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="ID Calendrier">
                                                                  <StyledInput
                                                                    value={reminderCfg.calendarId}
                                                                    onChange={(e) => updateCfg({ ...reminderCfg, calendarId: e.target.value })}
                                                                    placeholder="cal_123456"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Temps avant le RDV">
                                                                  <div className="flex gap-2 flex-1">
                                                                    <StyledInput
                                                                      type="number"
                                                                      value={String(reminderCfg.reminderTime)}
                                                                      onChange={(e) => updateCfg({ ...reminderCfg, reminderTime: parseInt(e.target.value) || 24 })}
                                                                      placeholder="24"
                                                                      className="flex-1"
                                                                    />
                                                                    <StyledSelect
                                                                      value={reminderCfg.reminderUnit}
                                                                      onChange={(e) => updateCfg({ ...reminderCfg, reminderUnit: e.target.value })}
                                                                      options={[
                                                                        { value: "minutes", label: "minutes" },
                                                                        { value: "hours", label: "heures" },
                                                                        { value: "days", label: "jours" }
                                                                      ]}
                                                                      maxWidth="120px"
                                                                    />
                                                                  </div>
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Message de rappel</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentMsg = reminderCfg.message || "";
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentMsg.length;
                                                                        const newMsg = currentMsg.slice(0, cursorPos) + value + currentMsg.slice(cursorPos);
                                                                        updateCfg({ ...reminderCfg, message: newMsg });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={reminderCfg.message}
                                                                    onChange={(e) => updateCfg({ ...reminderCfg, message: e.target.value })}
                                                                    className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none"
                                                                    placeholder="Rappel: Vous avez un rendez-vous demain à {time}"
                                                                  />
                                                                </div>

                                                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    Variables disponibles : <code className="text-blue-400">{"{time}"}</code>, <code className="text-blue-400">{"{date}"}</code>, <code className="text-blue-400">{"{title}"}</code>
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "create_group":
                                                          const createGroupCfg = cfg({
                                                            groupName: "",
                                                            description: "",
                                                            participants: [],
                                                            autoAddCreator: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Créer groupe</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Crée un nouveau groupe WhatsApp</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Nom du groupe">
                                                                  <StyledInput
                                                                    value={createGroupCfg.groupName}
                                                                    onChange={(e) => updateCfg({ ...createGroupCfg, groupName: e.target.value })}
                                                                    placeholder="Mon Groupe"
                                                                  />
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Description</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentDesc = createGroupCfg.description || "";
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentDesc.length;
                                                                        const newDesc = currentDesc.slice(0, cursorPos) + value + currentDesc.slice(cursorPos);
                                                                        updateCfg({ ...createGroupCfg, description: newDesc });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={createGroupCfg.description}
                                                                    onChange={(e) => updateCfg({ ...createGroupCfg, description: e.target.value })}
                                                                    className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none"
                                                                    placeholder="Description du groupe..."
                                                                  />
                                                                </div>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Participants</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentParticipants = Array.isArray(createGroupCfg.participants) ? createGroupCfg.participants.join(' ') : '';
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentParticipants.length;
                                                                        const newParticipants = currentParticipants.slice(0, cursorPos) + value + currentParticipants.slice(cursorPos);
                                                                        const numbers = newParticipants.split(/\s+/).filter(n => n.trim());
                                                                        updateCfg({ ...createGroupCfg, participants: numbers });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={Array.isArray(createGroupCfg.participants) ? createGroupCfg.participants.join(' ') : createGroupCfg.participants || ''}
                                                                    onChange={(e) => {
                                                                      const numbers = e.target.value.split(/\s+/).filter(n => n.trim());
                                                                      updateCfg({ ...createGroupCfg, participants: numbers });
                                                                    }}
                                                                    className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                    placeholder="{{contact.phone}} +221771234568 +221771234569"
                                                                  />
                                                                  <div className="flex flex-wrap gap-1.5">
                                                                    <button
                                                                      type="button"
                                                                      onClick={() => {
                                                                        const current = Array.isArray(createGroupCfg.participants) ? createGroupCfg.participants : [];
                                                                        updateCfg({ ...createGroupCfg, participants: [...current, '{{contact.phone}}'] });
                                                                      }}
                                                                      className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                    >
                                                                      + Numéro client
                                                                    </button>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() => {
                                                                        const current = Array.isArray(createGroupCfg.participants) ? createGroupCfg.participants : [];
                                                                        updateCfg({ ...createGroupCfg, participants: [...current, '{{message.from}}'] });
                                                                      }}
                                                                      className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                    >
                                                                      + Expéditeur
                                                                    </button>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() => {
                                                                        const current = Array.isArray(createGroupCfg.participants) ? createGroupCfg.participants : [];
                                                                        updateCfg({ ...createGroupCfg, participants: [...current, '{{previous.output.phone}}'] });
                                                                      }}
                                                                      className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                    >
                                                                      + Sortie précédente
                                                                    </button>
                                                                  </div>
                                                                  <p className="text-[8px] text-muted-foreground/60">
                                                                    Utilisez des variables comme <code className="text-primary">{"{{contact.phone}}"}</code> ou saisissez des numéros séparés par des espaces
                                                                  </p>
                                                                </div>

                                                                <FormField label="Ajouter le créateur automatiquement">
                                                                  <ToggleSwitch
                                                                    checked={createGroupCfg.autoAddCreator}
                                                                    onChange={() => updateCfg({ ...createGroupCfg, autoAddCreator: !createGroupCfg.autoAddCreator })}
                                                                  />
                                                                </FormField>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "add_participant":
                                                          const addPartCfg = cfg({
                                                            groupId: "",
                                                            phoneNumber: "",
                                                            autoDetect: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Ajouter membre</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Ajoute un contact au groupe</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Détection automatique">
                                                                  <ToggleSwitch
                                                                    checked={addPartCfg.autoDetect}
                                                                    onChange={() => updateCfg({ ...addPartCfg, autoDetect: !addPartCfg.autoDetect })}
                                                                  />
                                                                </FormField>

                                                                {!addPartCfg.autoDetect && (
                                                                  <>
                                                                    <FormField label="ID du groupe">
                                                                      <div className="flex gap-2">
                                                                        <StyledInput
                                                                          value={addPartCfg.groupId}
                                                                          onChange={(e) => updateCfg({ ...addPartCfg, groupId: e.target.value })}
                                                                          placeholder="{{previous.output.groupId}}"
                                                                          className="flex-1"
                                                                        />
                                                                        <OutputSelector
                                                                          currentNodeId={node.id}
                                                                          onInsert={(value) => updateCfg({ ...addPartCfg, groupId: addPartCfg.groupId + value })}
                                                                        />
                                                                      </div>
                                                                    </FormField>

                                                                    <FormField label="Numéro de téléphone">
                                                                      <div className="flex gap-2">
                                                                        <StyledInput
                                                                          value={addPartCfg.phoneNumber}
                                                                          onChange={(e) => updateCfg({ ...addPartCfg, phoneNumber: e.target.value })}
                                                                          placeholder="{{contact.phone}}"
                                                                          className="flex-1"
                                                                        />
                                                                        <OutputSelector
                                                                          currentNodeId={node.id}
                                                                          onInsert={(value) => updateCfg({ ...addPartCfg, phoneNumber: addPartCfg.phoneNumber + value })}
                                                                        />
                                                                      </div>
                                                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                                                        <button
                                                                          type="button"
                                                                          onClick={() => updateCfg({ ...addPartCfg, phoneNumber: '{{contact.phone}}' })}
                                                                          className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                        >
                                                                          Utiliser numéro client
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          onClick={() => updateCfg({ ...addPartCfg, phoneNumber: '{{message.from}}' })}
                                                                          className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                        >
                                                                          Utiliser expéditeur
                                                                        </button>
                                                                      </div>
                                                                    </FormField>
                                                                  </>
                                                                )}

                                                                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    {addPartCfg.autoDetect
                                                                      ? "Détecte automatiquement le groupe et le numéro depuis le message du client."
                                                                      : "Ajoute le numéro spécifié au groupe indiqué."}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "remove_participant":
                                                          const removePartCfg = cfg({
                                                            groupId: "",
                                                            phoneNumber: "",
                                                            autoDetect: true,
                                                            checkSubscription: false,
                                                            subscriptionPlatform: "",
                                                            subscriptionApiUrl: "",
                                                            subscriptionApiKey: "",
                                                            removeIfExpired: true,
                                                            removeIfCancelled: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Retirer membre</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Retire un membre du groupe (avec vérification d'abonnement)</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Détection automatique">
                                                                  <ToggleSwitch
                                                                    checked={removePartCfg.autoDetect}
                                                                    onChange={() => updateCfg({ ...removePartCfg, autoDetect: !removePartCfg.autoDetect })}
                                                                  />
                                                                </FormField>
                                                                <p className="text-[8px] text-muted-foreground/60">Détecte automatiquement le groupe et le numéro depuis le message du client</p>

                                                                {!removePartCfg.autoDetect && (
                                                                  <>
                                                                    <FormField label="ID du groupe">
                                                                      <div className="flex gap-2">
                                                                        <StyledInput
                                                                          value={removePartCfg.groupId}
                                                                          onChange={(e) => updateCfg({ ...removePartCfg, groupId: e.target.value })}
                                                                          placeholder="{{previous.output.groupId}}"
                                                                          className="flex-1"
                                                                        />
                                                                        <OutputSelector
                                                                          currentNodeId={node.id}
                                                                          onInsert={(value) => updateCfg({ ...removePartCfg, groupId: removePartCfg.groupId + value })}
                                                                        />
                                                                      </div>
                                                                    </FormField>

                                                                    <FormField label="Numéro de téléphone">
                                                                      <div className="flex gap-2">
                                                                        <StyledInput
                                                                          value={removePartCfg.phoneNumber}
                                                                          onChange={(e) => updateCfg({ ...removePartCfg, phoneNumber: e.target.value })}
                                                                          placeholder="{{contact.phone}}"
                                                                          className="flex-1"
                                                                        />
                                                                        <OutputSelector
                                                                          currentNodeId={node.id}
                                                                          onInsert={(value) => updateCfg({ ...removePartCfg, phoneNumber: removePartCfg.phoneNumber + value })}
                                                                        />
                                                                      </div>
                                                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                                                        <button
                                                                          type="button"
                                                                          onClick={() => updateCfg({ ...removePartCfg, phoneNumber: '{{contact.phone}}' })}
                                                                          className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                        >
                                                                          Utiliser numéro client
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          onClick={() => updateCfg({ ...removePartCfg, phoneNumber: '{{message.from}}' })}
                                                                          className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                        >
                                                                          Utiliser expéditeur
                                                                        </button>
                                                                      </div>
                                                                    </FormField>
                                                                  </>
                                                                )}

                                                                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
                                                                  <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                      <div className="h-6 w-6 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                                                        <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
                                                                      </div>
                                                                      <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
                                                                        Vérification d'abonnement
                                                                      </label>
                                                                    </div>
                                                                    <Badge className="bg-orange-500/20 text-orange-400 border-none text-[8px] uppercase font-black px-2">
                                                                      Optionnel
                                                                    </Badge>
                                                                  </div>

                                                                  <FormField label="Vérifier l'abonnement avant retrait">
                                                                    <ToggleSwitch
                                                                      checked={removePartCfg.checkSubscription}
                                                                      onChange={() => updateCfg({ ...removePartCfg, checkSubscription: !removePartCfg.checkSubscription })}
                                                                    />
                                                                  </FormField>
                                                                  <p className="text-[8px] text-muted-foreground/60">Vérifie le statut d'abonnement avant de retirer le membre</p>

                                                                  {removePartCfg.checkSubscription && (
                                                                    <>
                                                                      <FormField label="Plateforme d'abonnement">
                                                                        <StyledSelect
                                                                          value={removePartCfg.subscriptionPlatform}
                                                                          onChange={(e) => updateCfg({ ...removePartCfg, subscriptionPlatform: e.target.value })}
                                                                          options={[
                                                                            { value: "custom", label: "API personnalisée" },
                                                                            { value: "stripe", label: "Stripe" },
                                                                            { value: "paypal", label: "PayPal" },
                                                                            { value: "moneroo", label: "Moneroo" },
                                                                            { value: "database", label: "Base de données" },
                                                                          ]}
                                                                        />
                                                                      </FormField>

                                                                      {removePartCfg.subscriptionPlatform === "custom" && (
                                                                        <>
                                                                          <FormField label="URL de l'API">
                                                                            <div className="flex gap-2">
                                                                              <StyledInput
                                                                                value={removePartCfg.subscriptionApiUrl}
                                                                                onChange={(e) => updateCfg({ ...removePartCfg, subscriptionApiUrl: e.target.value })}
                                                                                placeholder="https://api.example.com/subscription/{{contact.phone}}"
                                                                                className="flex-1"
                                                                              />
                                                                              <OutputSelector
                                                                                currentNodeId={node.id}
                                                                                onInsert={(value) => updateCfg({ ...removePartCfg, subscriptionApiUrl: removePartCfg.subscriptionApiUrl + value })}
                                                                              />
                                                                            </div>
                                                                          </FormField>

                                                                          <FormField label="Clé API (optionnel)">
                                                                            <StyledInput
                                                                              type="password"
                                                                              value={removePartCfg.subscriptionApiKey}
                                                                              onChange={(e) => updateCfg({ ...removePartCfg, subscriptionApiKey: e.target.value })}
                                                                              placeholder="sk_live_..."
                                                                            />
                                                                          </FormField>
                                                                        </>
                                                                      )}

                                                                      <div className="space-y-2">
                                                                        <FormField label="Retirer si abonnement expiré">
                                                                          <ToggleSwitch
                                                                            checked={removePartCfg.removeIfExpired}
                                                                            onChange={() => updateCfg({ ...removePartCfg, removeIfExpired: !removePartCfg.removeIfExpired })}
                                                                          />
                                                                        </FormField>
                                                                        <p className="text-[8px] text-muted-foreground/60">Retire automatiquement si l'abonnement n'est pas renouvelé</p>

                                                                        <FormField label="Retirer si abonnement annulé">
                                                                          <ToggleSwitch
                                                                            checked={removePartCfg.removeIfCancelled}
                                                                            onChange={() => updateCfg({ ...removePartCfg, removeIfCancelled: !removePartCfg.removeIfCancelled })}
                                                                          />
                                                                        </FormField>
                                                                        <p className="text-[8px] text-muted-foreground/60">Retire si l'utilisateur a annulé son abonnement</p>
                                                                      </div>

                                                                      <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                                                        <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                          <b>Fonctionnement:</b> Le système vérifie automatiquement le statut d'abonnement du contact. Si l'abonnement est expiré ou annulé, le membre sera retiré du groupe.
                                                                        </p>
                                                                      </div>
                                                                    </>
                                                                  )}
                                                                </div>

                                                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    {removePartCfg.autoDetect
                                                                      ? "Détecte automatiquement le groupe et le numéro depuis le message du client."
                                                                      : removePartCfg.checkSubscription
                                                                        ? "Vérifie l'abonnement et retire le membre si nécessaire."
                                                                        : "Retire le numéro spécifié du groupe indiqué."}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "group_announcement":
                                                          const announcementCfg = cfg({
                                                            groupId: "",
                                                            enabled: true,
                                                            autoDetect: true,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Mode annonce</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Seuls les admins peuvent écrire</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Activer le mode annonce">
                                                                  <ToggleSwitch
                                                                    checked={announcementCfg.enabled}
                                                                    onChange={() => updateCfg({ ...announcementCfg, enabled: !announcementCfg.enabled })}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Détection automatique du groupe">
                                                                  <ToggleSwitch
                                                                    checked={announcementCfg.autoDetect}
                                                                    onChange={() => updateCfg({ ...announcementCfg, autoDetect: !announcementCfg.autoDetect })}
                                                                  />
                                                                </FormField>

                                                                {!announcementCfg.autoDetect && (
                                                                  <FormField label="ID du groupe">
                                                                    <div className="flex gap-2">
                                                                      <StyledInput
                                                                        value={announcementCfg.groupId}
                                                                        onChange={(e) => updateCfg({ ...announcementCfg, groupId: e.target.value })}
                                                                        placeholder="{{previous.output.groupId}}"
                                                                        className="flex-1"
                                                                      />
                                                                      <OutputSelector
                                                                        currentNodeId={node.id}
                                                                        onInsert={(value) => updateCfg({ ...announcementCfg, groupId: announcementCfg.groupId + value })}
                                                                      />
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                                      <button
                                                                        type="button"
                                                                        onClick={() => updateCfg({ ...announcementCfg, groupId: '{{previous.output.groupId}}' })}
                                                                        className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                      >
                                                                        Utiliser groupe précédent
                                                                      </button>
                                                                    </div>
                                                                  </FormField>
                                                                )}

                                                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    {announcementCfg.enabled
                                                                      ? "En mode annonce, seuls les administrateurs peuvent envoyer des messages dans le groupe."
                                                                      : "Le mode annonce sera désactivé, tous les membres pourront écrire."}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "bulk_add_members":
                                                          const bam = cfg({
                                                            source: "csv",
                                                            delay: 30,
                                                            groupId: "",
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Ajout massif</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Ajoute plusieurs membres d'un coup</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Source des données">
                                                                  <StyledSelect
                                                                    value={bam.source}
                                                                    onChange={(e) => updateCfg({ ...bam, source: e.target.value })}
                                                                    options={[
                                                                      { value: "csv", label: "Fichier CSV" },
                                                                      { value: "manual", label: "Liste manuelle" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                {bam.source === "csv" ? (
                                                                  <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                      <label className="text-sm text-white/80 font-medium">URL du fichier CSV</label>
                                                                      <OutputSelector
                                                                        currentNodeId={node.id}
                                                                        onInsert={(value) => updateCfg({ ...bam, csvUrl: (bam.csvUrl || '') + value })}
                                                                      />
                                                                    </div>
                                                                    <StyledInput
                                                                      value={bam.csvUrl || ""}
                                                                      onChange={(e) => updateCfg({ ...bam, csvUrl: e.target.value })}
                                                                      placeholder="{{previous.output.csvUrl}} ou https://example.com/members.csv"
                                                                    />
                                                                    <p className="text-[8px] text-muted-foreground/60">
                                                                      Le CSV doit contenir une colonne "phone" ou "number" avec les numéros
                                                                    </p>
                                                                  </div>
                                                                ) : (
                                                                  <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                      <label className="text-sm text-white/80 font-medium">Numéros</label>
                                                                      <OutputSelector
                                                                        currentNodeId={node.id}
                                                                        onInsert={(value) => {
                                                                          const current = Array.isArray(bam.phoneNumbers) ? bam.phoneNumbers.join(' ') : '';
                                                                          const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || current.length;
                                                                          const newNumbers = current.slice(0, cursorPos) + value + current.slice(cursorPos);
                                                                          const numbers = newNumbers.split(/\s+/).filter(n => n.trim());
                                                                          updateCfg({ ...bam, phoneNumbers: numbers });
                                                                        }}
                                                                      />
                                                                    </div>
                                                                    <textarea
                                                                      value={Array.isArray(bam.phoneNumbers) ? bam.phoneNumbers.join(' ') : ''}
                                                                      onChange={(e) => {
                                                                        const numbers = e.target.value.split(/\s+/).filter(n => n.trim());
                                                                        updateCfg({ ...bam, phoneNumbers: numbers });
                                                                      }}
                                                                      className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                      placeholder="{{contact.phone}} {{previous.output.phone}} +221771234569"
                                                                    />
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                      <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                          const current = Array.isArray(bam.phoneNumbers) ? bam.phoneNumbers : [];
                                                                          updateCfg({ ...bam, phoneNumbers: [...current, '{{contact.phone}}'] });
                                                                        }}
                                                                        className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                      >
                                                                        + Numéro client
                                                                      </button>
                                                                      <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                          const current = Array.isArray(bam.phoneNumbers) ? bam.phoneNumbers : [];
                                                                          updateCfg({ ...bam, phoneNumbers: [...current, '{{previous.output.phones}}'] });
                                                                        }}
                                                                        className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                      >
                                                                        + Liste précédente
                                                                      </button>
                                                                    </div>
                                                                    <p className="text-[8px] text-muted-foreground/60">
                                                                      Utilisez des variables ou séparez les numéros par des espaces
                                                                    </p>
                                                                  </div>
                                                                )}

                                                                <FormField label="ID du groupe">
                                                                  <div className="flex gap-2">
                                                                    <StyledInput
                                                                      value={bam.groupId}
                                                                      onChange={(e) => updateCfg({ ...bam, groupId: e.target.value })}
                                                                      placeholder="{{previous.output.groupId}}"
                                                                      className="flex-1"
                                                                    />
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => updateCfg({ ...bam, groupId: bam.groupId + value })}
                                                                    />
                                                                  </div>
                                                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                                                    <button
                                                                      type="button"
                                                                      onClick={() => updateCfg({ ...bam, groupId: '{{previous.output.groupId}}' })}
                                                                      className="px-2 py-1 text-[9px] bg-primary/10 border border-primary/20 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                                                    >
                                                                      Utiliser groupe précédent
                                                                    </button>
                                                                  </div>
                                                                </FormField>

                                                                <FormField label="Délai entre ajouts (secondes)">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(bam.delay)}
                                                                    onChange={(e) => updateCfg({ ...bam, delay: parseInt(e.target.value) || 30 })}
                                                                    placeholder="30"
                                                                  />
                                                                </FormField>

                                                                <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    ⚠️ <b>Attention:</b> Un délai est recommandé pour éviter les limitations de WhatsApp. Minimum 30 secondes recommandé.
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "checkout":
                                                          const chk = cfg({
                                                            gateway: "moneroo",
                                                            apiKey: "",
                                                            successUrl: "",
                                                            failureUrl: "",
                                                            testMode: true,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 space-y-5 shadow-inner">
                                                                <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                                                      <CreditCard className="h-3 w-3 text-orange-400" />
                                                                    </div>
                                                                    <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
                                                                      Paiement
                                                                      Moneroo
                                                                    </label>
                                                                  </div>
                                                                  <Badge className="bg-orange-500/10 text-orange-500 border-none text-[7px] uppercase font-black px-2">
                                                                    Certifié
                                                                  </Badge>
                                                                </div>

                                                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 group transition-all hover:bg-orange-500/10 active:scale-[0.98]">
                                                                  <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                                                      <Zap className="h-5 w-5 text-white fill-current" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                      <span className="text-[12px] font-black text-white italic uppercase tracking-tighter">
                                                                        Moneroo
                                                                        Gateway
                                                                      </span>
                                                                      <span className="text-[8px] text-orange-400/60 font-black uppercase tracking-widest">
                                                                        Intégration
                                                                        Directe
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                </div>

                                                                <div className="space-y-2 pt-2">
                                                                  <div className="flex items-center justify-between px-1">
                                                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                                                                      Clé API
                                                                      Secrète
                                                                    </label>
                                                                    {chk.apiKey && (
                                                                      <span className="text-[8px] text-emerald-400 font-bold uppercase flex items-center gap-1 animate-pulse">
                                                                        <Check className="h-2.5 w-2.5" />{" "}
                                                                        Active
                                                                      </span>
                                                                    )}
                                                                  </div>
                                                                  <div className="relative group">
                                                                    <Input
                                                                      type="password"
                                                                      value={
                                                                        chk.apiKey
                                                                      }
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        updateCfg({
                                                                          ...chk,
                                                                          apiKey:
                                                                            e.target
                                                                              .value,
                                                                        })
                                                                      }
                                                                      className="bg-black/60 border-white/10 h-10 text-xs pr-10 font-mono focus:border-orange-500/50 transition-all rounded-xl shadow-inner"
                                                                      placeholder="mo_live_..."
                                                                    />
                                                                    <ShieldCheck className="absolute right-3 top-3 h-4 w-4 text-white/10 group-focus-within:text-orange-400 transition-colors" />
                                                                  </div>
                                                                </div>

                                                                <div
                                                                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                                                                  onClick={() =>
                                                                    updateCfg({
                                                                      ...chk,
                                                                      testMode:
                                                                        !chk.testMode,
                                                                    })
                                                                  }
                                                                >
                                                                  <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-tight group-hover:text-primary transition-colors">
                                                                      Environnement
                                                                      Test
                                                                    </span>
                                                                    <span className="text-[8px] text-muted-foreground font-medium uppercase italic opacity-60 line-clamp-1">
                                                                      Simuler des
                                                                      transactions
                                                                      sans frais
                                                                      réels
                                                                    </span>
                                                                  </div>
                                                                  <button
                                                                    className={`w-10 h-5 rounded-full transition-all relative ${chk.testMode ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-white/10"}`}
                                                                  >
                                                                    <div
                                                                      className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${chk.testMode ? "right-1" : "left-1"}`}
                                                                    />
                                                                  </button>
                                                                </div>
                                                              </div>

                                                              <div className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-5">
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center gap-2 px-1">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                                    <label className="text-[9px] font-bold uppercase text-emerald-400/80 tracking-widest">
                                                                      URL de succès
                                                                    </label>
                                                                  </div>
                                                                  <Input
                                                                    value={
                                                                      chk.successUrl
                                                                    }
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...chk,
                                                                        successUrl:
                                                                          e.target
                                                                            .value,
                                                                      })
                                                                    }
                                                                    className="bg-emerald-500/5 border-emerald-500/10 h-10 text-xs rounded-xl focus:border-emerald-500/50 transition-all shadow-inner"
                                                                    placeholder="https://..."
                                                                  />
                                                                </div>
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center gap-2 px-1">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                                    <label className="text-[9px] font-bold uppercase text-red-400/80 tracking-widest">
                                                                      URL
                                                                      d&apos;échec
                                                                    </label>
                                                                  </div>
                                                                  <Input
                                                                    value={
                                                                      chk.failureUrl
                                                                    }
                                                                    onChange={(e) =>
                                                                      updateCfg({
                                                                        ...chk,
                                                                        failureUrl:
                                                                          e.target
                                                                            .value,
                                                                      })
                                                                    }
                                                                    className="bg-red-500/5 border-red-500/10 h-10 text-xs rounded-xl focus:border-red-500/50 transition-all shadow-inner"
                                                                    placeholder="https://..."
                                                                  />
                                                                </div>
                                                              </div>

                                                              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start shadow-inner">
                                                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                                                  <HelpCircle className="h-4 w-4 text-blue-400" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">
                                                                    Fonctionnement
                                                                  </p>
                                                                  <p className="text-[9px] text-blue-400/60 leading-relaxed italic font-medium">
                                                                    Une fois
                                                                    configuré, ce
                                                                    bloc génère un
                                                                    lien de paiement
                                                                    unique pour
                                                                    chaque commande
                                                                    et redirige
                                                                    automatiquement
                                                                    le client via
                                                                    WhatsApp.
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        case "http_request":
                                                          const httpCfg = cfg({
                                                            method: "GET",
                                                            url: "",
                                                            headers: {},
                                                            body: "",
                                                            timeout: 30,
                                                            retryOnFailure: false,
                                                            maxRetries: 3,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Requête HTTP</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Appelle une API externe (GET/POST)</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Méthode">
                                                                  <StyledSelect
                                                                    value={httpCfg.method}
                                                                    onChange={(e) => updateCfg({ ...httpCfg, method: e.target.value })}
                                                                    options={[
                                                                      { value: "GET", label: "GET" },
                                                                      { value: "POST", label: "POST" },
                                                                      { value: "PUT", label: "PUT" },
                                                                      { value: "DELETE", label: "DELETE" },
                                                                      { value: "PATCH", label: "PATCH" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="URL">
                                                                  <StyledInput
                                                                    value={httpCfg.url}
                                                                    onChange={(e) => updateCfg({ ...httpCfg, url: e.target.value })}
                                                                    placeholder="https://api.example.com/endpoint"
                                                                  />
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Headers (JSON)</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentHeaders = JSON.stringify(httpCfg.headers || {}, null, 2);
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentHeaders.length;
                                                                        const newHeaders = currentHeaders.slice(0, cursorPos) + value + currentHeaders.slice(cursorPos);
                                                                        try {
                                                                          updateCfg({ ...httpCfg, headers: JSON.parse(newHeaders) });
                                                                        } catch (e) {
                                                                          // Invalid JSON, keep as is
                                                                        }
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={JSON.stringify(httpCfg.headers || {}, null, 2)}
                                                                    onChange={(e) => {
                                                                      try {
                                                                        const parsed = JSON.parse(e.target.value);
                                                                        updateCfg({ ...httpCfg, headers: parsed });
                                                                      } catch (e) {
                                                                        // Invalid JSON, keep as is
                                                                      }
                                                                    }}
                                                                    className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                                                                  />
                                                                </div>

                                                                {(httpCfg.method === "POST" || httpCfg.method === "PUT" || httpCfg.method === "PATCH") && (
                                                                  <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                      <label className="text-sm text-white/80 font-medium">Body (JSON)</label>
                                                                      <OutputSelector
                                                                        currentNodeId={node.id}
                                                                        onInsert={(value) => {
                                                                          const currentBody = httpCfg.body || "";
                                                                          const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentBody.length;
                                                                          const newBody = currentBody.slice(0, cursorPos) + value + currentBody.slice(cursorPos);
                                                                          updateCfg({ ...httpCfg, body: newBody });
                                                                        }}
                                                                      />
                                                                    </div>
                                                                    <textarea
                                                                      value={httpCfg.body}
                                                                      onChange={(e) => updateCfg({ ...httpCfg, body: e.target.value })}
                                                                      className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                      placeholder='{"key": "value"}'
                                                                    />
                                                                  </div>
                                                                )}

                                                                <FormField label="Timeout (secondes)">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(httpCfg.timeout)}
                                                                    onChange={(e) => updateCfg({ ...httpCfg, timeout: parseInt(e.target.value) || 30 })}
                                                                    placeholder="30"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Réessayer en cas d'échec">
                                                                  <ToggleSwitch
                                                                    checked={httpCfg.retryOnFailure}
                                                                    onChange={() => updateCfg({ ...httpCfg, retryOnFailure: !httpCfg.retryOnFailure })}
                                                                  />
                                                                </FormField>

                                                                {httpCfg.retryOnFailure && (
                                                                  <FormField label="Nombre de tentatives max">
                                                                    <StyledInput
                                                                      type="number"
                                                                      value={String(httpCfg.maxRetries)}
                                                                      onChange={(e) => updateCfg({ ...httpCfg, maxRetries: parseInt(e.target.value) || 3 })}
                                                                      placeholder="3"
                                                                    />
                                                                  </FormField>
                                                                )}
                                                              </div>
                                                            </div>
                                                          );

                                                        case "run_javascript":
                                                          const jsCfg = cfg({
                                                            code: "",
                                                            timeout: 10,
                                                            allowAsync: false,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Code JavaScript</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Exécute du code personnalisé</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Code JavaScript</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentCode = jsCfg.code || "";
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentCode.length;
                                                                        const newCode = currentCode.slice(0, cursorPos) + value + currentCode.slice(cursorPos);
                                                                        updateCfg({ ...jsCfg, code: newCode });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={jsCfg.code}
                                                                    onChange={(e) => updateCfg({ ...jsCfg, code: e.target.value })}
                                                                    className="w-full min-h-[200px] bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                    placeholder="// Votre code JavaScript ici&#10;const result = context.message.toUpperCase();&#10;return { result };"
                                                                  />
                                                                </div>

                                                                <FormField label="Timeout (secondes)">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(jsCfg.timeout)}
                                                                    onChange={(e) => updateCfg({ ...jsCfg, timeout: parseInt(e.target.value) || 10 })}
                                                                    placeholder="10"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Autoriser async/await">
                                                                  <ToggleSwitch
                                                                    checked={jsCfg.allowAsync}
                                                                    onChange={() => updateCfg({ ...jsCfg, allowAsync: !jsCfg.allowAsync })}
                                                                  />
                                                                </FormField>

                                                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    Variables disponibles : <code className="text-blue-400">context</code> (contexte du workflow), <code className="text-blue-400">inputs</code> (données des nœuds précédents)
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "google_sheets":
                                                          const sheetsCfg = cfg({
                                                            spreadsheetId: "",
                                                            sheetName: "",
                                                            action: "read",
                                                            range: "A1:Z1000",
                                                            credentials: "",
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Google Sheets</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Lit ou écrit dans une feuille Google</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="ID de la feuille">
                                                                  <StyledInput
                                                                    value={sheetsCfg.spreadsheetId}
                                                                    onChange={(e) => updateCfg({ ...sheetsCfg, spreadsheetId: e.target.value })}
                                                                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Nom de l'onglet">
                                                                  <StyledInput
                                                                    value={sheetsCfg.sheetName}
                                                                    onChange={(e) => updateCfg({ ...sheetsCfg, sheetName: e.target.value })}
                                                                    placeholder="Feuille1"
                                                                  />
                                                                </FormField>

                                                                <FormField label="Action">
                                                                  <StyledSelect
                                                                    value={sheetsCfg.action}
                                                                    onChange={(e) => updateCfg({ ...sheetsCfg, action: e.target.value })}
                                                                    options={[
                                                                      { value: "read", label: "Lire" },
                                                                      { value: "write", label: "Écrire" },
                                                                      { value: "append", label: "Ajouter" },
                                                                      { value: "update", label: "Mettre à jour" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Plage (Range)">
                                                                  <StyledInput
                                                                    value={sheetsCfg.range}
                                                                    onChange={(e) => updateCfg({ ...sheetsCfg, range: e.target.value })}
                                                                    placeholder="A1:Z1000"
                                                                  />
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Credentials JSON</label>
                                                                  </div>
                                                                  <textarea
                                                                    value={sheetsCfg.credentials}
                                                                    onChange={(e) => updateCfg({ ...sheetsCfg, credentials: e.target.value })}
                                                                    className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                    placeholder='{"type": "service_account", "project_id": "..."}'
                                                                  />
                                                                  <p className="text-[8px] text-muted-foreground/60">
                                                                    JSON des credentials Google Service Account
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "database_query":
                                                          const dbCfg = cfg({
                                                            query: "",
                                                            databaseType: "postgresql",
                                                            connectionString: "",
                                                            timeout: 30,
                                                          });
                                                          return (
                                                            <div className="space-y-0">
                                                              <div className="pb-4 border-b border-white/5">
                                                                <h3 className="text-base font-semibold text-white">Base de données</h3>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Requête SQL personnalisée</p>
                                                              </div>

                                                              <div className="py-4 space-y-4">
                                                                <FormField label="Type de base de données">
                                                                  <StyledSelect
                                                                    value={dbCfg.databaseType}
                                                                    onChange={(e) => updateCfg({ ...dbCfg, databaseType: e.target.value })}
                                                                    options={[
                                                                      { value: "postgresql", label: "PostgreSQL" },
                                                                      { value: "mysql", label: "MySQL" },
                                                                      { value: "sqlite", label: "SQLite" },
                                                                      { value: "mongodb", label: "MongoDB" }
                                                                    ]}
                                                                  />
                                                                </FormField>

                                                                <FormField label="Chaîne de connexion">
                                                                  <StyledInput
                                                                    value={dbCfg.connectionString}
                                                                    onChange={(e) => updateCfg({ ...dbCfg, connectionString: e.target.value })}
                                                                    placeholder="postgresql://user:password@host:5432/database"
                                                                  />
                                                                </FormField>

                                                                <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                    <label className="text-sm text-white/80 font-medium">Requête SQL</label>
                                                                    <OutputSelector
                                                                      currentNodeId={node.id}
                                                                      onInsert={(value) => {
                                                                        const currentQuery = dbCfg.query || "";
                                                                        const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentQuery.length;
                                                                        const newQuery = currentQuery.slice(0, cursorPos) + value + currentQuery.slice(cursorPos);
                                                                        updateCfg({ ...dbCfg, query: newQuery });
                                                                      }}
                                                                    />
                                                                  </div>
                                                                  <textarea
                                                                    value={dbCfg.query}
                                                                    onChange={(e) => updateCfg({ ...dbCfg, query: e.target.value })}
                                                                    className="w-full min-h-[150px] bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono text-xs"
                                                                    placeholder="SELECT * FROM users WHERE id = $1;"
                                                                  />
                                                                </div>

                                                                <FormField label="Timeout (secondes)">
                                                                  <StyledInput
                                                                    type="number"
                                                                    value={String(dbCfg.timeout)}
                                                                    onChange={(e) => updateCfg({ ...dbCfg, timeout: parseInt(e.target.value) || 30 })}
                                                                    placeholder="30"
                                                                  />
                                                                </FormField>

                                                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                                                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                                                                    ⚠️ <b>Attention:</b> Utilisez des requêtes paramétrées pour éviter les injections SQL. Utilisez $1, $2, etc. pour les paramètres.
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "get_group_members":
                                                        case "chat_list_collector":
                                                          const ext = cfg({
                                                            exportFormat: "csv",
                                                            autoSync: false,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4">
                                                                <div className="space-y-1.5">
                                                                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                                                                    Format
                                                                    d'exportation
                                                                  </label>
                                                                  <div className="flex gap-2">
                                                                    {[
                                                                      "csv",
                                                                      "xlsx",
                                                                      "json",
                                                                    ].map((f) => (
                                                                      <button
                                                                        key={f}
                                                                        onClick={() =>
                                                                          updateCfg(
                                                                            {
                                                                              ...ext,
                                                                              exportFormat:
                                                                                f,
                                                                            },
                                                                          )
                                                                        }
                                                                        className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase border transition-all ${ext.exportFormat === f ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/30"}`}
                                                                      >
                                                                        {f}
                                                                      </button>
                                                                    ))}
                                                                  </div>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                  <span className="text-[10px] font-bold text-white/80">
                                                                    Sync auto vers
                                                                    CRM
                                                                  </span>
                                                                  <button
                                                                    onClick={() =>
                                                                      updateCfg({
                                                                        ...ext,
                                                                        autoSync:
                                                                          !ext.autoSync,
                                                                      })
                                                                    }
                                                                    className={`w-8 h-4 rounded-full transition-all relative ${ext.autoSync ? "bg-primary" : "bg-white/10"}`}
                                                                  >
                                                                    <div
                                                                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${ext.autoSync ? "right-0.5" : "left-0.5"}`}
                                                                    />
                                                                  </button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );

                                                        case "anti_ban":
                                                          const ab = cfg({
                                                            min: 2,
                                                            max: 10,
                                                          });
                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 flex flex-col items-center justify-center text-center space-y-4 shadow-inner relative overflow-hidden group">
                                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]" />
                                                                <div className="h-20 w-20 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center border-2 border-indigo-500/30 shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-500">
                                                                  <ShieldCheck className="h-10 w-10 text-indigo-400" />
                                                                </div>
                                                                <div className="space-y-1 relative">
                                                                  <h4 className="text-[13px] font-black uppercase text-white tracking-[0.3em] font-sans italic">
                                                                    Protection
                                                                  </h4>
                                                                  <p className="text-[9px] text-indigo-400/60 font-black uppercase tracking-widest px-1">
                                                                    Simulation
                                                                    Humaine
                                                                  </p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 w-full pt-4 relative">
                                                                  <div className="space-y-1.5">
                                                                    <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                                                      Min (sec)
                                                                    </label>
                                                                    <Input
                                                                      type="number"
                                                                      value={ab.min}
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        updateCfg({
                                                                          ...ab,
                                                                          min:
                                                                            parseInt(
                                                                              e
                                                                                .target
                                                                                .value,
                                                                            ) || 0,
                                                                        })
                                                                      }
                                                                      className="bg-black/60 border-white/10 text-center h-12 text-lg text-indigo-400 font-bold rounded-xl focus:border-indigo-500/50"
                                                                    />
                                                                  </div>
                                                                  <div className="space-y-1.5">
                                                                    <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                                                      Max (sec)
                                                                    </label>
                                                                    <Input
                                                                      type="number"
                                                                      value={ab.max}
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        updateCfg({
                                                                          ...ab,
                                                                          max:
                                                                            parseInt(
                                                                              e
                                                                                .target
                                                                                .value,
                                                                            ) || 0,
                                                                        })
                                                                      }
                                                                      className="bg-black/60 border-white/10 text-center h-12 text-lg text-indigo-400 font-bold rounded-xl focus:border-indigo-500/50"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 shadow-inner">
                                                                <Activity className="h-4 w-4 text-indigo-400 shrink-0 opacity-40" />
                                                                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium italic">
                                                                  Ce bloc ajoute un
                                                                  délai aléatoire
                                                                  entre{" "}
                                                                  <b>{ab.min}s</b>{" "}
                                                                  et{" "}
                                                                  <b>{ab.max}s</b>{" "}
                                                                  pour simuler un
                                                                  comportement
                                                                  humain et éviter
                                                                  le bannissement.
                                                                </p>
                                                              </div>
                                                            </div>
                                                          );

                                                        default: {
                                                          // 🔧 Interface générique simple pour les blocs sans UI dédiée
                                                          let parsedConfig: Record<string, any> = {};
                                                          try {
                                                            parsedConfig = node.config
                                                              ? JSON.parse(node.config)
                                                              : {};
                                                          } catch {
                                                            parsedConfig = {};
                                                          }

                                                          const entries = Object.entries(
                                                            parsedConfig,
                                                          ) as [string, any][];

                                                          const updateConfigObject = (
                                                            newObj: Record<string, any>,
                                                          ) => {
                                                            setNodes(
                                                              nodes.map((n) =>
                                                                n.id === node.id
                                                                  ? {
                                                                    ...n,
                                                                    config: JSON.stringify(
                                                                      newObj,
                                                                      null,
                                                                      2,
                                                                    ),
                                                                  }
                                                                  : n,
                                                              ),
                                                            );
                                                          };

                                                          return (
                                                            <div className="space-y-4">
                                                              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 shadow-inner group transition-all hover:border-white/20">
                                                                <div className="flex items-center justify-between px-1">
                                                                  <div className="flex items-center gap-2">
                                                                    <Settings2 className="h-3 w-3 text-muted-foreground" />
                                                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-widest">
                                                                      Options du bloc
                                                                    </label>
                                                                  </div>
                                                                  <Badge
                                                                    variant="outline"
                                                                    className="text-[7px] border-white/10 text-muted-foreground/40 font-black uppercase px-2"
                                                                  >
                                                                    Facultatif
                                                                  </Badge>
                                                                </div>

                                                                <div className="space-y-3">
                                                                  {entries.length ===
                                                                    0 && (
                                                                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                          <Sparkles className="h-4 w-4 text-primary" />
                                                                          <p className="text-[10px] font-bold text-primary">
                                                                            Aucune option ajoutée
                                                                          </p>
                                                                        </div>
                                                                        <p className="text-[9px] text-muted-foreground/70 leading-relaxed">
                                                                          Ajoutez des champs personnalisés pour ce bloc (Texte, Nombre, Case à cocher ou Liste) selon vos besoins.
                                                                        </p>
                                                                      </div>
                                                                    )}

                                                                  {entries.map(
                                                                    (
                                                                      [key, value],
                                                                      idx,
                                                                    ) => {
                                                                      // Déterminer le type de valeur
                                                                      const valueType = typeof value === 'boolean' ? 'boolean'
                                                                        : typeof value === 'number' ? 'number'
                                                                          : Array.isArray(value) ? 'select'
                                                                            : 'text';

                                                                      // Si c'est un booléen, utiliser un toggle
                                                                      if (valueType === 'boolean') {
                                                                        return (
                                                                          <div
                                                                            key={key || idx}
                                                                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                                                          >
                                                                            <div className="flex items-center gap-2 flex-1">
                                                                              <Input
                                                                                value={key}
                                                                                onChange={(e) => {
                                                                                  const newKey = e.target.value || "";
                                                                                  const newObj: Record<string, any> = {};
                                                                                  entries.forEach(([k, v], i) => {
                                                                                    if (i === idx) {
                                                                                      if (newKey) newObj[newKey] = v;
                                                                                    } else {
                                                                                      newObj[k] = v;
                                                                                    }
                                                                                  });
                                                                                  updateConfigObject(newObj);
                                                                                }}
                                                                                placeholder="Nom de l'option (ex: Ville, Couleur...)"
                                                                                className="h-8 bg-black/40 border-white/10 text-[10px] flex-1"
                                                                              />
                                                                              <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest">Case à cocher</span>
                                                                            </div>
                                                                            <button
                                                                              onClick={() => {
                                                                                const newObj: Record<string, any> = {};
                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i === idx) {
                                                                                    newObj[k] = !v;
                                                                                  } else {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                              className={`relative w-12 h-6 rounded-full transition-all ml-3 ${value ? "bg-primary" : "bg-white/20"}`}
                                                                            >
                                                                              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${value ? "right-1" : "left-1"}`} />
                                                                            </button>
                                                                            <Button
                                                                              variant="ghost"
                                                                              size="icon"
                                                                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                                                                              onClick={() => {
                                                                                const newObj: Record<string, any> = {};
                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i !== idx) {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                            >
                                                                              <X className="h-3 w-3" />
                                                                            </Button>
                                                                          </div>
                                                                        );
                                                                      }

                                                                      // Pour les autres types, afficher avec sélecteur de type
                                                                      return (
                                                                        <div
                                                                          key={key || idx}
                                                                          className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                                                        >
                                                                          <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
                                                                            <Input
                                                                              value={key}
                                                                              onChange={(e) => {
                                                                                const newKey = e.target.value || "";
                                                                                const newObj: Record<string, any> = {};
                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i === idx) {
                                                                                    if (newKey) newObj[newKey] = v;
                                                                                  } else {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                              placeholder="Nom de l'option (ex: Adresse, Age...)"
                                                                              className="h-8 bg-black/40 border-white/10 text-[10px]"
                                                                            />
                                                                            <select
                                                                              value={valueType}
                                                                              onChange={(e) => {
                                                                                const newType = e.target.value;
                                                                                const newObj: Record<string, any> = {};
                                                                                let newValue: any = value;

                                                                                if (newType === 'boolean') {
                                                                                  newValue = true;
                                                                                } else if (newType === 'number') {
                                                                                  newValue = 0;
                                                                                } else if (newType === 'select') {
                                                                                  newValue = ['option1', 'option2'];
                                                                                } else {
                                                                                  newValue = '';
                                                                                }

                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i === idx) {
                                                                                    newObj[k] = newValue;
                                                                                  } else {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                              className="h-8 bg-black/60 border border-white/10 rounded-lg text-[9px] text-white px-2 cursor-pointer"
                                                                            >
                                                                              <option value="text">Texte (ABC)</option>
                                                                              <option value="number">Nombre (123)</option>
                                                                              <option value="boolean">Oui / Non</option>
                                                                              <option value="select">Liste de choix</option>
                                                                            </select>
                                                                            <Button
                                                                              variant="ghost"
                                                                              size="icon"
                                                                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                              onClick={() => {
                                                                                const newObj: Record<string, any> = {};
                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i !== idx) {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                            >
                                                                              <X className="h-3 w-3" />
                                                                            </Button>
                                                                          </div>

                                                                          {valueType === 'text' && (
                                                                            <Input
                                                                              value={value ?? ""}
                                                                              onChange={(e) => {
                                                                                const newVal = e.target.value;
                                                                                const newObj: Record<string, any> = {};
                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i === idx) {
                                                                                    newObj[k] = newVal;
                                                                                  } else {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                              placeholder="Valeur (ex: https://api.example.com)"
                                                                              className="h-8 bg-black/40 border-white/10 text-[10px]"
                                                                            />
                                                                          )}

                                                                          {valueType === 'number' && (
                                                                            <Input
                                                                              type="number"
                                                                              value={value ?? 0}
                                                                              onChange={(e) => {
                                                                                const newVal = parseFloat(e.target.value) || 0;
                                                                                const newObj: Record<string, any> = {};
                                                                                entries.forEach(([k, v], i) => {
                                                                                  if (i === idx) {
                                                                                    newObj[k] = newVal;
                                                                                  } else {
                                                                                    newObj[k] = v;
                                                                                  }
                                                                                });
                                                                                updateConfigObject(newObj);
                                                                              }}
                                                                              placeholder="Nombre (ex: 100, 3.14)"
                                                                              className="h-8 bg-black/40 border-white/10 text-[10px]"
                                                                            />
                                                                          )}

                                                                          {valueType === 'select' && (
                                                                            <div className="space-y-2">
                                                                              <div className="text-[8px] text-muted-foreground/60 uppercase font-black tracking-widest px-1">
                                                                                Choix possibles (un par ligne)
                                                                              </div>
                                                                              <textarea
                                                                                value={Array.isArray(value) ? value.join('\n') : ''}
                                                                                onChange={(e) => {
                                                                                  const options = e.target.value.split('\n').filter(o => o.trim());
                                                                                  const newObj: Record<string, any> = {};
                                                                                  entries.forEach(([k, v], i) => {
                                                                                    if (i === idx) {
                                                                                      newObj[k] = options;
                                                                                    } else {
                                                                                      newObj[k] = v;
                                                                                    }
                                                                                  });
                                                                                  updateConfigObject(newObj);
                                                                                }}
                                                                                className="w-full h-20 bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] text-white/90"
                                                                                placeholder="option1&#10;option2&#10;option3"
                                                                              />
                                                                              {Array.isArray(value) && value.length > 0 && (
                                                                                <select
                                                                                  className="w-full h-8 bg-black/60 border border-white/10 rounded-lg text-[10px] text-white px-2"
                                                                                  value={value[0]}
                                                                                  onChange={(e) => {
                                                                                    const newObj: Record<string, any> = {};
                                                                                    entries.forEach(([k, v], i) => {
                                                                                      if (i === idx) {
                                                                                        newObj[k] = e.target.value;
                                                                                      } else {
                                                                                        newObj[k] = v;
                                                                                      }
                                                                                    });
                                                                                    updateConfigObject(newObj);
                                                                                  }}
                                                                                >
                                                                                  {value.map((opt: string, optIdx: number) => (
                                                                                    <option key={optIdx} value={opt}>{opt}</option>
                                                                                  ))}
                                                                                </select>
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        </div>
                                                                      );
                                                                    }
                                                                  )}

                                                                  <div className="flex items-center justify-between pt-2 gap-2">
                                                                    <div className="flex gap-2 flex-1">
                                                                      <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 text-[10px] px-2 border-dashed border-white/20 flex-1"
                                                                        onClick={() => {
                                                                          const newObj: Record<string, any> = { ...parsedConfig };
                                                                          let idx = 1;
                                                                          let newKey = "option_1";
                                                                          while (newKey in newObj) {
                                                                            idx += 1;
                                                                            newKey = `option_${idx}`;
                                                                          }
                                                                          newObj[newKey] = "";
                                                                          updateConfigObject(newObj);
                                                                        }}
                                                                      >
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        <span className="text-[11px]">Ajouter du Texte</span>
                                                                      </Button>
                                                                      <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 text-[10px] px-2 border-dashed border-white/20"
                                                                        onClick={() => {
                                                                          const newObj: Record<string, any> = { ...parsedConfig };
                                                                          let idx = 1;
                                                                          let newKey = "option_1";
                                                                          while (newKey in newObj) {
                                                                            idx += 1;
                                                                            newKey = `option_${idx}`;
                                                                          }
                                                                          newObj[newKey] = 0;
                                                                          updateConfigObject(newObj);
                                                                        }}
                                                                        title="Ajouter un champ Nombre"
                                                                      >
                                                                        <span className="text-[11px]">Un Nombre</span>
                                                                      </Button>
                                                                      <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 text-[10px] px-2 border-dashed border-white/20"
                                                                        onClick={() => {
                                                                          const newObj: Record<string, any> = { ...parsedConfig };
                                                                          let idx = 1;
                                                                          let newKey = "option_1";
                                                                          while (newKey in newObj) {
                                                                            idx += 1;
                                                                            newKey = `option_${idx}`;
                                                                          }
                                                                          newObj[newKey] = true;
                                                                          updateConfigObject(newObj);
                                                                        }}
                                                                        title="Ajouter un choix Oui / Non"
                                                                      >
                                                                        <Check className="h-3 w-3" />
                                                                      </Button>
                                                                      <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 text-[10px] px-2 border-dashed border-white/20"
                                                                        onClick={() => {
                                                                          const newObj: Record<string, any> = { ...parsedConfig };
                                                                          let idx = 1;
                                                                          let newKey = "option_1";
                                                                          while (newKey in newObj) {
                                                                            idx += 1;
                                                                            newKey = `option_${idx}`;
                                                                          }
                                                                          newObj[newKey] = ["Choix 1", "Choix 2"];
                                                                          updateConfigObject(newObj);
                                                                        }}
                                                                        title="Ajouter une liste de choix"
                                                                      >
                                                                        <ListChecks className="h-3 w-3" />
                                                                      </Button>
                                                                    </div>

                                                                    {entries.length >
                                                                      0 && (
                                                                        <Button
                                                                          type="button"
                                                                          variant="ghost"
                                                                          size="sm"
                                                                          className="h-8 text-[9px] text-muted-foreground hover:text-red-400"
                                                                          onClick={() =>
                                                                            updateConfigObject(
                                                                              {},
                                                                            )
                                                                          }
                                                                        >
                                                                          Réinitialiser
                                                                        </Button>
                                                                      )}
                                                                  </div>
                                                                </div>

                                                                {/* Aperçu JSON en lecture seule pour les utilisateurs avancés */}
                                                                {Object.keys(parsedConfig).length > 0 && (
                                                                  <details className="mt-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                                                                    <summary className="px-3 py-2.5 cursor-pointer text-muted-foreground/70 hover:text-white/80 transition-colors flex items-center justify-between group">
                                                                      <div className="flex items-center gap-2">
                                                                        <Code className="h-3.5 w-3.5 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
                                                                        <span className="text-[9px] font-bold uppercase tracking-wider">
                                                                          Données de l'étape
                                                                        </span>
                                                                      </div>
                                                                      <ChevronDown className="h-3 w-3 text-muted-foreground/40 group-hover:text-white/60 transition-transform duration-200" />
                                                                    </summary>
                                                                    <div className="px-3 pb-3 pt-2 space-y-2">
                                                                      <p className="text-[8px] text-muted-foreground/50 italic">
                                                                        Ces informations sont générées automatiquement selon vos choix ci-dessus.
                                                                      </p>
                                                                      <pre className="text-[10px] text-emerald-400 font-mono whitespace-pre-wrap break-all bg-black/60 p-3 rounded-lg border border-emerald-500/10 overflow-x-auto">
                                                                        {JSON.stringify(
                                                                          parsedConfig,
                                                                          null,
                                                                          2,
                                                                        )}
                                                                      </pre>
                                                                    </div>
                                                                  </details>
                                                                )}
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      }
                                                    })()}
                                                    {instructionsUI}
                                                  </>
                                                );
                                              })()}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                          <Button
                                            variant="ghost"
                                            className="w-full justify-start text-xs text-red-500/60 hover:text-red-500 hover:bg-red-500/5 gap-2"
                                            onClick={() => {
                                              setNodes(
                                                nodes.filter(
                                                  (n) => n.id !== node.id,
                                                ),
                                              );
                                              setIsRightPanelOpen(false);
                                            }}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />{" "}
                                            Supprimer ce bloc
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <div className="p-4 space-y-4">
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                      Always Output Data
                                    </label>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                      <span className="text-xs text-white/80">Always Output Data</span>
                                      <div className="relative w-10 h-5 rounded-full bg-white/10 border border-white/20 cursor-pointer">
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/40 transition-transform" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                      Execute Once
                                    </label>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                      <span className="text-xs text-white/80">Execute Once</span>
                                      <div className="relative w-10 h-5 rounded-full bg-white/10 border border-white/20 cursor-pointer">
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/40 transition-transform" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                      Retry On Fail
                                    </label>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                      <span className="text-xs text-white/80">Retry On Fail</span>
                                      <div className="relative w-10 h-5 rounded-full bg-white/10 border border-white/20 cursor-pointer">
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/40 transition-transform" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                      On Error
                                    </label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-lg h-9 px-3 text-xs text-white focus:border-primary/50 focus:outline-none">
                                      <option value="stop">Stop and Error</option>
                                      <option value="continue">Continue</option>
                                    </select>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                      Notes
                                    </label>
                                    <textarea
                                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none resize-none min-h-[80px]"
                                      placeholder="Add notes about this node..."
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
                                      Display Note in Flow?
                                    </label>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                      <span className="text-xs text-white/80">Display Note in Flow?</span>
                                      <div className="relative w-10 h-5 rounded-full bg-white/10 border border-white/20 cursor-pointer">
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/40 transition-transform" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Column - Output (n8n style) */}
                          <div className="w-[30%] border-l border-white/10 bg-black/20 flex flex-col">
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-semibold text-white/80">Output</h3>
                                {nodeExecutionData[node.id]?.output && (
                                  <div className="flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-[9px] text-emerald-400 font-medium">Success</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="px-2 py-1 text-[10px] rounded bg-white/5 text-white/60 hover:text-white">Schema</button>
                                <button className="px-2 py-1 text-[10px] rounded text-white/40 hover:text-white/60">Table</button>
                                <button className="px-2 py-1 text-[10px] rounded text-white/40 hover:text-white/60">JSON</button>
                              </div>
                            </div>

                            {/* Search bar */}
                            <div className="px-4 py-2 border-b border-white/10 shrink-0">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                                <input
                                  type="text"
                                  placeholder="Search output"
                                  className="w-full h-8 pl-8 pr-2 bg-white/5 border border-white/10 rounded text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
                                />
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                              {(() => {
                                // Si on a des données d'exécution, les afficher
                                const executionOutput = nodeExecutionData[node.id]?.output;

                                if (executionOutput) {
                                  return (
                                    <div className="p-2 space-y-1">
                                      <SchemaHeader
                                        title="Output (exécution)"
                                        icon={Check}
                                        isExpanded={true}
                                        isTrigger={false}
                                      >
                                        <RecursiveObjectItem obj={executionOutput} basePath="previous.output" depth={1} />
                                      </SchemaHeader>
                                    </div>
                                  );
                                }

                                // Sinon, afficher les outputs disponibles basés sur le type de nœud
                                if (Object.keys(availableOutputs).length === 0) {
                                  return (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                      <div className="mb-4 opacity-20">
                                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M3 5v14m18-7H7m8 6l6-6l-6-6" />
                                        </svg>
                                      </div>
                                      <h4 className="text-sm font-medium text-white/40 mb-2">No output data</h4>
                                      <p className="text-xs text-white/20">Execute step to see output data</p>
                                    </div>
                                  );
                                }

                                // Afficher les outputs disponibles
                                return (
                                  <div className="p-2 space-y-1">
                                    <SchemaHeader
                                      title="Outputs disponibles"
                                      icon={Zap}
                                      isExpanded={true}
                                      isTrigger={false}
                                    >
                                      {Object.entries(availableOutputs).map(([key, description]) => {
                                        const desc = String(description);
                                        const typeMatch = desc.match(/^(\w+)\s*-/);
                                        const type = typeMatch ? typeMatch[1] : 'any';

                                        return (
                                          <SchemaItem
                                            key={key}
                                            name={key}
                                            path={`previous.output.${key}`}
                                            value={desc.replace(/^\w+\s*-\s*/, '')}
                                            type={type as any}
                                            depth={1}
                                          />
                                        );
                                      })}
                                    </SchemaHeader>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </motion.aside>
                    );
                  })()}
                </AnimatePresence>

                {/* Panel for Simulate and Logs tabs */}
                <AnimatePresence>
                  {isRightPanelOpen && (rightPanelTab === "simulate" || rightPanelTab === "logs") && (
                    <motion.aside
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                      }}
                      className="absolute top-0 right-0 bottom-0 w-[400px] z-[100] bg-[#171717] border-l border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                      <div className="flex p-2 gap-1 border-b border-white/10 bg-black/40 relative shrink-0">
                        <button
                          onClick={() => {
                            if (selectedNodeIds.size > 0) {
                              setRightPanelTab("inspect");
                            } else {
                              setIsRightPanelOpen(false);
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all text-muted-foreground hover:bg-white/5"
                        >
                          <Settings className="h-3 w-3" /> Configuration
                        </button>
                        <button
                          onClick={() => setRightPanelTab("simulate")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${rightPanelTab === "simulate"
                            ? "bg-white/10 text-white"
                            : "text-muted-foreground hover:bg-white/5"
                            }`}
                        >
                          <Play className="h-3 w-3" /> Simulateur
                        </button>
                        <button
                          onClick={() => setRightPanelTab("logs")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${rightPanelTab === "logs"
                            ? "bg-white/10 text-white"
                            : "text-muted-foreground hover:bg-white/5"
                            }`}
                        >
                          <Terminal className="h-3 w-3" /> Logs
                          {executionLogs.some((l) => l.includes("[ERROR]")) && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </button>
                        <button
                          onClick={() => setIsRightPanelOpen(false)}
                          className="absolute top-2 right-2 h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {rightPanelTab === "logs" ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Historique d'exécution
                              </h3>
                              <button
                                onClick={() => setExecutionLogs([])}
                                className="text-[9px] text-muted-foreground/60 hover:text-white transition-colors"
                              >
                                Effacer tout
                              </button>
                            </div>

                            {executionLogs.length === 0 ? (
                              <div className="text-center py-20 opacity-20">
                                <Activity className="h-12 w-12 mx-auto mb-4" />
                                <p className="text-xs">Aucun log récent</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {executionLogs.map((log, i) => (
                                  <div
                                    key={i}
                                    className={`text-[10px] font-mono p-3 rounded-xl border
                                                                            ${log.includes("[SUCCESS]") ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" : ""}
                                                                            ${log.includes("[ERROR]") ? "bg-red-500/5 text-red-400 border-red-500/10" : ""}
                                                                            ${log.includes("[WARNING]") ? "bg-orange-500/5 text-orange-400 border-orange-500/10" : ""}
                                                                            ${log.includes("[SKIPPED]") ? "bg-zinc-500/5 text-zinc-400 border-zinc-500/10" : ""}
                                                                        `}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className={`h-1.5 w-1.5 rounded-full
                                                                                ${log.includes("[SUCCESS]") ? "bg-emerald-400" : ""}
                                                                                ${log.includes("[ERROR]") ? "bg-red-400" : ""}
                                                                                ${log.includes("[WARNING]") ? "bg-orange-400" : ""}
                                                                                ${log.includes("[SKIPPED]") ? "bg-zinc-400" : ""}
                                                                            `}
                                      />
                                      <span className="opacity-50 text-[8px] font-black uppercase">
                                        {log.includes("[SUCCESS]")
                                          ? "Succès"
                                          : log.includes("[ERROR]")
                                            ? "Erreur"
                                            : log.includes("[WARNING]")
                                              ? "Alerte"
                                              : "Passé"}
                                      </span>
                                    </div>
                                    {log.replace(/\[.*?\]\s*/, "")}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : rightPanelTab === "simulate" ? (
                          <div className="space-y-6">
                            <div className="flex justify-center flex-1">
                              <WhatsAppSimulator
                                isProduction={false}
                                userId={automationWhatsAppId || automationId}
                                template={
                                  (selectedTemplate as
                                    | "support"
                                    | "ecommerce"
                                    | "appointment"
                                    | "default") || "default"
                                }
                                onProcessingChange={setIsFlowAnimate}
                                onExecutionResult={handleExecutionResult}
                                setIsFlowAnimate={setIsFlowAnimate}
                                setExecutionSequence={setExecutionSequence}
                                setActiveStep={setActiveStep}
                                setNodeStatuses={setNodeStatuses}
                                nodes={nodes}
                                products={products}
                                currency="FCFA"
                                targetPhoneNumber={clientWhatsAppNumber}
                                onNodeExecutionData={(nodeId, input, output, context) => {
                                  setNodeExecutionData((prev) => ({
                                    ...prev,
                                    [nodeId]: { input, output, context },
                                  }));
                                }}
                              />
                            </div>

                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-bold text-primary uppercase">
                                  Mode Test Actif
                                </span>
                              </div>
                              <p className="text-[9px] text-muted-foreground leading-relaxed">
                                Utilisez ce simulateur pour tester la logique de
                                votre bot en toute sécurité. Pour envoyer de
                                vrais messages, utilisez le bouton{" "}
                                <b>Publier</b>.
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Mode: Products Management */}
          {viewMode === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="h-14 border-b border-white/10 bg-card px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("builder")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-sm font-bold">Gestion des Produits</h2>
                  <Badge variant="outline" className="text-xs">
                    {products.length} produits
                  </Badge>

                  <div className="flex items-center gap-1 border-l border-white/10 pl-4 ml-2">
                    {Object.entries(currencySymbols).map(([code, symbol]) => (
                      <button
                        key={code}
                        onClick={() => setCurrency(code as any)}
                        className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${currency === code
                          ? "bg-primary text-black"
                          : "text-white/40 hover:text-white/60 hover:bg-white/5"
                          }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-black font-bold text-xs gap-2 px-4"
                  onClick={() => setIsProductModalOpen(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Ajouter un produit
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className="border-white/10 bg-card overflow-hidden"
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="h-16 w-16 rounded-xl bg-white/5 flex items-center justify-center text-3xl overflow-hidden shrink-0">
                            {product.image.startsWith("http") ||
                              product.image.startsWith("data:image") ? (
                              <img
                                src={product.image}
                                className="w-full h-full object-cover"
                                alt={product.name}
                              />
                            ) : (
                              product.image
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                                {product.description}
                              </p>
                            )}
                            <p className="text-[10px] text-muted-foreground/60 font-medium mt-1">
                              Stock: {product.stock} unités
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold text-primary">
                              {product.price} {currencySymbols[currency]}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingProduct({
                                  ...product,
                                  labels: Array.isArray(product.labels)
                                    ? product.labels.join(", ")
                                    : product.labels,
                                });
                                setIsProductModalOpen(true);
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                        {product.labels &&
                          Array.isArray(product.labels) &&
                          product.labels.length > 0 && (
                            <div className="px-4 pb-4 flex flex-wrap gap-2">
                              {product.labels.map(
                                (label: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="bg-white/5 text-[10px] font-medium border-white/5"
                                  >
                                    {label}
                                  </Badge>
                                ),
                              )}
                            </div>
                          )}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Publication Modal */}
        <AnimatePresence>
          {showPublishModal && (
            <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPublishModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-[#171717] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex"
                style={{ height: "600px" }}
              >
                {/* Left Side: Info & Steps */}
                <div className="flex-1 p-12 flex flex-col justify-between border-r border-white/5">
                  <div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                      {isTelegramWorkflow ? (
                        <TelegramIcon className="h-7 w-7" />
                      ) : (
                        <Rocket className="h-7 w-7 text-primary" />
                      )}
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 italic uppercase">
                      {isTelegramWorkflow
                        ? "Connecter Telegram"
                        : "Prêt à Publier ?"}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
                      {isTelegramWorkflow ? (
                        <>
                          Votre bot <b>{workflowName}</b> est prêt. Entrez votre
                          token Telegram pour le mettre en ligne.
                        </>
                      ) : (
                        <>
                          Votre automatisation <b>{workflowName}</b> est prête.
                          Pour la mettre en ligne, vous devez connecter votre
                          numéro WhatsApp.
                        </>
                      )}
                    </p>

                    {!isTelegramWorkflow ? (
                      <div className="space-y-6">
                        {!isPhoneSubmitted ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                                Étape 0 : Votre numéro WhatsApp
                              </label>
                              <div className="phone-input-container">
                                <PhoneInput
                                  placeholder="Entrez votre numéro de téléphone"
                                  value={userPhoneNumber}
                                  onChange={(val) =>
                                    setUserPhoneNumber(val || "")
                                  }
                                  defaultCountry="CI"
                                  international
                                  countryCallingCodeEditable={false}
                                  labels={customLabels}
                                  className="premium-phone-input"
                                />
                              </div>
                            </div>
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                              <p className="text-[10px] text-emerald-400 leading-relaxed italic">
                                C&apos;est le numéro qui sera utilisé pour
                                envoyer les messages automatiques à vos clients.
                              </p>
                            </div>
                            <Button
                              onClick={() => setIsPhoneSubmitted(true)}
                              disabled={!userPhoneNumber}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl"
                            >
                              Continuer vers la connexion
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start gap-4">
                              <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0">
                                1
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  Préparez votre téléphone
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Ouvrez WhatsApp &gt; Réglages &gt; Appareils
                                  connectés
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="h-6 w-6 rounded-full bg-white/5 text-white/40 flex items-center justify-center text-[10px] font-black shrink-0">
                                2
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white/60">
                                  Scannez le code QR
                                </p>
                                <p className="text-xs text-muted-foreground/50">
                                  Utilisez votre mobile pour scanner le code à
                                  droite
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 text-emerald-400 opacity-80 italic">
                              <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black shrink-0 font-sans">
                                ✓
                              </div>
                              <div className="flex-1">
                                <p className="text-xs">
                                  Numéro enregistré : {userPhoneNumber}
                                </p>
                                <button
                                  onClick={() => setIsPhoneSubmitted(false)}
                                  className="text-[10px] underline hover:text-emerald-300 transition-colors mt-1"
                                >
                                  Modifier le numéro
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-white/40 mb-2 block">
                              Token du Bot (via @BotFather)
                            </label>
                            <Input
                              value={tgBotToken}
                              onChange={(e) => setTgBotToken(e.target.value)}
                              placeholder="Ex: 123456789:ABCDefGhIjkLmNoPqRsTuVwXyZ"
                              className="bg-white/5 border-white/10 text-white font-mono text-sm h-12 rounded-xl focus:ring-[#24a1de]/20"
                            />
                          </div>
                          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <p className="text-[10px] text-blue-400 leading-relaxed italic">
                              Note : Allez sur Telegram, cherchez{" "}
                              <b>@BotFather</b>, créez un nouveau bot et copiez
                              son "API Token" ici pour activer l'automatisation.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message d'erreur */}
                  {launchError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                      <p className="text-[11px] text-red-400 font-medium">
                        ❌ {launchError}
                      </p>
                    </div>
                  )}

                  {/* Message de succès */}
                  {launchSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
                      <p className="text-[11px] text-emerald-400 font-medium">
                        ✅ Automatisation lancée avec succès ! Elle est
                        maintenant active 24/7.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowPublishModal(false);
                        setLaunchError(null);
                        setLaunchSuccess(false);
                      }}
                      className="px-8 bg-white/5 hover:bg-white/10"
                    >
                      {launchSuccess ? "Fermer" : "Annuler"}
                    </Button>
                    {isTelegramWorkflow ? (
                      <Button
                        disabled={!tgBotToken}
                        className="px-8 bg-[#24a1de] hover:bg-[#2090c7] text-white font-bold gap-2 rounded-xl shadow-[0_0_20px_rgba(36,161,222,0.3)] transition-all hover:scale-105 active:scale-95"
                      >
                        <Rocket className="h-4 w-4" /> Lancer le Bot Telegram
                      </Button>
                    ) : (
                      isClientWhatsAppConnected && (
                        <Button
                          onClick={handleLaunchAutomation}
                          disabled={isLaunching || launchSuccess}
                          className="px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 disabled:opacity-50"
                        >
                          {isLaunching ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />{" "}
                              Lancement...
                            </>
                          ) : launchSuccess ? (
                            <>
                              <Check className="h-4 w-4" /> Lancé avec succès !
                            </>
                          ) : (
                            <>
                              <Rocket className="h-4 w-4" /> Lancer
                              l&apos;automatisation
                            </>
                          )}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {/* Right Side: QR Code & Live Preview */}
                <div className="w-[400px] bg-black/40 p-12 flex flex-col items-center justify-center relative">
                  <div className="absolute top-8 right-8">
                    <Badge
                      className={`${isTelegramWorkflow ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"} px-3 py-1`}
                    >
                      Production
                    </Badge>
                  </div>

                  <WhatsAppSimulator
                    isProduction={true}
                    userId={automationWhatsAppId || "guest"}
                    onConnect={() => setIsClientWhatsAppConnected(true)}
                    nodes={nodes}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Connection Modal */}
        <AnimatePresence>
          {showConnectionModal && (
            <div className="fixed inset-0 z-[5500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConnectionModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-[#171717] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex"
                style={{ height: "600px" }}
              >
                <div className="flex-1 p-12 flex flex-col border-r border-white/5 overflow-y-auto">
                  <div className="flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                      <WhatsAppIcon className="h-7 w-7" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 italic uppercase">
                      Lier votre WhatsApp
                    </h2>
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-1">
                        Automatisation
                      </p>
                      <p className="text-sm font-bold text-white">
                        {workflowName}
                      </p>
                      <p className="text-[8px] text-muted-foreground/50 font-mono mt-1">
                        ID: {automationId}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
                      {!isPhoneSubmitted
                        ? "Entrez votre numéro de téléphone WhatsApp pour cette automatisation. Chaque workflow peut avoir son propre numéro WhatsApp."
                        : "Scannez le code QR avec votre téléphone pour activer les automatisations sur ce workflow."}
                    </p>

                    {!isPhoneSubmitted ? (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                              Votre numéro WhatsApp
                            </label>
                            <div className="phone-input-container">
                              <PhoneInput
                                placeholder="Entrez votre numéro de téléphone"
                                value={userPhoneNumber}
                                onChange={(val) =>
                                  setUserPhoneNumber(val || "")
                                }
                                defaultCountry="CI"
                                international
                                countryCallingCodeEditable={false}
                                labels={customLabels}
                                className="premium-phone-input"
                              />
                            </div>
                          </div>
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <p className="text-[10px] text-emerald-400 leading-relaxed italic">
                              C&apos;est le numéro qui sera utilisé pour
                              recevoir et envoyer les messages automatiques à
                              vos clients.
                            </p>
                          </div>
                          <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                            <p className="text-[9px] text-amber-400/80 leading-relaxed">
                              💡 <strong>Important :</strong> Si vous avez déjà
                              connecté ce numéro à une autre automatisation,
                              vous devrez utiliser un numéro différent pour ce
                              workflow.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0">
                            ✓
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-400">
                              Numéro enregistré
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {userPhoneNumber}
                              <button
                                onClick={() => setIsPhoneSubmitted(false)}
                                className="ml-2 text-emerald-400 underline hover:text-emerald-300 transition-colors"
                              >
                                Modifier
                              </button>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              Préparez votre téléphone
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ouvrez WhatsApp &gt; Réglages &gt; Appareils
                              connectés
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-6 w-6 rounded-full bg-white/5 text-white/40 flex items-center justify-center text-[10px] font-black shrink-0">
                            2
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white/60">
                              Scannez le code QR
                            </p>
                            <p className="text-xs text-muted-foreground/50">
                              Utilisez votre mobile pour scanner le code à
                              droite
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-8 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowConnectionModal(false)}
                      className="px-8 bg-white/5 hover:bg-white/10"
                    >
                      Fermer
                    </Button>
                    {!isPhoneSubmitted && (
                      <Button
                        onClick={() => setIsPhoneSubmitted(true)}
                        disabled={!userPhoneNumber}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl"
                      >
                        Continuer
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-[400px] bg-black/40 p-12 flex flex-col items-center justify-center relative">
                  {!isPhoneSubmitted ? (
                    <div className="text-center space-y-6">
                      <div className="h-32 w-32 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mx-auto">
                        <QrCode className="h-12 w-12 text-white/20" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-white/40">
                          Code QR en attente
                        </p>
                        <p className="text-xs text-muted-foreground/50 max-w-[200px] mx-auto">
                          Entrez votre numéro de téléphone pour générer le code
                          QR
                        </p>
                      </div>
                    </div>
                  ) : (
                    <WhatsAppSimulator
                      isProduction={true}
                      userId={automationWhatsAppId || "guest"}
                      onConnect={() => {
                        setIsClientWhatsAppConnected(true);
                        setTimeout(() => setShowConnectionModal(false), 2000);
                      }}
                      nodes={[]}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Product Management Modal */}
        <AnimatePresence>
          {isProductModalOpen && (
            <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tight">
                    {editingProduct ? "Modifier le Produit" : "Nouveau Produit"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="rounded-full hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative group h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {(editingProduct
                        ? editingProduct.image
                        : newProduct.image
                      ).startsWith("http") ||
                        (editingProduct
                          ? editingProduct.image
                          : newProduct.image
                        ).startsWith("data:image") ? (
                        <img
                          src={
                            editingProduct
                              ? editingProduct.image
                              : newProduct.image
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">
                          {editingProduct
                            ? editingProduct.image
                            : newProduct.image}
                        </span>
                      )}

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1"
                      >
                        <Upload className="h-5 w-5 text-white" />
                        <span className="text-[8px] font-bold text-white uppercase">
                          Upload
                        </span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-white/40 mb-2 block">
                          Nom du Produit
                        </label>
                        <Input
                          value={
                            editingProduct
                              ? editingProduct.name
                              : newProduct.name
                          }
                          onChange={(e) =>
                            editingProduct
                              ? setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                              : setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                          }
                          className="bg-white/5 border-white/10 h-10"
                          placeholder="Ex: iPhone 15 Pro"
                        />
                      </div>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                            Image (URL ou Emoji)
                          </label>
                          <Input
                            value={
                              editingProduct
                                ? editingProduct.image
                                : newProduct.image
                            }
                            onChange={(e) =>
                              editingProduct
                                ? setEditingProduct({
                                  ...editingProduct,
                                  image: e.target.value,
                                })
                                : setNewProduct({
                                  ...newProduct,
                                  image: e.target.value,
                                })
                            }
                            className="bg-white/5 border-white/10 h-10 text-xs"
                            placeholder="URL ou Emoji"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0 border-white/10 bg-white/5 hover:bg-white/10"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                      Description
                    </label>
                    <textarea
                      value={
                        editingProduct
                          ? editingProduct.description
                          : newProduct.description
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                          : setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all min-h-[80px]"
                      placeholder="Décrivez votre produit..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                        Prix ({currencySymbols[currency]})
                      </label>
                      <Input
                        type="number"
                        value={
                          editingProduct
                            ? editingProduct.price
                            : newProduct.price
                        }
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({
                              ...editingProduct,
                              price: e.target.value,
                            })
                            : setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                        }
                        className="bg-white/5 border-white/10 h-10"
                        placeholder="999"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                        Stock
                      </label>
                      <Input
                        type="number"
                        value={
                          editingProduct
                            ? editingProduct.stock
                            : newProduct.stock
                        }
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({
                              ...editingProduct,
                              stock: e.target.value,
                            })
                            : setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                        }
                        className="bg-white/5 border-white/10 h-10"
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 mb-2 block tracking-widest">
                      Étiquettes (séparées par des virgules)
                    </label>
                    <Input
                      value={
                        editingProduct
                          ? editingProduct.labels
                          : newProduct.labels
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                            ...editingProduct,
                            labels: e.target.value,
                          })
                          : setNewProduct({
                            ...newProduct,
                            labels: e.target.value,
                          })
                      }
                      className="bg-white/5 border-white/10 h-10"
                      placeholder="Électronique, Mode, Premium"
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 h-12 rounded-xl"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={
                      editingProduct ? handleUpdateProduct : handleAddProduct
                    }
                    className="flex-1 bg-primary text-black font-black h-12 rounded-xl shadow-[0_0_20px_rgba(135,169,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {editingProduct ? "Mettre à jour" : "Ajouter le Produit"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
