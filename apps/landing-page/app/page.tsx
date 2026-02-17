"use client";

import Script from "next/script";
import {
  Header,
  Flexbox,
  ActionIcon,
  Button,
  Center,
  Icon,
  Video,
} from "@lobehub/ui";
import { Typography, Switch, Tag, Divider, Collapse } from "antd";
import { createStyles, keyframes } from "antd-style";
import {
  MessageSquare,
  Zap,
  Shield,
  Sparkles,
  Github,
  ArrowRight,
  Globe,
  Wallet,
  Coins,
  Cpu,
  Users,
  Smartphone,
  ChevronRight,
  Store,
  Headset,
  Target,
  Layers,
  Settings,
  Database,
  Search,
  CheckCircle2,
  Rocket,
  Linkedin,
  Facebook,
  Twitter,
  ExternalLink,
  MessageCircle,
  Table,
  Check,
  HardDrive,
  Mail,
  Webhook,
  Calendar,
  CircleHelp,
  Atom,
  Menu,
  X,
  Wand2,
  CreditCard,
  Monitor,
  Download,
  Apple,
  Laptop,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  OpenAI,
  Anthropic,
  Google,
  DeepSeek,
  Groq,
  Mistral,
  Meta,
  Ollama,
} from "@lobehub/icons";
import React, { memo, useState, useEffect } from "react";
import { useStripeCheckout } from "@/lib/useStripeCheckout";
import { motion, AnimatePresence } from "framer-motion";
import { AgentBuilderPreview } from "@/components/AgentBuilderPreview";
import { StepsSection } from "@/components/StepsSection";
import { WhatsAppLogo, GoogleSheetsLogo, ChromeLogo } from "@/components/Logos";
import DemoPreview from "@/components/DemoPreview";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        background?: string;
        speed?: string;
        loop?: boolean;
        autoplay?: boolean;
      };
    }
  }
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
};

const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
};

const cardHover = {
  whileHover: { y: -6, transition: { duration: 0.25 } },
};

const { Text } = Typography;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.05); opacity: 0.15; }
  100% { transform: scale(1); opacity: 0.1; }
`;

const meshRotate = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  33% { transform: rotate(120deg) scale(1.2); }
  66% { transform: rotate(240deg) scale(0.8); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
`;

