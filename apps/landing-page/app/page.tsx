"use client";

import Script from "next/script";
import {
  Header,
  Footer,
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
    gap: 10px;
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;

    @media (min-width: 768px) {
      margin-top: 80px;
    }
    max-width: 1400px;
    position: relative;
    padding-block: 10px;
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
      padding: 6px 0;

      @media (min-width: 768px) {
        padding: 10px 0;
      }
    }

    .marquee-content {
      display: flex;
      gap: 6px;
      padding-left: 6px;
      animation: marqueeForward 15s linear infinite;
      white-space: nowrap;
      will-change: transform;

      @media (min-width: 480px) {
        gap: 8px;
        padding-left: 8px;
      }

      @media (min-width: 768px) {
        gap: 12px;
        padding-left: 12px;
      }

      &.reverse {
        animation: marqueeReverse 15s linear infinite;
      }

      &:hover {
        animation-play-state: paused;
      }
    }

    @keyframes marqueeForward {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @keyframes marqueeReverse {
      0% {
        transform: translateX(-50%);
      }
      100% {
        transform: translateX(0);
      }
    }

    .logo-card {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.8);
      background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.6),
        rgba(255, 255, 255, 0.3)
      );
      padding: 8px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      flex-shrink: 0;

      @media (min-width: 480px) {
        width: 40px;
        height: 40px;
        padding: 10px;
        border-radius: 10px;
      }

      @media (min-width: 768px) {
        width: 56px;
        height: 56px;
        padding: 14px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      @media (min-width: 1024px) {
        width: 70px;
        height: 70px;
        padding: 16px;
      }

      &:hover {
        transform: scale(1.1);
        border-color: rgb(70, 71, 77);
        background: rgb(33, 34, 36);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
    background: #000;

    video {
      width: 100%;
      display: block;
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
        rgba(255, 255, 255, 0.1) 0%,
        transparent 100%
      );
      opacity: 0;
      transition: opacity 0.5s ease;
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

    @media (min-width: 768px) {
      border-radius: 32px;
      padding: 32px;
    }

    &:hover {
      background: #ffffff;
      border-color: #075e54;
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.08);
      transform: translateY(-8px) scale(1.01);
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
    animation: ${float} 10s infinite ease -in -out;
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
      color: #075e54;
      opacity: 0.1;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    margin-bottom: 48px;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,
  pricingCard: css`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    text-align: left;
    &:hover {
      border-color: rgba(0, 0, 0, 0.1);
      background: #fff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
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
    background: #ece5dd;
    border-radius: 24px;
    border: 1px solid rgba(7, 94, 84, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;

    @media (min-width: 768px) {
      border-radius: 48px;
    }
  `,
  footerNewsletter: css`
    width: 100%;
    padding: 32px 16px;
    border-bottom: 1px solid rgba(7, 94, 84, 0.1);

    @media (min-width: 768px) {
      padding: 48px 24px;
    }

    h2 {
      font-size: 20px;
      line-height: 1.3;
      @media (min-width: 768px) {
        font-size: 24px;
      }
    }

    .newsletter-form {
      flex: 1 1 100%;
      @media (min-width: 768px) {
        flex: 1 1 350px;
      }
    }
  `,
  footerMain: css`
    width: 100%;
    padding: 40px 16px;
    max-width: 1200px;
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 64px 24px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      width: 100%;

      @media (min-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 48px;
      }
    }
  `,
  footerBottom: css`
    width: 100%;
    padding: 24px 16px;
    border-top: 1px solid rgba(7, 94, 84, 0.1);
    max-width: 1200px;
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 32px 24px;
    }
  `,
}));

const LandingPage = memo(() => {
  const { styles, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const { checkout, isLoading } = useStripeCheckout();
  useEffect(() => {
    setMounted(true);
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
                      <Button
                        type="primary"
                        size="large"
                        icon={<Rocket size={20} />}
                        onClick={() =>
                          (window.location.href = "https://app.connect.wozif.com")
                        }
                        className="h-13 sm:h-14 lg:h-16 px-10 sm:px-10 lg:px-12 text-base sm:text-lg lg:text-xl font-black rounded-xl sm:rounded-2xl lg:rounded-3xl !bg-[#085e54] hover:!bg-[#085e54]/90 !text-white border-none transition-all duration-300 shadow-[0_12px_24px_rgba(8,94,84,0.25)] sm:shadow-[0_16px_32px_rgba(8,94,84,0.28)] lg:shadow-[0_20px_40px_rgba(8,94,84,0.3)] hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                      >
                        Commencer maintenant
                      </Button>
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

              <section className={styles.sectionWrapper}>
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

                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <DemoPreview />
                  </motion.div>
                </div>
              </section>


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

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, width: "100%" }}>
                    {[
                      { icon: <WhatsAppLogo size={24} color="#fff" />, title: "Chat Lobe-Style", description: "Une interface conversationnelle premium pour gérer vos échanges WhatsApp et vos agents IA." },
                      { icon: <GoogleSheetsLogo size={24} />, title: "Sync Google Sheets", description: "Enregistrez automatiquement les données de vos conversations dans vos tableurs en temps réel." },
                      { icon: <Zap size={24} />, title: "Flows Ultra-Rapides", description: "Des automatisations qui s'exécutent instantanément entre WhatsApp, vos CRM et vos outils." },
                      { icon: <ChromeLogo size={24} />, title: "Multi-Device Support", description: "Pilotez votre instance Connect depuis votre ordinateur ou votre mobile avec la même fluidité." },
                    ].map((item, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid rgba(0,0,0,0.05)" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 16 }}>
                          {item.icon}
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#000" }}>{item.title}</h3>
                        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{item.description}</p>
                      </div>
                    ))}
                  </div>

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
                      <Sparkles size={14} /> Comment ça marche
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

              {/* Agent Builder Section */}
              <motion.section
                {...fadeInUp}
                id="agent-builder"
                style={{
                  width: "100%",
                  padding: "80px 0",
                  background: "linear-gradient(180deg, #fff 0%, #f8faf9 100%)",
                }}
              >
                <div className={styles.container}>
                  <Center style={{ marginBottom: 48 }}>
                    <div className={styles.tagBrand}>
                      <Wand2 size={14} /> Créateur d'Agents
                    </div>
                    <h2 className={styles.sectionTitle}>
                      Construisez votre agent en quelques clics.
                    </h2>
                    <p className={styles.sectionDesc}>
                      Personnalisez les compétences de votre assistant IA et déployez-le instantanément sur WhatsApp.
                    </p>
                  </Center>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <AgentBuilderPreview styles={styles} cx={cx} />
                  </motion.div>
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

                  <div className={styles.useCaseScroll}>
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
                      <div key={idx} className={styles.useCaseCard}>
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
                      </div>
                    ))}
                  </div>
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

                    <div style={{ flex: 1, minWidth: 320 }}>
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
                    </div>
                  </Flexbox>
                </div>
              </motion.section>

              {/* Global Connectivity Section */}
              <motion.section
                {...fadeInUp}
                style={{
                  background: "#000",
                  padding: "120px 24px",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className={styles.container}>
                  <Center style={{ marginBottom: 80 }}>
                    <div
                      className={styles.tag}
                      style={{ background: "#075e54", color: "#fff" }}
                    >
                      Réseau Mondial
                    </div>
                    <h2
                      style={{
                        color: "#fff",
                        fontSize: "clamp(32px, 5vw, 64px)",
                        fontWeight: 900,
                        textAlign: "center",
                        letterSpacing: "-3px",
                      }}
                    >
                      Connectivité Universelle.
                    </h2>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 20,
                        maxWidth: 800,
                        textAlign: "center",
                        marginTop: 24,
                      }}
                    >
                      Une infra-structure distribuée sur les 5 continents pour
                      une latence minimale et une fiabilité maximale. Touchez
                      vos clients où qu'ils soient.
                    </p>
                  </Center>
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

                  <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
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
                    </div>
                    <div className={styles.stepCard}>
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
                    </div>
                    <div className={styles.stepCard}>
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
                    </div>
                  </div>
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, width: "100%" }}>
                    {[
                      { icon: <Layers size={24} />, title: "Mémoire Infinie", description: "Vos agents se souviennent de chaque interaction passée pour une personnalisation extrême." },
                      { icon: <Settings size={24} />, title: "Hooks Personnalisés", description: "Déclenchez des actions complexes dans vos systèmes externes en fonction des réponses." },
                      { icon: <Database size={24} />, title: "RAG Architecture", description: "Connectez vos fichiers, PDF et bases de données pour des réponses expertes et précises." },
                      { icon: <Search size={24} />, title: "Navigation Web", description: "Permettez à vos agents d'aller chercher des informations en temps réel sur internet." },
                    ].map((item, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid rgba(0,0,0,0.05)" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 16 }}>
                          {item.icon}
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#000" }}>{item.title}</h3>
                        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
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
                      Commencez un essai gratuit de GPT / Claude / Gemini
                      500,000 Credits. <br />
                      Aucune carte de crédit requise.
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
                          -23%
                        </Tag>
                      </button>
                    </div>
                  </Center>

                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className={styles.pricingGrid}
                  >
                    {/* Version de base */}
                    <motion.div
                      variants={fadeInUp}
                      className={styles.pricingCard}
                    >
                      <Flexbox gap={16}>
                        <div
                          className={styles.planIcon}
                          style={{
                            background:
                              "linear-gradient(45deg, #c57948, #803718)",
                            borderColor: "#ffc385",
                            color: "#ffc385",
                          }}
                        >
                          <Sparkles size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              margin: 0,
                              color: "#000",
                            }}
                          >
                            Version de base
                          </h2>
                          <p
                            style={{
                              fontSize: 13,
                              opacity: 0.6,
                              margin: 0,
                              color: "#000",
                            }}
                          >
                            Pour une utilisation plus légère et occasionnelle
                          </p>
                        </div>
                        <div>
                          <div className={styles.priceValue}>
                            {billingCycle === "yearly" ? "15" : "19"}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              opacity: 0.5,
                              color: "#000",
                            }}
                          >
                            / Par{" "}
                            {billingCycle === "yearly"
                              ? "mois (Paiement annuel)"
                              : "mois"}
                          </div>
                        </div>
                        {billingCycle === "yearly" && (
                          <Flexbox horizontal gap={4} align="center">
                            <span
                              style={{
                                fontSize: 12,
                                opacity: 0.5,
                                color: "#000",
                              }}
                            >
                              $180 / Par an
                            </span>
                            <Tag
                              color="success"
                              style={{
                                margin: 0,
                                fontSize: 11,
                                background: "rgba(82, 196, 26, 0.1)",
                                border: "none",
                                color: "#52c41a",
                              }}
                            >
                              Remise de 21%
                            </Tag>
                          </Flexbox>
                        )}
                        <Button
                          type="primary"
                          block
                          loading={isLoading("base")}
                          onClick={() => checkout("base", billingCycle as "monthly" | "yearly")}
                          style={{
                            fontWeight: 500,
                            height: 40,
                            borderRadius: 8,
                            background: "var(--brand-primary)",
                            border: "none",
                          }}
                        >
                          Commencer
                        </Button>
                      </Flexbox>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div
                          style={{
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 4,
                            color: "#000",
                          }}
                        >
                          Calcul des crédits{" "}
                          <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#000",
                          }}
                        >
                          10,000,000 / Par mois
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              GPT-4o mini{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 14,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              DeepSeek R1{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 3,800 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              Claude 3.5 Sonnet New{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 600 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              Gemini 1.5 Flash{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 14,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ opacity: 0.8, color: "#000" }}>
                            Voir plus de modèles...
                          </div>
                        </div>
                      </div>

                      <div className={cx(styles.expandedContent, expandedPlans['base'] && 'expanded')}>
                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div
                            style={{
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginBottom: 4,
                              color: "#000",
                            }}
                          >
                            Fichiers & Connaissance{" "}
                            <CircleHelp size={14} style={{ opacity: 0.5 }} />
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <Flexbox>
                              <div style={{ fontWeight: 600, color: "#000" }}>
                                Stockage de fichiers
                              </div>
                              <div style={{ fontSize: 14, color: "#000" }}>
                                2.0 GB
                              </div>
                            </Flexbox>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <Flexbox>
                              <div style={{ fontWeight: 600, color: "#000" }}>
                                Stockage de vecteurs
                              </div>
                              <div style={{ fontSize: 14, color: "#000" }}>
                                10,000 entrées{" "}
                                <span style={{ opacity: 0.5, fontSize: 12 }}>
                                  (≈ 100MB)
                                </span>
                              </div>
                            </Flexbox>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Fournisseurs
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Utilisez vos propres clés API
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Demandes de messages illimitées
                            </div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Services cloud
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Historique des conversations illimité
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Synchronisation cloud globale
                            </div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Fonctionnalités avancées
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Points forts du Marché d’agents
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Compétences premium
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>Recherche web</div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Support client
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Support par e-mail prioritaire
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Achat de forfaits de crédits supp.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.showMoreBtn} onClick={() => togglePlan('base')}>
                        {expandedPlans['base'] ? (
                          <>Réduire <ChevronRight size={16} style={{ transform: 'rotate(-90deg)' }} /></>
                        ) : (
                          <>Voir plus de détails <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} /></>
                        )}
                      </div>
                    </motion.div>

                    {/* Premium */}
                    <motion.div
                      variants={fadeInUp}
                      className={cx(styles.pricingCard, styles.featuredCard)}
                    >
                      <Flexbox gap={16}>
                        <div
                          className={styles.planIcon}
                          style={{
                            background:
                              "linear-gradient(45deg, #a5b4c2, #606e7b)",
                            borderColor: "#fcfdff",
                            color: "#fcfdff",
                          }}
                        >
                          <Zap size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              margin: 0,
                              color: "#000",
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8
                            }}
                          >
                            Premium
                            <Tag color="processing" style={{ borderRadius: 6, fontSize: 10, fontWeight: 700 }}>3 jours d'essai</Tag>
                          </h2>
                          <p
                            style={{
                              fontSize: 13,
                              opacity: 0.6,
                              margin: 0,
                              color: "#000",
                            }}
                          >
                            Essai gratuit de 3 jours, puis facturation automatique.
                          </p>
                        </div>
                        <div>
                          <div className={styles.priceValue}>
                            {billingCycle === "yearly" ? "39" : "50"}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              opacity: 0.5,
                              color: "#000",
                            }}
                          >
                            / Par{" "}
                            {billingCycle === "yearly"
                              ? "mois (Paiement annuel)"
                              : "mois"}
                          </div>
                        </div>
                        {billingCycle === "yearly" && (
                          <Flexbox horizontal gap={4} align="center">
                            <span
                              style={{
                                fontSize: 12,
                                opacity: 0.5,
                                color: "#000",
                              }}
                            >
                              $468 / Par an
                            </span>
                            <Tag
                              color="success"
                              style={{
                                margin: 0,
                                fontSize: 11,
                                background: "rgba(82, 196, 26, 0.1)",
                                border: "none",
                                color: "#52c41a",
                              }}
                            >
                              Remise de 22%
                            </Tag>
                          </Flexbox>
                        )}
                        <Button
                          type="primary"
                          block
                          loading={isLoading("premium")}
                          onClick={() => checkout("premium", billingCycle as "monthly" | "yearly")}
                          style={{
                            fontWeight: 500,
                            height: 40,
                            borderRadius: 8,
                            background: "#075e54",
                            border: "none",
                          }}
                        >
                          Essayer 3 jours gratuit
                        </Button>
                      </Flexbox>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div
                          style={{
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 4,
                            color: "#000",
                          }}
                        >
                          Calcul des crédits{" "}
                          <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#000",
                          }}
                        >
                          40,000,000 / Par mois
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              GPT-4o mini{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 56,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              DeepSeek R1{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 15,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              Claude 3.5 Sonnet New{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 2,400 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              Gemini 1.5 Flash{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 56,000 messages
                            </div>
                          </Flexbox>
                        </div>
                      </div>

                      <div className={cx(styles.expandedContent, expandedPlans['premium'] && 'expanded')}>
                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div
                            style={{
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginBottom: 4,
                              color: "#000",
                            }}
                          >
                            Fichiers & Connaissance{" "}
                            <CircleHelp size={14} style={{ opacity: 0.5 }} />
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <Flexbox>
                              <div style={{ fontWeight: 600, color: "#000" }}>
                                Stockage de fichiers
                              </div>
                              <div style={{ fontSize: 14, color: "#000" }}>
                                10.0 GB
                              </div>
                            </Flexbox>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <Flexbox>
                              <div style={{ fontWeight: 600, color: "#000" }}>
                                Stockage de vecteurs
                              </div>
                              <div style={{ fontSize: 14, color: "#000" }}>
                                50,000 entrées{" "}
                                <span style={{ opacity: 0.5, fontSize: 12 }}>
                                  (≈ 500MB)
                                </span>
                              </div>
                            </Flexbox>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Fournisseurs
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Utilisez vos propres clés API
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Demandes de messages illimitées
                            </div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Services cloud
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Historique des conversations illimité
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Synchronisation cloud globale
                            </div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Fonctionnalités avancées
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Points forts du Marché d’agents
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Compétences premium
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>Recherche web</div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Support client
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Support par e-mail prioritaire
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Achat de forfaits de crédits supp.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.showMoreBtn} onClick={() => togglePlan('premium')}>
                        {expandedPlans['premium'] ? (
                          <>Réduire <ChevronRight size={16} style={{ transform: 'rotate(-90deg)' }} /></>
                        ) : (
                          <>Voir plus de détails <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} /></>
                        )}
                      </div>
                    </motion.div>

                    {/* Ultimate */}
                    <motion.div
                      variants={fadeInUp}
                      className={styles.pricingCard}
                    >
                      <Flexbox gap={16}>
                        <div
                          className={styles.planIcon}
                          style={{
                            background:
                              "linear-gradient(45deg, #f7a82f, #bb7227)",
                            borderColor: "#fcfa6e",
                            color: "#fcfa6e",
                          }}
                        >
                          <Atom size={18} />
                        </div>
                        <div>
                          <h2
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              margin: 0,
                              color: "#000",
                            }}
                          >
                            Ultimate
                          </h2>
                          <p
                            style={{
                              fontSize: 13,
                              opacity: 0.6,
                              margin: 0,
                              color: "#000",
                            }}
                          >
                            Pour une utilisation intensive
                          </p>
                        </div>
                        <div>
                          <div className={styles.priceValue}>
                            {billingCycle === "yearly" ? "99" : "120"}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              opacity: 0.5,
                              color: "#000",
                            }}
                          >
                            / Par{" "}
                            {billingCycle === "yearly"
                              ? "mois (Paiement annuel)"
                              : "mois"}
                          </div>
                        </div>
                        {billingCycle === "yearly" && (
                          <Flexbox horizontal gap={4} align="center">
                            <span
                              style={{
                                fontSize: 12,
                                opacity: 0.5,
                                color: "#000",
                              }}
                            >
                              $1,188 / Par an
                            </span>
                            <Tag
                              color="success"
                              style={{
                                margin: 0,
                                fontSize: 11,
                                background: "rgba(82, 196, 26, 0.1)",
                                border: "none",
                                color: "#52c41a",
                              }}
                            >
                              Remise de 18%
                            </Tag>
                          </Flexbox>
                        )}
                        <Button
                          type="primary"
                          block
                          loading={isLoading("ultimate")}
                          onClick={() => checkout("ultimate", billingCycle as "monthly" | "yearly")}
                          style={{
                            fontWeight: 500,
                            height: 40,
                            borderRadius: 8,
                            background: "#075e54",
                            border: "none",
                          }}
                        >
                          Commencer
                        </Button>
                      </Flexbox>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div
                          style={{
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 4,
                            color: "#000",
                          }}
                        >
                          Calcul des crédits{" "}
                          <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#000",
                          }}
                        >
                          100,000,000 / Par mois
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              GPT-4o mini{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 140,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              DeepSeek R1{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 38,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              Claude 3.5 Sonnet New{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 6,000 messages
                            </div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#000",
                              }}
                            >
                              Gemini 1.5 Flash{" "}
                              <CircleHelp size={12} style={{ opacity: 0.5 }} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.6,
                                color: "#000",
                              }}
                            >
                              Environ 140,000 messages
                            </div>
                          </Flexbox>
                        </div>
                      </div>

                      <div className={cx(styles.expandedContent, expandedPlans['ultimate'] && 'expanded')}>
                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div
                            style={{
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginBottom: 4,
                              color: "#000",
                            }}
                          >
                            Fichiers & Connaissance{" "}
                            <CircleHelp size={14} style={{ opacity: 0.5 }} />
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <Flexbox>
                              <div style={{ fontWeight: 600, color: "#000" }}>
                                Stockage de fichiers
                              </div>
                              <div style={{ fontSize: 14, color: "#000" }}>
                                50.0 GB
                              </div>
                            </Flexbox>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <Flexbox>
                              <div style={{ fontWeight: 600, color: "#000" }}>
                                Stockage de vecteurs
                              </div>
                              <div style={{ fontSize: 14, color: "#000" }}>
                                Illimité{" "}
                                <span style={{ opacity: 0.5, fontSize: 12 }}>

                                </span>
                              </div>
                            </Flexbox>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Fournisseurs
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Utilisez vos propres clés API
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Demandes de messages illimitées
                            </div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Services cloud
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Historique des conversations illimité
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Synchronisation cloud globale
                            </div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Fonctionnalités avancées
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Points forts du Marché d’agents
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Compétences premium
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>Recherche web</div>
                          </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                          <div style={{ fontWeight: 600, color: "#000" }}>
                            Support client
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Support par e-mail prioritaire
                            </div>
                          </div>
                          <div className={styles.featureItem}>
                            <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                            <div style={{ color: "#000" }}>
                              Achat de forfaits de crédits supp.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.showMoreBtn} onClick={() => togglePlan('ultimate')}>
                        {expandedPlans['ultimate'] ? (
                          <>Réduire <ChevronRight size={16} style={{ transform: 'rotate(-90deg)' }} /></>
                        ) : (
                          <>Voir plus de détails <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} /></>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>

              {/* FAQ Section */}
              <motion.section {...fadeInUp} className={styles.faqSection}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 60 }}>
                    <h2
                      style={{
                        fontSize: 40,
                        fontWeight: 900,
                        letterSpacing: "-1px",
                      }}
                    >
                      Questions Fréquentes
                    </h2>
                  </Center>
                  <div className={styles.faqItem}>
                    <h3>C'est quoi l'utilité des crédits ?</h3>
                    <p>
                      Les crédits existent car chaque message généré par l'agent
                      a un coût en termes de frais serveur et d'IA. C'est comme
                      recharger des unités sur un mobile : cela permet un
                      système flexible pay-as-you-go. Chacun paye uniquement
                      selon son usage.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>
                      L'agent IA fonctionne-t-il sur mon propre numéro WhatsApp
                      ?
                    </h3>
                    <p>
                      Oui ! Vous pouvez connecter votre propre numéro en moins
                      d'une minute simplement en scannant un QR code.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Puis-je tester gratuitement ?</h3>
                    <p>
                      Oui, vous pouvez explorer toutes les fonctionnalités de la
                      plateforme gratuitement. Cependant, pour connecter votre
                      compte WhatsApp et utiliser l'assistant en production,
                      vous devrez souscrire à l'un de nos plans.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Est-ce que mon numéro sera banni ?</h3>
                    <p>
                      Il est impossible de se faire bannir avec Connect. Notre
                      technologie génère des messages original et naturels à
                      chaque fois, respectant strictement les règles de
                      WhatsApp.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Quelles langues sont supportées ?</h3>
                    <p>
                      Nous supportons plus de 133 langues. Connect peut
                      converser naturellement avec vos clients dans le monde
                      entier.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Mes données sont-elles sécurisées ?</h3>
                    <p>
                      Oui, nous sommes entièrement conformes à la GDPR. Vos
                      données sont privées et ne sont jamais utilisées pour
                      entraîner des modèles IA publics.
                    </p>
                  </div>
                </div>
              </motion.section>

              <section className={styles.ctaBanner} style={{ background: "#dcf8c6", border: 'none' }}>
                <div className={styles.waitlistSpline}>
                  {/* Élément décoratif */}
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)",
                    opacity: 0.3
                  }} />
                </div>
                <div style={{ zIndex: 1, width: '100%' }}>
                  <h2 style={{ color: "#075e54" }}>
                    Des agents IA qui grandissent avec vous
                  </h2>
                  <h3 style={{ color: "#128c7e", opacity: 0.8 }}>
                    Commencez à utiliser Connect dès aujourd'hui et rejoignez
                    des milliers d'entreprises innovantes.
                  </h3>

                  <div className="cta-button-group">
                    <Button
                      type="primary"
                      size="large"
                      className="cta-btn-primary"
                      onClick={() =>
                        (window.location.href = "https://app.connect.wozif.com")
                      }
                    >
                      Commencez gratuitement
                    </Button>
                  </div>
                </div>
              </section>


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