const gradientRotate = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  75% { transform: translateY(5px) rotate(-1deg); }
`;

const useStyles = createStyles(({ css, token }: { css: any; token: any }) => ({
  main: css`
    --brand-primary: #085e54;
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #ffffff;
    overflow-x: hidden;
    color: #000;
    padding: 0; /* Pas de padding global pour maîtriser les sections bord-à-bord si besoin */
  `,
  header: css`
    height: 64px !important;
    background: rgba(236, 229, 221, 0.8) !important;
    backdrop-filter: blur(24px) saturate(180%) !important;
    border: 1px solid rgba(7, 94, 84, 0.1) !important;
    border-radius: 16px !important;
    padding: 0 16px !important;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;

    @media (min-width: 768px) {
      height: 72px !important;
      border-radius: 20px !important;
      padding: 0 32px !important;
    }

    .scrolled & {
      height: 56px !important;

      @media (min-width: 768px) {
        height: 64px !important;
      }
    }
  `,
  navLinks: css`
    display: none;

    @media (min-width: 1024px) {
      display: flex;
      gap: 32px;
    }
  `,
  heroBlobMain: css`
    width: 300px;
    height: 300px;
    top: -5%;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;

    @media (min-width: 768px) {
      width: 600px;
      height: 600px;
      top: -10%;
    }
  `,
  heroBlobSide: css`
    width: 150px;
    height: 150px;
    top: 5%;
    position: absolute;

    @media (min-width: 768px) {
      width: 300px;
      height: 300px;
    }
  `,
  nav: css`
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 24px);
    max-width: 1440px;
    z-index: 1000;
    padding: 0;
    @media (min-width: 768px) {
      padding: 16px var(--page-padding);
    }
    transition: all 0.3s ease;

    &.scrolled {
      top: 8px;
      max-width: 850px;
      filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.1));

      .ant-layout-header {
        height: 56px !important;
        background: rgba(236, 229, 221, 0.8) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        border-radius: 16px !important;
        border: 1px solid rgba(7, 94, 84, 0.1) !important;

        @media (min-width: 768px) {
          height: 64px !important;
          border-radius: 20px !important;
        }
      }
    }
  `,
  logoText: css`
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #000;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    font-size: 18px;

    @media (min-width: 768px) {
      font-size: 24px;
    }

    .scrolled & {
      font-size: 16px;
      @media (min-width: 768px) {
        font-size: 20px;
      }
    }
  `,
  logoImg: css`
    object-fit: contain;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    width: 32px;
    height: 32px;

    @media (min-width: 768px) {
      width: 40px;
      height: 40px;
    }

    .scrolled & {
      width: 28px;
      height: 28px;
      @media (min-width: 768px) {
        width: 32px;
        height: 32px;
      }
    }
  `,
  actionButton: css`
    border-radius: 12px !important;
    font-weight: 800 !important;
    padding-inline: 16px !important;
    background: #075e54 !important;
    border: none !important;
    color: #fff !important;
    box-shadow: 0 4px 12px rgba(7, 94, 84, 0.3) !important;
    transition: all 0.2s ease !important;
    height: 40px !important;
    font-size: 14px !important;
    cursor: pointer !important;

    &:hover {
      background: #064a43 !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(7, 94, 84, 0.4) !important;
    }

    &:active {
      transform: translateY(0) scale(0.98);
      box-shadow: 0 2px 8px rgba(7, 94, 84, 0.3) !important;
    }

    @media (min-width: 768px) {
      height: 48px !important;
      border-radius: 16px !important;
      padding-inline: 32px !important;
      font-size: 16px !important;
    }

    .scrolled & {
      height: 36px !important;
      @media (min-width: 768px) {
        height: 40px !important;
      }
    }
  `,
  container: css`
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  heroWrapper: css`
    position: relative;
    padding: 100px 16px 40px;
    margin: 12px auto 0;
    z-index: 1;
    width: calc(100% - 24px) !important;
    max-width: 1440px;
    box-sizing: border-box;
    background: #000;
    overflow: hidden;
    color: #fff;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;

    @media (min-width: 768px) {
      border-radius: 40px;
    }

    @media (min-width: 1024px) {
      padding: 140px 48px 100px;
      border-radius: 48px;
      width: calc(100% - (var(--page-padding) * 2));
      margin: 40px auto 0;
    }

    @media (min-width: 1440px) {
      border-radius: 64px;
      padding: 160px 64px 120px;
      width: 100%;
    }
  `,
  heroGlowCircle: css`
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    mix-blend-mode: soft-light;
    opacity: 0.3;
    z-index: -1;
    background: linear-gradient(45deg, #25d366, #dcf8c6);
    animation: ${pulse} 8s ease-in-out infinite;
  `,
  heroBadge: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.05);
    margin-bottom: 24px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #25d366;
    }

    span {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #fff;
    }
  `,
  heroHighlight: css`
    display: inline;
    padding: 2px 6px;
    background: #075e54;
    color: #fff;
    border-radius: 6px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    box-shadow: 0 4px 12px rgba(7, 94, 84, 0.3);

    @media (min-width: 768px) {
      padding: 4px 10px;
      border-radius: 8px;
    }
  `,
  heroStatsRow: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 60px;
    margin-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    transform: perspective(1200px) rotateX(15deg) rotateZ(-2deg);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: perspective(1200px) rotateX(8deg) rotateZ(-1deg);
    }

    @media (min-width: 768px) {
      margin-top: 100px;
      gap: 24px;
    }
    max-width: 1400px;
    position: relative;
    padding-block: 30px;
    padding-inline: var(--page-padding);

    .marquee-row {
      overflow: hidden;
      position: relative;
      mask-image: linear-gradient(
        to right,
        transparent,
        black 10%,
        black 90%,
        transparent
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 10%,
        black 90%,
        transparent
      );
      padding: 10px 0;
    }

    .marquee-content {
      display: flex;
      gap: 12px;
      padding-left: 12px;
      animation: marqueeForward 25s linear infinite;
      white-space: nowrap;
      will-change: transform;

      @media (min-width: 768px) {
        gap: 20px;
        padding-left: 20px;
      }

      &.reverse {
        animation: marqueeReverse 25s linear infinite;
      }

      &:hover {
        animation-play-state: paused;
      }
    }

    @keyframes marqueeForward {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes marqueeReverse {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }

    .logo-card {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      flex-shrink: 0;
      padding: 10px;

      &:nth-child(odd) {
        transform: rotate(-3deg);
      }
      &:nth-child(even) {
        transform: rotate(3deg);
      }
      &:nth-child(3n) {
        transform: rotate(-5deg) translateY(-4px);
      }
      &:nth-child(5n) {
        transform: rotate(4deg) translateY(3px);
      }

      &:hover {
        transform: translateY(-12px) rotate(8deg) scale(1.2) !important;
        background: #fff;
        box-shadow: 0 20px 30px -5px rgba(7, 94, 84, 0.2), 0 0 15px rgba(7, 94, 84, 0.1);
        border-color: #075e54;
        z-index: 10;
      }

      @media (min-width: 768px) {
        width: 64px;
        height: 64px;
        border-radius: 18px;
        padding: 14px;
      }

      img, svg {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: all 0.3s ease;
      }

      &:hover img, &:hover svg {
        transform: scale(1.05);
      }
    }
  `,
  tagBrand: css`
    padding: 3px 10px;
    border-radius: 100px;
    background: #085e54;
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: fit-content;
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 6px 16px;
      font-size: 13px;
      letter-spacing: 1px;
    }
  `,
  sectionTitle: css`
    font-size: clamp(24px, 5vw, 32px);
    font-weight: 900;
    letter-spacing: -1px;
    margin-top: 16px;
    text-align: center;
    padding: 0 8px;

    @media (min-width: 480px) {
      font-size: clamp(28px, 5vw, 40px);
    }

    @media (min-width: 768px) {
      font-size: clamp(36px, 5vw, 48px);
      letter-spacing: -2px;
      margin-top: 24px;
      padding: 0;
    }

    @media (min-width: 1024px) {
      font-size: clamp(40px, 5vw, 56px);
    }
  `,
  sectionDesc: css`
    font-size: 14px;
    color: #666;
    max-width: 400px;
    margin: 12px auto 0;
    text-align: center;
    padding: 0 16px;
    line-height: 1.5;

    @media (min-width: 480px) {
      font-size: 15px;
      max-width: 500px;
    }

    @media (min-width: 768px) {
      font-size: 16px;
      max-width: 550px;
      margin-top: 16px;
      padding: 0;
    }

    @media (min-width: 1024px) {
      font-size: 18px;
      max-width: 600px;
    }
  `,
  videoWrapper: css`
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
  `,
  videoPlayer: css`
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
  productPreview: css`
    position: relative;
    width: 100%;
    max-width: 1300px;
    margin: 0 auto 40px;
  `,
  productPreviewBlob: css`
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  `,
  productPreviewFrame: css`
    position: relative;
    z-index: 10;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.05);
    border: 6px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1);

    iframe {
      width: 100%;
      height: 500px;
      border: none;
      border-radius: 12px;

      @media (min-width: 768px) {
        height: 650px;
      }

      @media (min-width: 1024px) {
        height: 750px;
      }
    }
  `,
  heroVideoScene: css`
    margin-top: 80px;
    width: 100%;
    max-width: 1000px;
    position: relative;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.15) 100%
    );
    box-shadow: 
      0 40px 100px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(7, 94, 84, 0.1);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: scale(1.01);
      box-shadow: 
        0 60px 120px rgba(0, 0, 0, 0.7),
        0 0 60px rgba(7, 94, 84, 0.2);
    }

    .video-inner {
      width: 100%;
      height: 100%;
      border-radius: 22px;
      overflow: hidden;
      background: #000;
      position: relative;
    }

    video {
      width: 100%;
      display: block;
    }

    &::before {
      content: "";
      position: absolute;
      inset: -20px;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(7, 94, 84, 0.15),
        transparent 70%
      );
      z-index: -1;
      opacity: 0.5;
    }
  `,
  heroTitle: css`
    font-size: clamp(22px, 6vw, 28px) !important;
    font-weight: 900 !important;
    line-height: 1.25 !important;
    letter-spacing: -0.5px !important;
    margin-bottom: 16px !important;
    color: #fff;
    text-align: center;
    width: 100%;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    padding: 0;
    box-sizing: border-box;

    @media (min-width: 480px) {
      font-size: clamp(26px, 5vw, 34px) !important;
      margin-bottom: 20px !important;
      text-align: center;
      max-width: 500px;
    }

    @media (min-width: 768px) {
      letter-spacing: -2px !important;
      margin-bottom: 24px !important;
      line-height: 1.1 !important;
      font-size: clamp(36px, 5vw, 48px) !important;
      max-width: 700px;
    }

    @media (min-width: 1280px) {
      letter-spacing: -3px !important;
      font-size: clamp(44px, 6vw, 64px) !important;
      max-width: 900px;
    }

    span.accent {
      color: #075e54;
      text-shadow: 0 0 30px rgba(7, 94, 84, 0.5);
    }
  `,
  heroDescription: css`
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.75) !important;
    max-width: 100%;
    width: 100%;
    margin: 0 auto 20px;
    line-height: 1.6;
    font-weight: 400;
    text-align: center;
    padding: 0 24px;
    box-sizing: border-box;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;

    @media (min-width: 480px) {
      font-size: 14px !important;
      text-align: center;
      padding: 0 32px;
      max-width: 480px;
    }

    @media (min-width: 768px) {
      font-size: 16px !important;
      margin-bottom: 32px;
      max-width: 600px;
      padding: 0;
    }

    @media (min-width: 1024px) {
      font-size: 18px !important;
      margin-bottom: 40px;
      max-width: 750px;
    }
  `,
  agentCardHero: css`
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 20px;
    width: 100%;
    max-width: 320px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;

    @media (min-width: 768px) {
      border-radius: 28px;
      padding: 28px;
    }

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -150%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      transform: skewX(-25deg);
      transition: 0.75s;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-10px) scale(1.02);
      border-color: #075e54;
      box-shadow:
        0 30px 60px rgba(0, 0, 0, 0.4),
        0 0 20px rgba(7, 94, 84, 0.2);

      &::before {
        opacity: 1;
      }
      &::after {
        left: 150%;
      }
    }

    h4 {
      color: #fff;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 8px;
      @media (min-width: 768px) {
        font-size: 18px;
      }
    }
    p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      @media (min-width: 768px) {
        font-size: 14px;
      }
    }
  `,
  heroGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 60px;
    width: 100%;
    position: relative;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-top: 100px;
    }
  `,
  glowButton: css`
    height: 52px !important;
    padding-inline: 32px !important;
    border-radius: 16px !important;
    font-size: 14px !important;
    font-weight: 900 !important;
    background: #075e54 !important;
    color: #fff !important;
    border: none !important;
    box-shadow: 0 12px 24px rgba(0, 59, 142, 0.25) !important;

    @media (min-width: 768px) {
      height: 60px !important;
      padding-inline: 44px !important;
      border-radius: 20px !important;
      font-size: 16px !important;
      box-shadow: 0 16px 32px rgba(0, 59, 142, 0.28) !important;
    }

    @media (min-width: 1024px) {
      height: 72px !important;
      padding-inline: 56px !important;
      border-radius: 24px !important;
      font-size: 20px !important;
      font-weight: 1000 !important;
      box-shadow: 0 20px 40px rgba(0, 59, 142, 0.3) !important;
    }

    &:hover {
      transform: translateY(-4px) scale(1.02);
      background: #075e54 !important;
      box-shadow: 0 30px 60px rgba(7, 94, 84, 0.4) !important;
    }
  `,
  featureSection: css`
    padding: 60px 16px;
    width: 100%;
    position: relative;

    @media (min-width: 768px) {
      padding: 120px 24px;
    }
  `,
  bentoGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    margin-top: 40px;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 24px;
      margin-top: 80px;
    }
  `,
  bentoCard: css`
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(40px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 24px;
    padding: 24px;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;

    @media (min-width: 768px) {
      border-radius: 32px;
      padding: 32px;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -150%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        transparent,
        rgba(7, 94, 84, 0.05),
        transparent
      );
      transform: skewX(-25deg);
      transition: 0.75s;
    }

    &:hover {
      background: #ffffff;
      border-color: #075e54;
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.08);
      transform: translateY(-8px) scale(1.01);

      &::after {
        left: 150%;
      }
    }
  `,
  visualMockup: css`
    margin-top: 100px;
    max-width: 1200px;
    width: 100%;
    position: relative;
    border-radius: 32px;
    padding: 12px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.3) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 80px 160px rgba(0, 0, 0, 0.15);
    animation: ${float} 10s infinite ease-in-out;
  `,
  statsGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    width: 100%;
    max-width: 1200px;
    margin: 40px auto 0;
    padding: 24px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 24px;

    @media (min-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 48px;
      margin-top: 80px;
      padding: 40px;
      border-radius: 32px;
    }
  `,
  statItem: css`
    text-align: center;
    h4 {
      font-size: 20px;
      font-weight: 900;
      margin: 0;
      color: #075e54;
      @media (min-width: 480px) {
        font-size: 24px;
      }
      @media (min-width: 768px) {
        font-size: 28px;
      }
      @media (min-width: 1024px) {
        font-size: 32px;
      }
    }
    p {
      font-size: 9px;
      color: #666;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
      @media (min-width: 480px) {
        font-size: 10px;
        margin-top: 6px;
      }
      @media (min-width: 768px) {
        font-size: 12px;
        letter-spacing: 1px;
        margin-top: 8px;
      }
      @media (min-width: 1024px) {
        font-size: 14px;
      }
    }
  `,
  faqSection: css`
    padding: 120px 24px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  faqItem: css`
    margin-bottom: 16px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 16px;
    width: 100%;
    max-width: 1000px;
    border-left: 3px solid transparent;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: default;

    &:hover {
      background: #fff;
      border-left-color: #075e54;
      box-shadow: 0 8px 24px rgba(0,0,0,0.04);
      transform: translateX(4px);
    }

    @media (min-width: 768px) {
      margin-bottom: 24px;
      padding: 28px;
      border-radius: 20px;
    }

    @media (min-width: 1024px) {
      margin-bottom: 32px;
      padding: 32px;
      border-radius: 24px;
    }

    h3 {
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 8px;
      @media (min-width: 768px) {
        font-size: 18px;
        margin-bottom: 10px;
      }
      @media (min-width: 1024px) {
        font-size: 20px;
        margin-bottom: 12px;
      }
    }
    p {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      @media (min-width: 768px) {
        font-size: 14px;
        line-height: 1.6;
      }
      @media (min-width: 1024px) {
        font-size: 16px;
      }
    }
  `,
  stepsGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 40px;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-top: 60px;
    }
  `,
  stepCard: css`
    padding: 16px;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #eee;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(180deg, #075e54, #25d366);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      border-color: rgba(7, 94, 84, 0.15);
      box-shadow: 0 16px 40px rgba(7, 94, 84, 0.08);

      &::before {
        opacity: 1;
      }
    }

    @media (min-width: 480px) {
      padding: 20px;
      border-radius: 20px;
    }

    @media (min-width: 768px) {
      padding: 32px;
      border-radius: 28px;
    }

    @media (min-width: 1024px) {
      padding: 40px;
      border-radius: 32px;
    }

    .step-num {
      font-size: 24px;
      font-weight: 900;
      background: linear-gradient(135deg, #075e54, #25d366);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0.3;
      line-height: 1;
      margin-bottom: 8px;
      @media (min-width: 768px) {
        font-size: 48px;
        margin-bottom: 16px;
      }
    }
    h3 {
      font-size: 15px;
      font-weight: 800;
      margin-bottom: 8px;
      @media (min-width: 480px) {
        font-size: 18px;
        margin-bottom: 12px;
      }
      @media (min-width: 768px) {
        font-size: 20px;
        margin-bottom: 16px;
      }
      @media (min-width: 1024px) {
        font-size: 24px;
      }
    }
    p {
      font-size: 12px;
      color: #666;
      line-height: 1.5;
      @media (min-width: 480px) {
        font-size: 13px;
      }
      @media (min-width: 768px) {
        font-size: 14px;
        line-height: 1.6;
      }
      @media (min-width: 1024px) {
        font-size: 15px;
      }
    }

    .step-icon-container {
      height: 80px;
      @media (min-width: 768px) {
        height: 120px;
      }
    }

    .step-icon-inner {
      padding: 16px;
      background: rgba(8, 94, 84, 0.05);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      @media (min-width: 768px) {
        padding: 20px;
      }
    }

    .step-icon {
      width: 32px;
      height: 32px;
      color: #085e54;
      @media (min-width: 768px) {
        width: 40px;
        height: 40px;
      }
    }
  `,
  solutionSection: css`
    padding: 60px 16px;
    background: #000;
    color: #fff;
    border-radius: 32px;
    margin-top: 12px;
    width: 100%;

    @media (min-width: 768px) {
      padding: 120px 24px;
      border-radius: 40px;
      margin-top: 16px;
    }

    @media (min-width: 1024px) {
      border-radius: 48px;
      margin-top: 20px;
    }
  `,
  solutionGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    max-width: 1440px;
    margin: 40px auto 0;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 60px;
    }
  `,
  solutionCard: css`
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;

    @media (min-width: 480px) {
      padding: 24px;
      border-radius: 20px;
    }

    @media (min-width: 768px) {
      padding: 32px;
      border-radius: 28px;
    }

    @media (min-width: 1024px) {
      padding: 48px;
      border-radius: 40px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-8px);
    }
    h3 {
      font-size: 16px;
      font-weight: 800;
      margin: 16px 0 12px;
      color: #fff;
      @media (min-width: 768px) {
        font-size: 18px;
        margin: 20px 0 14px;
      }
      @media (min-width: 1024px) {
        font-size: 22px;
        margin: 24px 0 16px;
      }
    }
    p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.5;
      @media (min-width: 768px) {
        font-size: 14px;
        line-height: 1.6;
      }
      @media (min-width: 1024px) {
        font-size: 15px;
      }
    }
    ul {
      list-style: none;
      padding: 0;
      margin-top: 16px;
      @media (min-width: 768px) {
        margin-top: 20px;
      }
      @media (min-width: 1024px) {
        margin-top: 24px;
      }
    }
    li {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.8);
      @media (min-width: 768px) {
        gap: 8px;
        font-size: 13px;
        margin-bottom: 10px;
      }
      @media (min-width: 1024px) {
        font-size: 14px;
        margin-bottom: 12px;
      }
    }
  `,
  useCaseScroll: css`
    display: flex;
    overflow-x: auto;
    gap: 20px;
    width: 100%;
    padding: 40px 0;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  useCaseCard: css`
    flex: none;
    width: 240px;
    height: 180px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;

    @media (min-width: 768px) {
      width: 260px;
      height: 200px;
      padding: 20px;
      border-radius: 20px;
    }

    @media (min-width: 1024px) {
      width: 280px;
      height: 220px;
      padding: 24px;
      border-radius: 24px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #075e54;
      transform: translateY(-8px);
    }

    h4 {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin: 0;
      line-height: 1.3;
      @media (min-width: 768px) {
        font-size: 16px;
        line-height: 1.4;
      }
      @media (min-width: 1024px) {
        font-size: 18px;
      }
    }

    p {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.4;
      margin-top: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      @media (min-width: 768px) {
        font-size: 13px;
        line-height: 1.5;
        margin-top: 10px;
        -webkit-line-clamp: 4;
      }
      @media (min-width: 1024px) {
        font-size: 14px;
        margin-top: 12px;
      }
    }
  `,
  ctaBanner: css`
    padding: 48px 20px;
    background-image: url("https://hub-apac-1.lobeobjects.space/landing/waitlist-bg.webp");
    background-size: cover;
    background-position: center;
    width: calc(100% - 24px);
    max-width: 1200px;
    margin: 80px auto 60px;
    position: relative;
    overflow: visible;
    color: #000;
    text-align: center;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.06),
      0 8px 20px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
      padding: 80px 40px;
      margin: 120px auto 80px;
      border-radius: 36px;
      width: 100%;
    }

    @media (min-width: 1024px) {
      padding: 100px 48px;
      margin: 160px auto 100px;
      border-radius: 48px;
      box-shadow:
        0 40px 100px rgba(0, 0, 0, 0.08),
        0 10px 30px rgba(0, 0, 0, 0.03);
    }

    h2 {
      font-size: clamp(24px, 5vw, 32px);
      font-weight: 900;
      margin-bottom: 12px;
      letter-spacing: -1px;
      line-height: 1.15;
      color: #000;
      padding: 0 8px;
      @media (min-width: 768px) {
        font-size: clamp(32px, 5vw, 48px);
        letter-spacing: -2px;
        margin-bottom: 14px;
        padding: 0;
      }
      @media (min-width: 1024px) {
        font-size: clamp(40px, 5vw, 64px);
        letter-spacing: -3px;
        margin-bottom: 16px;
        line-height: 1.1;
      }
    }
    h3 {
      font-size: 14px;
      opacity: 0.8;
      max-width: 500px;
      margin: 0 auto 32px;
      font-weight: 500;
      line-height: 1.4;
      color: #444;
      padding: 0 8px;
      @media (min-width: 768px) {
        font-size: 18px;
        max-width: 600px;
        margin-bottom: 40px;
        line-height: 1.5;
        padding: 0;
      }
      @media (min-width: 1024px) {
        font-size: 22px;
        max-width: 700px;
        margin-bottom: 48px;
      }
    }
    }

    .cta-button-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      margin-top: 32px;

      @media (min-width: 640px) {
        flex-direction: row;
        justify-content: center;
        width: auto;
        gap: 16px;
        margin-top: 40px;
      }
    }

    .cta-btn-primary, .cta-btn-secondary {
      height: 52px !important;
      padding-inline: 24px !important;
      border-radius: 16px !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      width: 100% !important;
      border: none !important;

      @media (min-width: 640px) {
        height: 64px !important;
        padding-inline: 40px !important;
        border-radius: 20px !important;
        font-size: 18px !important;
        width: auto !important;
      }
    }

    .cta-btn-primary {
      background: #075e54 !important;
      color: #fff !important;
      box-shadow: 0 8px 32px rgba(7, 94, 84, 0.4) !important;
    }

    .cta-btn-secondary {
      background: #075e54 !important; /* Vert foncé comme demandé */
      color: #fff !important;
      box-shadow: 0 8px 32px rgba(7, 94, 84, 0.2) !important;
    }
  `,
  waitlistSpline: css`
    position: absolute;
    top: -100px;
    width: 200px;
    height: 200px;
    z-index: 10;
    pointer-events: none;
    left: 50%;
    transform: translateX(-50%);
  `,
  skillsVisual: css`
    width: 100%;
    height: 400px;
    margin-top: 60px;
    background-image: url("https://hub-apac-1.lobeobjects.space/landing/images/home/skills-light.webp");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
    opacity: 0.8;
    align-self: flex-end;
  `,
  tag: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    background: #085e54;
    color: #fff;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    box-shadow: 0 10px 20px rgba(8, 94, 84, 0.2);

    @media (min-width: 768px) {
      gap: 12px;
      padding: 6px 16px;
      font-size: 13px;
      letter-spacing: 1px;
      margin-bottom: 24px;
    }
  `,
  sectionWrapper: css`
    width: calc(100% - 16px);
    max-width: 1440px;
    margin: 8px auto;
    padding: 48px 16px;
    background: #fff;
    border-radius: 24px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.02);
    overflow: hidden;

    @media (min-width: 768px) {
      width: calc(100% - 24px);
      padding: 120px 48px;
      border-radius: 48px;
      margin: 20px auto;
    }
  `,
  darkSectionWrapper: css`
    width: calc(100% - 24px);
    max-width: 1440px;
    margin: 12px auto;
    padding: 80px 20px;
    background: #000;
    color: #fff;
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
    overflow: hidden;

    @media (min-width: 768px) {
      padding: 120px 48px;
      border-radius: 48px;
      margin: 20px auto;
    }
  `,
  videoSection: css`
    /* Styles fusionnés dans sectionWrapper */
  `,
  pricingGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    width: 100%;
    margin-bottom: 48px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,
  pricingCard: css`
    background: #f8f9fa;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    border: 1px solid transparent;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: left;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: rgba(7, 94, 84, 0.15);
      background: #fff;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
      transform: translateY(-4px);
    }
  `,
  featuredCard: css`
    background: #fff;
    border: 2px solid #000;
    &:hover {
      background: #fff;
      border-color: #000;
    }
  `,
  planIcon: css`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #c57948, #803718);
    color: #ffc385;
    border: 2px solid #ffc385;
  `,
  priceValue: css`
    font-size: 24px;
    font-weight: 800;
    display: flex;
    align-items: baseline;
    gap: 2px;
    color: #000;
    &::before {
      content: "$";
      font-size: 0.8em;
    }
  `,
  featureGroup: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 15px;
    text-align: left;
  `,
  featureItem: css`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;
    color: #444;
  `,
  expandedContent: css`
    display: flex;
    flex-direction: column;
    gap: inherit;
    width: 100%;
    
    @media (max-width: 768px) {
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
      opacity: 0;
      
      &.expanded {
        max-height: 2000px;
        opacity: 1;
        margin-top: 16px;
      }
    }
  `,
  showMoreBtn: css`
    display: none;
    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      margin-top: 16px;
      color: var(--brand-primary);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      background: rgba(7, 94, 84, 0.05);
      border: 1px dashed rgba(7, 94, 84, 0.2);
      transition: all 0.2s ease;

      &:active {
        background: rgba(7, 94, 84, 0.1);
        transform: scale(0.98);
      }
    }
  `,
  mobileMenuBtn: css`
    display: flex;
    @media (min-width: 1024px) {
      display: none;
    }
  `,
  mobileStartBtn: css`
    display: block;
    @media (min-width: 1024px) {
      display: none;
    }

    button {
      cursor: pointer !important;
      transition: all 0.2s ease !important;

      &:hover {
        background: #064a43 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(7, 94, 84, 0.3);
      }

      &:active {
        transform: translateY(0) scale(0.98);
      }
    }
  `,
  desktopActions: css`
    display: none;
    @media (min-width: 1024px) {
      display: flex;
    }
  `,
  desktopNavLinks: css`
    display: none;
    @media (min-width: 1024px) {
      display: block;
    }
  `,
  // segmentedWrapper removed — replaced by Switch toggle
  agentCreateSection: css`
    padding: 60px 16px;
    width: 100%;
    background: #fff;
    color: #000;

    @media (min-width: 768px) {
      padding: 120px 24px;
    }
  `,
  agentBuilderGrid: css`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 40px auto 0;
    max-width: 1100px;
    align-items: stretch;
    background: #fff;
    border-radius: 24px;
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.03);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      box-shadow: 0 50px 100px rgba(0, 0, 0, 0.05);
      border-color: rgba(7, 94, 84, 0.1);
    }

    @media (min-width: 1024px) {
      flex-direction: row;
      gap: 48px;
      padding: 48px;
      border-radius: 40px;
      margin-top: 60px;
    }
  `,
  agentControlBox: css`
    display: flex;
    flex-direction: column;
    gap: 32px;
    flex: 1;
  `,
  agentVideoBox: css`
    border-radius: 20px;
    background: linear-gradient(113.3deg, #ffcf58 0%, #ffa15e 100%);
    padding: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 60px rgba(255, 161, 94, 0.15);
    flex: 1;
    width: 100%;

    @media (min-width: 1024px) {
      padding: 16px;
      min-width: 300px;
      max-width: 450px;
    }
  `,
  agentFeatureGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin: 24px auto 0;
    max-width: 1000px;
    width: 100%;
  `,
  agentFeatureTile: css`
    background: #e0dbd4;
    border-radius: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-height: 200px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    position: relative;
    padding-right: 12px;

    &:hover {
      background: #fff;
      border-color: rgba(0, 0, 0, 0.1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
      transform: translateY(-4px);

      .feature-image {
        transform: scale(1.1);
      }
    }

    @media (max-width: 600px) {
      flex-direction: column;
      padding-right: 0;
    }
  `,
  featureTextWrapper: css`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1.5;
  `,
  featureLabel: css`
    font-size: 22px;
    font-weight: 800;
    color: #1b1b1b;
    margin: 0;
    line-height: 1.2;
  `,
  featureDesc: css`
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin: 0;
    line-height: 1.4;
  `,
  skillsImage: css`
    flex: 1;
    height: 140px;
    background-image: url("https://hub-apac-1.lobeobjects.space/landing/images/home/skills-light.webp");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center right;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  `,
  intelligenceImage: css`
    flex: 1;
    width: 140px;
    height: auto;
    object-fit: contain;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  `,
  chatPreviewBox: css`
    background: #fff;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 500px;
    display: flex;
    overflow: hidden;
    margin-top: 40px;
    text-align: left;

    @media (max-width: 768px) {
      height: auto;
      min-height: 450px;
      flex-direction: column;
      border-radius: 16px;
      margin-top: 24px;
    }
  `,
  chatSidebar: css`
    width: 240px;
    background: #f8f9fa;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    padding: 12px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
      height: auto;
      min-height: 70px;
      flex-direction: row;
      border-right: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      overflow-x: auto;
      gap: 8px;
      padding: 10px 12px;
    }
  `,
  chatSidebarItem: css`
    padding: 10px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 4px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      margin-bottom: 0;
      white-space: nowrap;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    &.active {
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.03);
    }
  `,
  chatContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    position: relative;
    min-height: 0;
  `,
  chatMessageList: css`
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 768px) {
      padding: 16px;
      gap: 12px;
    }
  `,
  chatInputWrapper: css`
    padding: 16px 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    background: #fff;

    @media (max-width: 768px) {
      padding: 12px 16px;
    }
  `,
  footerSection: css`
    width: 100%;
    background: transparent;
    padding: 0 12px 40px;

    @media (min-width: 768px) {
      padding: 0 24px 40px;
    }
  `,
  footerContainer: css`
    background: rgba(236, 229, 221, 0.4);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(7, 94, 84, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
      border-radius: 48px;
    }
  `,
  footerNewsletter: css`
    width: 100%;
    padding: 32px 16px;
    border-bottom: 1px solid rgba(7, 94, 84, 0.1);
    background: linear-gradient(to right, rgba(8, 94, 84, 0.02), transparent);

    @media (min-width: 768px) {
      padding: 60px 40px;
    }

    h2 {
      font-size: 24px;
      font-weight: 900;
      line-height: 1.2;
      letter-spacing: -1px;
      @media (min-width: 768px) {
        font-size: 32px;
      }
    }

    .newsletter-form {
      flex: 1 1 100%;
      @media (min-width: 768px) {
        flex: 0 1 450px;
      }
    }
  `,
  footerMain: css`
    width: 100%;
    padding: 40px 16px;
    max-width: 1200px;
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 80px 24px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      width: 100%;

      @media (min-width: 1024px) {
        grid-template-columns: 2fr repeat(3, 1fr);
        gap: 60px;
      }
    }

    .footer-brand {
      grid-column: 1 / -1;
      @media (min-width: 1024px) {
        grid-column: auto;
      }
    }

    .footer-links-column {
      display: flex;
      flex-direction: column;
      gap: 16px;

      h4 {
        font-weight: 800;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #075e54;
        margin-bottom: 8px;
      }

      a {
        color: #666;
        font-size: 15px;
        transition: all 0.3s ease;
        text-decoration: none;
        width: fit-content;

        &:hover {
          color: #075e54;
          transform: translateX(5px);
        }
      }
    }
  `,
  footerBottom: css`
    width: 100%;
    padding: 24px 16px;
    border-top: 1px solid rgba(7, 94, 84, 0.1);
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: space-between;

    @media (min-width: 768px) {
      flex-direction: row;
      padding: 32px 24px;
    }

    .social-links {
      display: flex;
      gap: 16px;

      a {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #075e54;
        border: 1px solid rgba(7, 94, 84, 0.1);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        &:hover {
          background: #075e54;
          color: #fff;
          transform: translateY(-5px) rotate(8deg);
          box-shadow: 0 10px 20px rgba(7, 94, 84, 0.2);
        }
      }
    }
  `,
}));

const LandingPage = memo(() => {
  const { styles, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [pricingMode, setPricingMode] = useState<'standard' | 'byok'>("standard");
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const { checkout, isLoading } = useStripeCheckout();
  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const togglePlan = (id: string) => {
    setExpandedPlans(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {mounted && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.main}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                position: "relative"
              }}
            >

              <Card className={cn(styles.heroWrapper, "bg-black border-white/20 shadow-2xl overflow-hidden")}>
                {/* Decorative Blobs */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={cx(styles.heroGlowCircle, styles.heroBlobMain)}
                />
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 0.1, x: "-50%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className={cx(styles.heroGlowCircle, styles.heroBlobSide)}
                  style={{ left: "0%" }}
                />
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 0.1, x: "50%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className={cx(styles.heroGlowCircle, styles.heroBlobSide)}
                  style={{ right: "0%" }}
                />

                <div className={styles.container}>
                  <Center style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "100%", overflow: "hidden", padding: "0 16px", boxSizing: "border-box" }}>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <Badge
                        variant="outline"
                        className="mb-8 rounded-full px-4 py-1.5 border-white/10 text-white bg-white/5 hover:bg-white/10 transition-all font-medium flex items-center gap-3 w-fit mx-auto cursor-default"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25d366]"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Nouveautés 2024</span>
                      </Badge>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={styles.heroTitle}
                    >
                      Automatisez vos <span className={styles.heroHighlight}>workflows</span> avec Connect
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className={styles.heroDescription}
                    >
                      L'automatisation WhatsApp universelle. Connectez vos conversations à n'importe quel outil et automatisez vos workflows sans aucune limite.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.9,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <Flexbox horizontal gap={8} align="center" justify="center" className="sm:gap-4" style={{ flexWrap: "wrap" }}>
                        <Button
                          type="primary"
                          size="large"
                          icon={<Rocket size={16} className="sm:!w-5 sm:!h-5" />}
                          onClick={() =>
                            (window.location.href = "https://app.connect.wozif.com")
                          }
                          className="!h-9 sm:!h-14 lg:!h-16 !px-4 sm:!px-10 lg:!px-12 !text-xs sm:!text-lg lg:!text-xl font-black !rounded-lg sm:!rounded-2xl lg:!rounded-3xl !bg-[#085e54] hover:!bg-[#085e54]/90 !text-white border-none transition-all duration-300 shadow-[0_6px_12px_rgba(8,94,84,0.18)] sm:shadow-[0_16px_32px_rgba(8,94,84,0.28)] lg:shadow-[0_20px_40px_rgba(8,94,84,0.3)] hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                        >
                          Commencer l'essai gratuit
                        </Button>
                        <Button
                          size="large"
                          icon={<MessageCircle size={16} className="sm:!w-5 sm:!h-5" />}
                          onClick={() =>
                            (window.location.href = "https://calendly.com")
                          }
                          className="!h-9 sm:!h-14 lg:!h-16 !px-4 sm:!px-10 lg:!px-12 !text-xs sm:!text-lg lg:!text-xl font-black !rounded-lg sm:!rounded-2xl lg:!rounded-3xl !bg-transparent hover:!bg-white/10 !text-white !border-white/30 hover:!border-white/60 transition-all duration-300 hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                        >
                          Demander une démo
                        </Button>
                      </Flexbox>
                    </motion.div>

                    {/* Stats Row-Dual Marquee */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 1.1 }}
                      className={styles.heroStatsRow}
                    >
                      {/* Première rangée-Direction Forward */}
                      <div className="marquee-row">
                        <div className="marquee-content">
                          {(() => {
                            const row1Logos = [
                              {
                                icon: <OpenAI.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <Anthropic.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <Google.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <DeepSeek.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <Groq.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <Mistral.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <Meta.Avatar size={32} />,
                                type: "lobehub",
                              },
                              {
                                icon: <Ollama.Avatar size={32} />,
                                type: "lobehub",
                              },
                              { icon: "/logos/linear.svg" },
                              { icon: "/logos/notion.svg" },
                              { icon: "/logos/slack.svg" },
                              { icon: "/logos/jira.svg" },
                              { icon: "/logos/airtable.svg" },
                              { icon: "/logos/github.svg" },
                              { icon: "/logos/figma.svg" },
                              { icon: "/logos/gmail.svg" },
                              { icon: "/logos/google-sheets.svg" },
                              { icon: "/logos/supabase.svg" },
                            ];
                            // Dupliquer 4 fois pour remplir complètement
                            const duplicated = [
                              ...row1Logos,
                              ...row1Logos,
                              ...row1Logos,
                              ...row1Logos,
                            ];
                            return duplicated.map((logo, idx) => (
                              <span key={idx} className="logo-card">
                                {logo.type === "lobehub" ? (
                                  logo.icon
                                ) : (
                                  <img src={logo.icon as string} alt="Integration Logo" />
                                )}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Deuxième rangée-Direction Reverse */}
                      <div className="marquee-row">
                        <div className="marquee-content reverse">
                          {(() => {
                            const row2Logos = [
                              { icon: "/logos/google-calendar.svg" },
                              { icon: "/logos/google-docs.svg" },
                              { icon: "/logos/google-drive.svg" },
                              { icon: "/logos/hubspot.svg" },
                              { icon: "/logos/salesforce.svg" },
                              { icon: "/logos/zendesk.svg" },
                              { icon: "/logos/whatsapp.svg" },
                              { icon: "/logos/twitter.svg" },
                              { icon: "/logos/youtube.svg" },
                              { icon: "/logos/outlook.svg" },
                              { icon: "/logos/dropbox.svg" },
                              { icon: "/logos/onedrive.svg" },
                              { icon: "/logos/calcom.svg" },
                              { icon: "/logos/calendly.svg" },
                              { icon: "/logos/confluence.svg" },
                              { icon: "/logos/clickup.svg" },
                            ];
                            // Dupliquer 4 fois pour remplir complètement
                            const duplicated = [
                              ...row2Logos,
                              ...row2Logos,
                              ...row2Logos,
                              ...row2Logos,
                            ];
                            return duplicated.map((logo, idx) => (
                              <span key={idx} className="logo-card">
                                <img src={logo.icon} alt="Integration Logo" />
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  </Center>
                </div>
              </Card>

              <motion.section {...fadeInUp} className={styles.sectionWrapper}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 64 }}>
                    <div className={styles.tagBrand}>
                      Démo en action
                    </div>
                    <h2 className={styles.sectionTitle}>
                      Découvrez Connect en action
                    </h2>
                    <p className={styles.sectionDesc}>
                      Une démonstration complète de nos capacités
                      d'automatisation WhatsApp avec l'IA.
                    </p>
                  </Center>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box' }}
                >
                  <DemoPreview />
                </motion.div>
              </motion.section>


              {/* AI Engine Section */}
              <motion.section
                {...fadeInUp}
                id="showcase"
                className={styles.sectionWrapper}
                style={{ background: "#f8f9fa" }}
              >
                <div className={styles.container}>
                  <Center style={{ marginBottom: 60 }}>
                    <div className={styles.tagBrand}>
                      Multi-LLM
                    </div>
                    <h2 className={styles.sectionTitle}>
                      L'interface ultime pour vos agents.
                    </h2>
                    <p className={styles.sectionDesc}>
                      Connect propose une expérience de chat révolutionnaire,
                      inspirée des standards LobeChat, pour piloter vos
                      automatisations WhatsApp avec une fluidité absolue.
                    </p>
                  </Center>

                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, width: "100%" }}
                  >
                    {[
                      { icon: <WhatsAppLogo size={24} color="#fff" />, title: "Chat Lobe-Style", description: "Une interface conversationnelle premium pour gérer vos échanges WhatsApp et vos agents IA.", gradient: "linear-gradient(135deg, #075e54, #25d366)" },
                      { icon: <GoogleSheetsLogo size={24} />, title: "Sync Google Sheets", description: "Enregistrez automatiquement les données de vos conversations dans vos tableurs en temps réel.", gradient: "linear-gradient(135deg, #0F9D58, #34A853)" },
                      { icon: <Zap size={24} />, title: "Flows Ultra-Rapides", description: "Des automatisations qui s'exécutent instantanément entre WhatsApp, vos CRM et vos outils.", gradient: "linear-gradient(135deg, #1890ff, #096dd9)" },
                      { icon: <ChromeLogo size={24} />, title: "Multi-Device Support", description: "Pilotez votre instance Connect depuis votre ordinateur ou votre mobile avec la même fluidité.", gradient: "linear-gradient(135deg, #722ed1, #eb2f96)" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3 }}
                        style={{
                          background: "#fff",
                          borderRadius: 20,
                          padding: 28,
                          border: "1px solid rgba(0,0,0,0.06)",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "default",
                        }}
                      >
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: item.gradient,
                        }} />
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "100%",
                          background: `linear-gradient(180deg, ${item.gradient.includes("#075e54") ? "rgba(7,94,84,0.02)" : item.gradient.includes("#0F9D58") ? "rgba(15,157,88,0.02)" : item.gradient.includes("#1890ff") ? "rgba(24,144,255,0.02)" : "rgba(114,46,209,0.02)"} 0%, transparent 40%)`,
                          pointerEvents: "none",
                        }} />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: item.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            marginBottom: 20,
                            boxShadow: `0 8px 20px ${item.gradient.includes("#075e54") ? "rgba(7,94,84,0.25)" : item.gradient.includes("#0F9D58") ? "rgba(15,157,88,0.25)" : item.gradient.includes("#1890ff") ? "rgba(24,144,255,0.25)" : "rgba(114,46,209,0.25)"}`,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          {item.icon}
                        </motion.div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: "#000", position: "relative", zIndex: 1 }}>{item.title}</h3>
                        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, position: "relative", zIndex: 1 }}>{item.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                </div>
              </motion.section>

              {/* Steps Section - How to create your agent */}
              <motion.section
                {...fadeInUp}
                id="how-it-works"
                style={{
                  width: "100%",
                  padding: "80px 0",
                  background: "#fafbfc",
                }}
              >
                <div className={styles.container}>
                  <Center style={{ marginBottom: 56 }}>
                    <div className={styles.tagBrand}>
                      <Layers size={14} /> Comment ça marche
                    </div>
                    <h2 className={styles.sectionTitle}>
                      3 étapes pour créer votre agent.
                    </h2>
                    <p className={styles.sectionDesc}>
                      De l'idée au déploiement en moins de 5 minutes.
                    </p>
                  </Center>

                  <StepsSection />
                </div>
              </motion.section>

              {/* Solutions & Use Cases Section */}
              <motion.section
                {...fadeInUp}
                id="solutions"
                className={styles.darkSectionWrapper}
              >
                <div className={styles.container}>
                  <Center style={{ marginBottom: 64 }}>
                    <div className={styles.tagBrand}>
                      Gallerrie d'Agents
                    </div>
                    <h2 className={styles.sectionTitle}>
                      Cas d'usage réels.
                    </h2>
                    <p className={styles.sectionDesc}>
                      Découvrez comment nos clients orchestrent leur
                      intelligence.
                    </p>
                  </Center>

                  <motion.div
                    variants={staggerFast}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    className={styles.useCaseScroll}
                  >
                    {[
                      {
                        title: "WhatsApp vers Google Sheets",
                        desc: "Collecte de données automatique depuis WhatsApp directement synchronisée dans vos tableurs Sheets.",
                      },
                      {
                        title: "CRM intelligent sur WhatsApp",
                        desc: "Notification automatique de votre CRM lors de chaque interaction client qualifiée via IA.",
                      },
                      {
                        title: "Support Client Multi-Agent",
                        desc: "Plusieurs agents IA spécialisés gérant vos départements (Ventes, Support, Logistique) en simultané.",
                      },
                      {
                        title: "Dashboard No-Code",
                        desc: "Configurez vos webhooks et vos automatisations sans écrire une seule ligne de code via notre interface.",
                      },
                      {
                        title: "Mémoire Conversationnelle",
                        desc: "Vos agents se souviennent du contexte de chaque client pour un service ultra-personnalisé.",
                      },
                      {
                        title: "Export de rapports auto",
                        desc: "Générez des rapports hebdomadaires sur vos automatisations envoyés directement par email.",
                      },
                    ].map((item, idx) => (
                      <motion.div key={idx} variants={fadeInUp} {...cardHover} className={styles.useCaseCard}>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                        <Flexbox
                          horizontal
                          justify="space-between"
                          align="center"
                          style={{ marginTop: 20 }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "#075e54",
                              fontWeight: 800,
                            }}
                          >
                            DÉMO DISPONIBLE
                          </span>
                          <ExternalLink
                            size={14}
                            color="rgba(255,255,255,0.4)"
                          />
                        </Flexbox>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>

              {/* Atomic Security SVG Animation Section */}
              <motion.section
                {...fadeInUp}
                className={styles.sectionWrapper}
                style={{ background: "#f8f9fa" }}
              >
                <div className={styles.container}>
                  <Flexbox
                    horizontal
                    align="center"
                    justify="flex-start"
                    style={{ gap: 40, flexWrap: "wrap" }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Shield size={120} color="#075e54" strokeWidth={1.5} />
                    </motion.div>

                    <motion.div {...fadeInRight} style={{ flex: 1, minWidth: 320 }}>
                      <div className={styles.tagBrand} style={{ margin: "0 0 16px", width: "fit-content" }}>
                        Sécurité Militaire
                      </div>
                      <h2 className={styles.sectionTitle} style={{ textAlign: "left", marginTop: 0 }}>
                        Confidentialité Atomique.
                      </h2>
                      <p className={styles.sectionDesc} style={{ textAlign: "left", margin: "16px 0 0" }}>
                        Vos données sont sacrées. Connect utilise un chiffrement
                        de bout en bout et une architecture isolée pour garantir
                        une sécurité totale.
                      </p>

                      {/* RGPD Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          marginTop: 24,
                          padding: "12px 20px",
                          background: "#fff",
                          borderRadius: 16,
                          border: "1px solid rgba(0,0,0,0.06)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                          width: "fit-content",
                        }}
                      >
                        <svg width="48" height="48" viewBox="0 0 501 501" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="250.5" cy="250.5" r="250.5" fill="#233F92" />
                          <path d="M280.713 82.2889C279.888 79.741 277.723 77.9205 275.073 77.5335L263.052 75.7853L257.672 64.892V64.8877C256.485 62.4887 254.086 61 251.41 61C248.735 61 246.332 62.493 245.145 64.8962L239.768 75.7895L227.744 77.5377C225.094 77.9248 222.933 79.7495 222.104 82.2932C221.278 84.841 221.955 87.5845 223.873 89.4561L232.571 97.9376L230.517 109.911C230.066 112.553 231.134 115.169 233.299 116.742C235.46 118.316 238.275 118.516 240.653 117.274L251.41 111.617L262.163 117.27C263.197 117.81 264.311 118.078 265.421 118.078C266.863 118.078 268.297 117.627 269.522 116.738C271.691 115.164 272.755 112.548 272.299 109.907L270.249 97.9334L278.952 89.4518C280.87 87.5803 281.542 84.8368 280.713 82.2889Z" fill="#FECD07" />
                          <path d="M280.712 405.808C279.892 403.256 277.727 401.435 275.072 401.048L263.052 399.3L257.671 388.407C256.489 386.004 254.085 384.511 251.406 384.511C248.73 384.511 246.327 386.004 245.14 388.407L239.764 399.3L227.735 401.048C225.085 401.435 222.924 403.264 222.099 405.808C221.274 408.356 221.954 411.095 223.868 412.962L232.567 421.448L230.512 433.422C230.061 436.063 231.129 438.679 233.294 440.253C234.519 441.142 235.953 441.593 237.39 441.593C238.5 441.593 239.615 441.325 240.649 440.781L251.41 435.132L262.163 440.785C264.524 442.031 267.348 441.835 269.513 440.257C271.687 438.684 272.75 436.068 272.295 433.426L270.245 421.452L278.947 412.967C280.866 411.095 281.542 408.356 280.712 405.808Z" fill="#FECD07" />
                          <path d="M118.959 244.046C118.134 241.498 115.969 239.678 113.319 239.291L101.294 237.543L95.918 226.645C94.7312 224.246 92.328 222.757 89.6525 222.757C86.977 222.757 84.5738 224.25 83.3871 226.654L78.0106 237.547L65.9859 239.295C63.3359 239.682 61.1751 241.507 60.3457 244.051C59.5205 246.598 60.1968 249.342 62.1152 251.209L70.8136 259.695L68.7592 271.669C68.3083 274.31 69.3759 276.926 71.541 278.5C72.766 279.389 74.1994 279.84 75.6371 279.84C76.7473 279.84 77.8617 279.572 78.8953 279.027L89.6483 273.374L100.401 279.027C102.775 280.282 105.595 280.078 107.756 278.5C109.925 276.926 110.988 274.31 110.537 271.669L108.491 259.691L117.19 251.209C119.108 249.342 119.785 246.598 118.959 244.046Z" fill="#FECD07" />
                          <path d="M442.471 244.046C441.646 241.499 439.481 239.678 436.831 239.291L424.81 237.543L419.43 226.649C418.247 224.25 415.844 222.753 413.164 222.753C410.484 222.753 408.085 224.246 406.899 226.649L401.518 237.543L389.497 239.291C386.847 239.678 384.682 241.499 383.857 244.046C383.032 246.594 383.704 249.338 385.622 251.209L394.325 259.691L392.275 271.665C391.824 274.306 392.888 276.922 395.057 278.496C396.278 279.385 397.711 279.836 399.153 279.836C400.263 279.836 401.378 279.568 402.411 279.023L413.164 273.37L423.917 279.023C426.278 280.269 429.106 280.074 431.267 278.496C433.441 276.922 434.504 274.306 434.049 271.665L431.999 259.691L440.701 251.205C442.624 249.338 443.3 246.594 442.471 244.046Z" fill="#FECD07" />
                          <path d="M201.328 103.961C200.503 101.413 198.338 99.5923 195.688 99.2052L183.664 97.4613L178.287 86.568C177.1 84.169 174.701 82.676 172.022 82.676C169.346 82.676 166.943 84.169 165.756 86.5723L160.38 97.4655L148.355 99.2095C145.705 99.5966 143.544 101.421 142.715 103.965C141.89 106.513 142.566 109.256 144.484 111.124L153.183 119.605L151.128 131.583C150.677 134.225 151.745 136.84 153.91 138.414C155.135 139.303 156.569 139.754 158.006 139.754C159.116 139.754 160.231 139.486 161.264 138.946L172.017 133.293L182.77 138.946C185.148 140.196 187.964 139.997 190.125 138.418C192.294 136.845 193.357 134.225 192.906 131.587L190.852 119.609L199.55 111.128C201.477 109.252 202.154 106.509 201.328 103.961Z" fill="#FECD07" />
                          <path d="M140.628 161.532C139.799 158.984 137.638 157.168 134.992 156.781L122.968 155.033L117.591 144.139C116.409 141.736 114.005 140.243 111.326 140.243C108.646 140.243 106.247 141.736 105.064 144.135L99.6837 155.033L87.6633 156.781C85.0133 157.164 82.8525 158.984 82.0231 161.532C81.1937 164.08 81.87 166.828 83.7926 168.699L92.491 177.181L90.4323 189.154C89.9814 191.796 91.0491 194.412 93.2141 195.986C95.3792 197.559 98.195 197.764 100.568 196.517L111.321 190.86L122.079 196.517C123.112 197.057 124.227 197.325 125.337 197.325C126.779 197.325 128.212 196.875 129.437 195.986C131.602 194.412 132.67 191.796 132.215 189.154L130.16 177.181L138.863 168.699C140.781 166.823 141.462 164.08 140.628 161.532Z" fill="#FECD07" />
                          <path d="M361.593 103.961C360.768 101.413 358.603 99.5923 355.953 99.2053L343.932 97.4613L338.556 86.568C337.369 84.1648 334.966 82.6718 332.286 82.6718C329.606 82.6718 327.207 84.1648 326.016 86.568L320.64 97.4613L308.62 99.2053C305.97 99.5923 303.805 101.413 302.979 103.961C302.154 106.509 302.826 109.252 304.745 111.124L313.447 119.605L311.397 131.583C310.946 134.225 312.01 136.84 314.179 138.414C315.4 139.303 316.833 139.754 318.275 139.754C319.385 139.754 320.5 139.486 321.529 138.946L332.286 133.293L343.039 138.946C345.404 140.192 348.224 139.997 350.393 138.419C352.567 136.845 353.63 134.229 353.175 131.587L351.125 119.609L359.828 111.128C361.746 109.248 362.418 106.504 361.593 103.961Z" fill="#FECD07" />
                          <path d="M420.802 163.174C419.977 160.622 417.816 158.801 415.162 158.414L403.137 156.666L397.761 145.769C396.574 143.37 394.171 141.881 391.495 141.881H391.487C388.811 141.881 386.416 143.378 385.23 145.777L379.849 156.67L367.829 158.419C365.179 158.806 363.014 160.626 362.188 163.174C361.363 165.722 362.035 168.465 363.954 170.337L372.656 178.818L370.606 190.792C370.155 193.434 371.219 196.05 373.384 197.623C374.609 198.512 376.042 198.963 377.484 198.963C378.594 198.963 379.704 198.695 380.742 198.155L391.495 192.498L402.248 198.155C404.617 199.401 407.446 199.197 409.602 197.623C411.772 196.05 412.835 193.434 412.38 190.792L410.33 178.818L419.024 170.341C420.947 168.465 421.627 165.722 420.802 163.174Z" fill="#FECD07" />
                          <path d="M137.404 326.552C136.574 324.008 134.413 322.192 131.768 321.809L119.739 320.057L114.366 309.164C113.18 306.76 110.781 305.267 108.101 305.267C105.421 305.272 103.022 306.765 101.84 309.164L96.4634 320.057L84.4387 321.809C81.7887 322.192 79.6279 324.013 78.7985 326.556C77.9691 329.104 78.6454 331.848 80.568 333.723L89.2664 342.205L87.212 354.179C86.7611 356.82 87.8287 359.436 89.9938 361.01C91.2188 361.899 92.6522 362.35 94.0899 362.35C95.2001 362.35 96.3145 362.082 97.3481 361.537L108.101 355.884L118.854 361.537C121.223 362.788 124.048 362.584 126.213 361.006C128.378 359.432 129.441 356.816 128.99 354.179L126.936 342.205L135.638 333.719C137.561 331.848 138.233 329.1 137.404 326.552Z" fill="#FECD07" />
                          <path d="M420.803 324.936C419.982 322.384 417.821 320.559 415.163 320.172L403.138 318.424L397.762 307.53C396.575 305.131 394.172 303.638 391.496 303.638H391.488C388.812 303.643 386.418 305.136 385.231 307.535L379.85 318.428L367.825 320.176C365.176 320.563 363.01 322.388 362.19 324.936C361.364 327.484 362.041 330.223 363.955 332.09L372.657 340.576L370.607 352.55C370.156 355.191 371.22 357.807 373.389 359.381C374.61 360.27 376.043 360.721 377.485 360.721C378.595 360.721 379.71 360.453 380.743 359.908L391.496 354.255L402.245 359.908C404.627 361.163 407.439 360.955 409.604 359.381C411.773 357.807 412.836 355.191 412.381 352.55L410.331 340.576L419.025 332.094C420.948 330.223 421.628 327.479 420.803 324.936Z" fill="#FECD07" />
                          <path d="M201.328 380.504C200.503 377.956 198.342 376.131 195.684 375.744L183.659 373.996L178.282 363.103C177.096 360.699 174.697 359.206 172.017 359.206C169.342 359.206 166.938 360.699 165.752 363.103L160.375 373.996L148.346 375.744C145.696 376.131 143.535 377.96 142.71 380.504C141.885 383.052 142.566 385.791 144.48 387.658L153.178 396.144L151.124 408.118C150.673 410.759 151.74 413.375 153.906 414.949C155.131 415.838 156.564 416.289 158.002 416.289C159.112 416.289 160.226 416.021 161.26 415.476L172.013 409.823L182.766 415.476C185.143 416.731 187.959 416.523 190.12 414.949C192.289 413.375 193.353 410.759 192.902 408.118L190.847 396.144L199.542 387.662C201.473 385.791 202.153 383.052 201.328 380.504Z" fill="#FECD07" />
                          <path d="M361.594 380.504C360.773 377.952 358.608 376.131 355.954 375.744L343.934 373.996L338.557 363.103C337.37 360.704 334.967 359.206 332.287 359.206C329.608 359.206 327.209 360.704 326.018 363.103L320.641 373.996L308.616 375.744C305.967 376.131 303.802 377.956 302.981 380.504C302.155 383.052 302.832 385.791 304.746 387.658L313.448 396.144L311.398 408.118C310.947 410.759 312.011 413.375 314.18 414.949C315.401 415.838 316.834 416.289 318.276 416.289C319.386 416.289 320.501 416.021 321.534 415.476L332.287 409.823L343.04 415.476C345.405 416.722 348.225 416.527 350.395 414.949C352.568 413.375 353.632 410.759 353.176 408.118L351.126 396.144L359.829 387.658C361.743 385.791 362.419 383.052 361.594 380.504Z" fill="#FECD07" />
                          <path d="M179.633 283.162C162.061 283.162 147.77 268.87 147.77 251.299C147.77 233.727 162.061 219.435 179.633 219.435C184.703 219.435 189.752 220.66 194.231 222.97C196.319 224.046 197.14 226.611 196.06 228.7C194.979 230.788 192.415 231.609 190.33 230.529C187.004 228.81 183.406 227.942 179.633 227.942C166.753 227.942 156.277 238.419 156.277 251.299C156.277 264.178 166.753 274.655 179.633 274.655C182.555 274.655 185.371 274.132 188.042 273.098V257.598H178.905C176.557 257.598 174.652 255.697 174.652 253.345C174.652 250.997 176.557 249.091 178.905 249.091H192.295C194.643 249.091 196.549 250.997 196.549 253.345V275.837C196.549 277.428 195.664 278.887 194.248 279.619C189.76 281.937 184.707 283.162 179.633 283.162Z" fill="white" />
                          <path d="M227.305 283.162C222.231 283.162 217.173 281.937 212.686 279.619C211.274 278.887 210.385 277.428 210.385 275.837L210.398 226.743C210.398 225.152 211.287 223.693 212.703 222.966C217.182 220.656 222.231 219.431 227.301 219.431C244.868 219.431 259.164 233.723 259.164 251.294C259.164 268.866 244.877 283.162 227.305 283.162ZM218.896 273.098C221.563 274.131 224.383 274.655 227.305 274.655C240.185 274.655 250.661 264.178 250.661 251.299C250.661 238.419 240.185 227.942 227.305 227.942C224.387 227.942 221.572 228.466 218.909 229.495L218.896 273.098Z" fill="white" />
                          <path d="M284.099 219.435C280.296 219.435 276.66 220.176 273.287 221.635C271.73 222.307 270.718 223.842 270.718 225.535L270.709 255.199V278.908C270.709 281.26 272.61 283.162 274.963 283.162C277.315 283.162 279.216 281.26 279.216 278.908V260.861C280.807 261.141 282.432 261.311 284.095 261.311C297.421 261.311 308.263 251.92 308.263 240.376C308.263 228.831 297.421 219.435 284.099 219.435ZM284.099 252.804C282.436 252.804 280.786 252.592 279.22 252.183L279.229 228.568C280.794 228.159 282.444 227.947 284.103 227.947C292.738 227.947 299.765 233.523 299.765 240.376C299.765 247.228 292.734 252.804 284.099 252.804Z" fill="white" />
                          <path d="M355.053 240.371C355.053 228.827 344.211 219.435 330.884 219.435C327.082 219.435 323.445 220.176 320.072 221.635C318.515 222.307 317.503 223.842 317.503 225.535L317.494 255.199V278.908C317.494 281.26 319.395 283.162 321.748 283.162C324.1 283.162 326.001 281.26 326.001 278.908V260.861C327.592 261.141 329.217 261.311 330.88 261.311C334.096 261.311 337.162 260.754 339.97 259.763C344.211 262.945 346.541 269.627 346.541 278.912C346.541 281.265 348.443 283.166 350.795 283.166C353.147 283.166 355.049 281.265 355.049 278.912C355.049 268.623 352.496 260.512 347.749 255.339C352.25 251.533 355.053 246.233 355.053 240.371ZM330.889 252.804C329.225 252.804 327.575 252.592 326.01 252.183L326.018 228.568C327.584 228.159 329.234 227.947 330.893 227.947C339.527 227.947 346.554 233.523 346.554 240.376C346.554 247.228 339.523 252.804 330.889 252.804Z" fill="white" />
                        </svg>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>RGPD</p>
                          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>100% Conforme</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </Flexbox>
                </div>
              </motion.section>

              {/* Global Connectivity Section */}
              <motion.section
                {...fadeInUp}
                style={{
                  background: "#000",
                  padding: "100px 24px",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Animated background glows */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "10%",
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #075e54 0%, transparent 70%)",
                    filter: "blur(80px)",
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  style={{
                    position: "absolute",
                    bottom: "10%",
                    right: "5%",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #128c7e 0%, transparent 70%)",
                    filter: "blur(80px)",
                    pointerEvents: "none",
                  }}
                />
                {/* Grid pattern overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  pointerEvents: "none",
                }} />

                <div className={styles.container} style={{ position: "relative", zIndex: 1 }}>
                  <Center style={{ marginBottom: 60 }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className={styles.tag}
                        style={{ background: "#075e54", color: "#fff" }}
                      >
                        Réseau Mondial
                      </div>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        color: "#fff",
                        fontSize: "clamp(32px, 5vw, 64px)",
                        fontWeight: 900,
                        textAlign: "center",
                        letterSpacing: "-3px",
                      }}
                    >
                      Connectivité Universelle.
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 18,
                        maxWidth: 700,
                        textAlign: "center",
                        marginTop: 20,
                        lineHeight: 1.7,
                      }}
                    >
                      Une infrastructure distribuée sur les 5 continents pour
                      une latence minimale et une fiabilité maximale. Touchez
                      vos clients où qu'ils soient.
                    </motion.p>
                  </Center>

                  {/* Stats row */}
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 16,
                      marginBottom: 48,
                    }}
                  >
                    {[
                      { value: "99.9%", label: "Uptime garanti", icon: <Shield size={20} /> },
                      { value: "<50ms", label: "Latence moyenne", icon: <Zap size={20} /> },
                      { value: "5", label: "Continents couverts", icon: <Globe size={20} /> },
                      { value: "2B+", label: "Utilisateurs WhatsApp", icon: <Users size={20} /> },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ y: -4, borderColor: "rgba(7,94,84,0.5)" }}
                        transition={{ duration: 0.25 }}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          padding: "24px 20px",
                          textAlign: "center",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div style={{ color: "#075e54", marginBottom: 12, display: "flex", justifyContent: "center" }}>
                          {stat.icon}
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8, fontWeight: 500 }}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Region nodes */}
                  <motion.div
                    variants={staggerFast}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 12,
                    }}
                  >
                    {[
                      { region: "Europe", flag: "🇪🇺", status: "Actif" },
                      { region: "Afrique", flag: "🌍", status: "Actif" },
                      { region: "Amérique", flag: "🌎", status: "Actif" },
                      { region: "Asie", flag: "🌏", status: "Actif" },
                      { region: "Moyen-Orient", flag: "🇦🇪", status: "Actif" },
                    ].map((node, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 40,
                          padding: "10px 20px",
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{node.flag}</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{node.region}</span>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#52c41a",
                            boxShadow: "0 0 8px rgba(82,196,26,0.5)",
                          }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>

              {/* How It Works Section */}
              <motion.section {...fadeInUp} className={styles.featureSection}>
                <div className={styles.container}>
                  <Center>
                    <div className={styles.tag}>Le Workflow</div>
                    <h2 className={styles.sectionTitle}>
                      Comment ça marche ?
                    </h2>
                  </Center>

                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    className={styles.stepsGrid}
                  >
                    <motion.div variants={fadeInUp} {...cardHover} className={styles.stepCard}>
                      <Center className="step-icon-container" style={{ marginBottom: 16 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="step-icon-inner"
                        >
                          <MessageSquare className="step-icon" />
                        </motion.div>
                      </Center>
                      <div className="step-num">01</div>
                      <h3>Connectez votre compte</h3>
                      <p>
                        Liez votre numéro WhatsApp Business en 30 secondes via
                        notre portail sécurisé hautement performant.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} {...cardHover} className={styles.stepCard}>
                      <Center className="step-icon-container" style={{ marginBottom: 16 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="step-icon-inner"
                        >
                          <Cpu className="step-icon" />
                        </motion.div>
                      </Center>
                      <div className="step-num">02</div>
                      <h3>Configurez vos agents</h3>
                      <p>
                        Définissez la personnalité et les connaissances de votre
                        IA. Choisissez parmi les meilleurs modèles au monde.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} {...cardHover} className={styles.stepCard}>
                      <Center className="step-icon-container" style={{ marginBottom: 16 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="step-icon-inner"
                        >
                          <Zap className="step-icon" />
                        </motion.div>
                      </Center>
                      <div className="step-num">03</div>
                      <h3>Connectez vos outils</h3>
                      <p>
                        Créez des automations puissantes qui connectent WhatsApp
                        à vos Google Sheets, CRM et bases de données en temps
                        réel.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Advanced Features Detailed Section */}
              <motion.section
                {...fadeInUp}
                className={styles.featureSection}
                style={{ borderTop: "1px solid #eee" }}
              >
                <div className={styles.container}>
                  <Center>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 40 }}>
                      Fonctionnalités Avancées
                    </h2>
                  </Center>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, width: "100%" }}
                  >
                    {[
                      { icon: <Layers size={24} />, title: "Mémoire Infinie", description: "Vos agents se souviennent de chaque interaction passée pour une personnalisation extrême." },
                      { icon: <Settings size={24} />, title: "Hooks Personnalisés", description: "Déclenchez des actions complexes dans vos systèmes externes en fonction des réponses." },
                      { icon: <Database size={24} />, title: "RAG Architecture", description: "Connectez vos fichiers, PDF et bases de données pour des réponses expertes et précises." },
                      { icon: <Search size={24} />, title: "Navigation Web", description: "Permettez à vos agents d'aller chercher des informations en temps réel sur internet." },
                    ].map((item, i) => (
                      <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }} transition={{ duration: 0.25 }} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid rgba(0,0,0,0.05)", cursor: "default" }}>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          style={{ width: 48, height: 48, borderRadius: 12, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 16 }}
                        >
                          {item.icon}
                        </motion.div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#000" }}>{item.title}</h3>
                        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{item.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>

              {/* Pricing Section */}
              <motion.section
                {...fadeInUp}
                id="pricing"
                className={styles.sectionWrapper}
                style={{ background: "#fff" }}
              >
                <div className={styles.container}>
                  <Center style={{ marginBottom: 64 }}>
                    <div className={styles.tagBrand}>
                      Tarification
                    </div>
                    <h2 className={styles.sectionTitle}>
                      Plans et tarifs
                    </h2>
                    <p className={styles.sectionDesc}>
                      Automatisez votre WhatsApp avec l'IA. Commencez gratuitement, <br />
                      puis choisissez le plan adapté à votre croissance.
                    </p>
                  </Center>

                  <Center style={{ marginTop: 24, marginBottom: 16 }}>
                    <div
                      style={{
                        background: '#f5f5f5',
                        padding: '4px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      }}
                    >
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        style={{
                          padding: '8px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: billingCycle === "monthly" ? '#085e54' : 'transparent',
                          color: billingCycle === "monthly" ? '#fff' : '#666',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: billingCycle === "monthly" ? '0 8px 16px rgba(8,94,84,0.2)' : 'none',
                        }}
                      >
                        Mensuel
                      </button>
                      <button
                        onClick={() => setBillingCycle("yearly")}
                        style={{
                          padding: '8px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: billingCycle === "yearly" ? '#085e54' : 'transparent',
                          color: billingCycle === "yearly" ? '#fff' : '#666',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: billingCycle === "yearly" ? '0 8px 16px rgba(8,94,84,0.2)' : 'none',
                        }}
                      >
                        Annuel
                        <Tag
                          style={{
                            background: billingCycle === "yearly" ? "#fff" : "rgba(82, 196, 26, 0.15)",
                            border: "none",
                            color: billingCycle === "yearly" ? "#085e54" : "#52c41a",
                            margin: 0,
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '0 8px',
                          }}
                        >
                          -17%
                        </Tag>
                      </button>
                    </div>
                  </Center>

                  {/* BYOK Toggle */}
                  <div style={{ width: '100%', background: '#f8f9fa', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(0,0,0,0.04)', marginBottom: 24 }}>
                    <Flexbox horizontal align="center" justify="space-between" style={{ flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#000' }}>Mode de tarification</h3>
                        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>
                          {pricingMode === 'byok'
                            ? 'BYOK : Utilisez vos propres clés API — Économisez jusqu\'à 51%'
                            : 'Crédits Connect inclus — ou passez en BYOK pour économiser (Pro+)'}
                        </p>
                      </div>
                      <Flexbox horizontal align="center" gap={12}>
                        <span style={{ fontWeight: pricingMode === 'standard' ? 700 : 400, fontSize: 14, color: '#000' }}>Crédits Connect</span>
                        <Switch
                          checked={pricingMode === 'byok'}
                          onChange={(checked: boolean) => setPricingMode(checked ? 'byok' : 'standard')}
                          style={{ backgroundColor: pricingMode === 'byok' ? '#52c41a' : '#a8a8a8' }}
                        />
                        <Flexbox horizontal align="center" gap={6}>
                          <span style={{ fontWeight: pricingMode === 'byok' ? 700 : 400, fontSize: 14, color: '#000' }}>BYOK</span>
                          <Tag color="success" style={{ margin: 0, fontSize: 11 }}>-50%</Tag>
                          <span style={{ fontSize: 11, color: '#999' }}>(Pro+)</span>
                        </Flexbox>
                      </Flexbox>
                    </Flexbox>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className={styles.pricingGrid}
                  >
                    {/* Plan Gratuit */}
                    <motion.div variants={fadeInUp} className={styles.pricingCard}>
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #52c41a, #389e0d)', borderColor: '#95de64', color: '#95de64' }}>
                          <Sparkles size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Gratuit</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Idéal pour tester la plateforme</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>Gratuit</div>
                        </div>
                        <Button type="default" block onClick={() => window.location.href = 'https://app.connect.wozif.com'} style={{ fontWeight: 600, height: 44, borderRadius: 12 }}>Commencer gratuitement</Button>
                      </Flexbox>
                      <Divider dashed style={{ margin: 0 }} />
                      <div className={styles.featureGroup}>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>1 agent WhatsApp</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>250 crédits/mois (~25 messages)</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Stockage 500 MB</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Branding "Powered by Connect"</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Support communauté</div></div>
                      </div>
                    </motion.div>

                    {/* Plan Starter */}
                    <motion.div variants={fadeInUp} className={styles.pricingCard}>
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #1890ff, #096dd9)', borderColor: '#69c0ff', color: '#69c0ff' }}>
                          <Zap size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Starter</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Pour petites entreprises et freelances</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>{billingCycle === 'yearly' ? '24€' : '29€'}</div>
                          <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/mois</div>
                          {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>Facturé 290€/an</div>}
                        </div>
                        <Button type="primary" block loading={isLoading('starter')} onClick={() => checkout('starter', billingCycle as 'monthly' | 'yearly')} style={{ fontWeight: 700, height: 44, borderRadius: 12, background: '#075e54', border: 'none' }}>Commencer</Button>
                      </Flexbox>
                      <Divider dashed style={{ margin: 0 }} />
                      <div className={styles.featureGroup}>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>3 agents WhatsApp</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>5,000,000 crédits/mois</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Tous les modèles IA (GPT-4o, Claude, DeepSeek)</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Stockage 5 GB</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Support email</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Crédits supplémentaires : 15€/10M</div></div>
                      </div>
                    </motion.div>

                    {/* Plan Pro */}
                    <motion.div variants={fadeInUp} className={cx(styles.pricingCard, styles.featuredCard)} style={{ position: 'relative' }}>
                      {pricingMode === 'byok' ? (
                        <Tag color="success" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>Économisez 51%</Tag>
                      ) : (
                        <Tag style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#075e54', border: 'none', color: '#fff', zIndex: 2 }}>Populaire</Tag>
                      )}
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #075e54, #128c7e)', borderColor: '#95de64', color: '#95de64' }}>
                          <Atom size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000', display: 'flex', alignItems: 'center', gap: 8 }}>
                            Pro
                            <Tag color="processing" style={{ borderRadius: 6, fontSize: 10, fontWeight: 700 }}>3 jours d'essai</Tag>
                          </h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Pour PME et agences en croissance</p>
                        </div>
                        <div>
                          {pricingMode === 'byok' ? (
                            <>
                              <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>{billingCycle === 'yearly' ? '33€' : '39€'}</div>
                              <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/mois <Tag color="success" style={{ margin: 0, fontSize: 10 }}>BYOK</Tag></div>
                              {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>Facturé 390€/an</div>}
                            </>
                          ) : (
                            <>
                              <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>{billingCycle === 'yearly' ? '66€' : '79€'}</div>
                              <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/mois</div>
                              {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>Facturé 790€/an</div>}
                            </>
                          )}
                        </div>
                        <Button type="primary" block loading={isLoading('pro')} onClick={() => checkout('pro', billingCycle as 'monthly' | 'yearly')} style={{ fontWeight: 700, height: 48, borderRadius: 14, background: '#000', color: '#fff', border: 'none' }}>Essayer 3 jours gratuit</Button>
                      </Flexbox>
                      <Divider dashed style={{ margin: 0 }} />
                      <div className={styles.featureGroup}>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>10 agents WhatsApp</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>{pricingMode === 'byok' ? 'Crédits illimités (vos clés API)' : '40M crédits (~56,000 messages)'}</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Tous les modèles IA (GPT-4o, Claude, DeepSeek)</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Stockage 20 GB</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Connecteurs CRM natifs</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Support prioritaire 24/7</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Crédits supplémentaires : 12€/10M</div></div>
                      </div>
                    </motion.div>

                    {/* Plan Business */}
                    <motion.div variants={fadeInUp} className={styles.pricingCard} style={{ position: 'relative' }}>
                      {pricingMode === 'byok' && (
                        <Tag color="success" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>Économisez 50%</Tag>
                      )}
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #722ed1, #531dab)', borderColor: '#b37feb', color: '#b37feb' }}>
                          <CreditCard size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Business</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Pour grandes entreprises</p>
                        </div>
                        <div>
                          {pricingMode === 'byok' ? (
                            <>
                              <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>{billingCycle === 'yearly' ? '83€' : '99€'}</div>
                              <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/mois <Tag color="success" style={{ margin: 0, fontSize: 10 }}>BYOK</Tag></div>
                              {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>Facturé 990€/an</div>}
                            </>
                          ) : (
                            <>
                              <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>{billingCycle === 'yearly' ? '166€' : '199€'}</div>
                              <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/mois</div>
                              {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>Facturé 1 990€/an</div>}
                            </>
                          )}
                        </div>
                        <Button type="primary" block loading={isLoading('business')} onClick={() => checkout('business', billingCycle as 'monthly' | 'yearly')} style={{ fontWeight: 700, height: 44, borderRadius: 12, background: '#075e54', border: 'none' }}>Commencer</Button>
                      </Flexbox>
                      <Divider dashed style={{ margin: 0 }} />
                      <div className={styles.featureGroup}>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>50 agents WhatsApp</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>{pricingMode === 'byok' ? 'Crédits illimités (vos clés API)' : '150M crédits'}</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Tous les modèles IA + priorité</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Stockage 100 GB</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Multi-utilisateurs (5 sièges inclus)</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>SSO & Logs d'audit</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Account Manager dédié</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Crédits supplémentaires : 10€/10M</div></div>
                      </div>
                    </motion.div>

                    {/* Plan Enterprise */}
                    <motion.div variants={fadeInUp} className={styles.pricingCard}>
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #fa8c16, #d46b08)', borderColor: '#ffc53d', color: '#ffc53d' }}>
                          <Sparkles size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Enterprise</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Solution sur mesure pour corporations</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>Sur devis</div>
                        </div>
                        <Button type="primary" block onClick={() => window.open('mailto:sales@connect.wozif.com?subject=Demande Enterprise', '_blank')} style={{ fontWeight: 700, height: 44, borderRadius: 12, background: '#075e54', border: 'none' }}>Contacter les ventes</Button>
                      </Flexbox>
                      <Divider dashed style={{ margin: 0 }} />
                      <div className={styles.featureGroup}>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Agents WhatsApp illimités</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Crédits personnalisés</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Infrastructure dédiée</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Stockage illimité</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Multi-utilisateurs illimités</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>SLA 99.9%</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Onboarding personnalisé</div></div>
                        <div className={styles.featureItem}><CheckCircle2 size={16} fill="#52c41a" color="#fff" /><div style={{ color: '#000' }}>Support dédié 24/7</div></div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Premium CTA Banner */}
              <motion.section
                {...fadeInUp}
                style={{
                  width: "calc(100% - 24px)",
                  maxWidth: 1440,
                  margin: "20px auto",
                  padding: "60px 24px",
                  background: "#000",
                  borderRadius: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Animated gradient orbs */}
                <motion.div
                  animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -20, 10, 0],
                    scale: [1, 1.2, 0.9, 1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-10%",
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(7,94,84,0.3) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  animate={{
                    x: [0, -20, 30, 0],
                    y: [0, 15, -25, 0],
                    scale: [1, 0.9, 1.1, 1],
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                  style={{
                    position: "absolute",
                    bottom: "-20%",
                    left: "-10%",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(37,211,102,0.2) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                  }}
                />
                {/* Grid pattern */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 16px",
                      background: "rgba(37,211,102,0.1)",
                      border: "1px solid rgba(37,211,102,0.2)",
                      borderRadius: 100,
                      marginBottom: 24,
                    }}>
                      <Rocket size={14} color="#25d366" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#25d366", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Commencez maintenant
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                      fontSize: "clamp(28px, 5vw, 48px)",
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "-2px",
                      lineHeight: 1.1,
                      marginBottom: 16,
                    }}
                  >
                    Prêt à transformer votre{" "}
                    <span style={{
                      background: "linear-gradient(135deg, #25d366, #075e54, #128c7e)",
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      WhatsApp
                    </span>
                    {" "}?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      fontSize: 16,
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.7,
                      marginBottom: 36,
                      maxWidth: 500,
                      margin: "0 auto 36px",
                    }}
                  >
                    Rejoignez des centaines d'entreprises qui automatisent leur service client
                    avec l'IA la plus avancée du marché.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<Rocket size={18} />}
                      onClick={() => (window.location.href = "https://app.connect.wozif.com")}
                      style={{
                        height: 52,
                        paddingInline: 32,
                        borderRadius: 16,
                        fontWeight: 800,
                        fontSize: 16,
                        background: "#075e54",
                        border: "none",
                        boxShadow: "0 12px 32px rgba(7,94,84,0.4)",
                      }}
                    >
                      Essai gratuit
                    </Button>
                    <Button
                      size="large"
                      icon={<MessageCircle size={18} />}
                      onClick={() => (window.location.href = "https://calendly.com")}
                      style={{
                        height: 52,
                        paddingInline: 32,
                        borderRadius: 16,
                        fontWeight: 800,
                        fontSize: 16,
                        background: "transparent",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      Planifier une démo
                    </Button>
                  </motion.div>

                  {/* Trust indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 24,
                      marginTop: 32,
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      { icon: <Shield size={14} />, text: "GDPR Compliant" },
                      { icon: <Zap size={14} />, text: "Setup en 2 min" },
                      { icon: <CheckCircle2 size={14} />, text: "Sans engagement" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600 }}>
                        {item.icon}
                        {item.text}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>

              {/* Desktop App Download Section */}
              <motion.section
                {...fadeInUp}
                id="desktop"
                style={{
                  width: "calc(100% - 24px)",
                  maxWidth: 1440,
                  margin: "20px auto",
                  padding: "60px 24px",
                  background: "linear-gradient(135deg, #f8fffe 0%, #f0faf8 50%, #e8f5f1 100%)",
                  borderRadius: 32,
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(7,94,84,0.08)",
                }}
              >
                {/* Decorative elements */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    top: -80,
                    right: -80,
                    width: 250,
                    height: 250,
                    borderRadius: "50%",
                    border: "1px dashed rgba(7,94,84,0.08)",
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    bottom: -60,
                    left: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    border: "1px dashed rgba(7,94,84,0.06)",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 16px",
                      background: "rgba(7,94,84,0.08)",
                      border: "1px solid rgba(7,94,84,0.12)",
                      borderRadius: 100,
                      marginBottom: 24,
                    }}>
                      <Monitor size={14} color="#075e54" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#075e54", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Application Desktop
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                      fontSize: "clamp(28px, 5vw, 44px)",
                      fontWeight: 900,
                      color: "#000",
                      letterSpacing: "-1.5px",
                      lineHeight: 1.15,
                      marginBottom: 16,
                    }}
                  >
                    Connect sur votre{" "}
                    <span style={{
                      background: "linear-gradient(135deg, #075e54, #25d366)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      bureau
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                      fontSize: 16,
                      color: "#666",
                      lineHeight: 1.7,
                      maxWidth: 550,
                      margin: "0 auto 40px",
                    }}
                  >
                    Téléchargez l'application native pour une expérience plus rapide,
                    des notifications en temps réel et un accès hors ligne à vos agents IA.
                  </motion.p>

                  {/* Download Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                      maxWidth: 750,
                      margin: "0 auto",
                    }}
                  >
                    {/* macOS */}
                    <motion.div
                      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(7,94,84,0.12)" }}
                      transition={{ duration: 0.25 }}
                      onClick={() => window.open("https://github.com/nocodeci/gnata/releases/latest", "_blank")}
                      style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "28px 24px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #333, #000)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Apple size={28} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>macOS</div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Apple Silicon & Intel</div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 16px",
                        background: "#075e54",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                      }}>
                        <Download size={14} />
                        Télécharger .dmg
                      </div>
                    </motion.div>

                    {/* Windows */}
                    <motion.div
                      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(7,94,84,0.12)" }}
                      transition={{ duration: 0.25 }}
                      onClick={() => window.open("https://github.com/nocodeci/gnata/releases/latest", "_blank")}
                      style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "28px 24px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #0078d4, #005a9e)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Monitor size={28} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Windows</div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Windows 10 & 11</div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 16px",
                        background: "#075e54",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                      }}>
                        <Download size={14} />
                        Télécharger .exe
                      </div>
                    </motion.div>

                    {/* Linux */}
                    <motion.div
                      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(7,94,84,0.12)" }}
                      transition={{ duration: 0.25 }}
                      onClick={() => window.open("https://github.com/nocodeci/gnata/releases/latest", "_blank")}
                      style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "28px 24px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #e95420, #c7411b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Laptop size={28} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Linux</div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>AppImage, deb, rpm</div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 16px",
                        background: "#075e54",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                      }}>
                        <Download size={14} />
                        Télécharger
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Features list */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 24,
                      marginTop: 32,
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      { icon: <Zap size={14} />, text: "Démarrage rapide" },
                      { icon: <Shield size={14} />, text: "Notifications natives" },
                      { icon: <Monitor size={14} />, text: "Mises à jour auto" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13, fontWeight: 600 }}>
                        <span style={{ color: "#075e54" }}>{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>

              {/* FAQ Section */}
              <motion.section {...fadeInUp} className={styles.faqSection}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 60 }}>
                    <motion.h2
                      {...scaleIn}
                      style={{
                        fontSize: 40,
                        fontWeight: 900,
                        letterSpacing: "-1px",
                      }}
                    >
                      Questions Fréquentes
                    </motion.h2>
                  </Center>
                  <motion.div
                    variants={staggerFast}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={fadeInUp} className={styles.faqItem}>
                      <h3>C'est quoi l'utilité des crédits ?</h3>
                      <p>
                        Les crédits existent car chaque message généré par l'agent
                        a un coût en termes de frais serveur et d'IA. C'est comme
                        recharger des unités sur un mobile : cela permet un
                        système flexible pay-as-you-go. Chacun paye uniquement
                        selon son usage.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={styles.faqItem}>
                      <h3>
                        L'agent IA fonctionne-t-il sur mon propre numéro WhatsApp
                        ?
                      </h3>
                      <p>
                        Oui ! Vous pouvez connecter votre propre numéro en moins
                        d'une minute simplement en scannant un QR code.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={styles.faqItem}>
                      <h3>Puis-je tester gratuitement ?</h3>
                      <p>
                        Oui, vous pouvez explorer toutes les fonctionnalités de la
                        plateforme gratuitement. Cependant, pour connecter votre
                        compte WhatsApp et utiliser l'assistant en production,
                        vous devrez souscrire à l'un de nos plans.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={styles.faqItem}>
                      <h3>Est-ce que mon numéro sera banni ?</h3>
                      <p>
                        Il est impossible de se faire bannir avec Connect. Notre
                        technologie génère des messages original et naturels à
                        chaque fois, respectant strictement les règles de
                        WhatsApp.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={styles.faqItem}>
                      <h3>Quelles langues sont supportées ?</h3>
                      <p>
                        Nous supportons plus de 133 langues. Connect peut
                        converser naturellement avec vos clients dans le monde
                        entier.
                      </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={styles.faqItem}>
                      <h3>Mes données sont-elles sécurisées ?</h3>
                      <p>
                        Oui, nous sommes entièrement conformes à la GDPR. Vos
                        données sont privées et ne sont jamais utilisées pour
                        entraîner des modèles IA publics.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>



            </div>
          </motion.main >
        )}
      </AnimatePresence >
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
        strategy="afterInteractive"
      />
    </>
  );
});

export default LandingPage;
