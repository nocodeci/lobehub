'use client';

import {
  Features,
  Hero,
  AuroraBackground,
  TypewriterEffect,
} from '@lobehub/ui/awesome';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const GridShowcase = dynamic(() => import('@lobehub/ui/awesome').then((m) => m.GridShowcase) as any, { ssr: false }) as React.ComponentType<any>;
const Spline = dynamic(() => import('@lobehub/ui/awesome').then((m) => m.Spline) as any, { ssr: false }) as React.ComponentType<any>;
import {
  Header,
  Footer,
  Flexbox,
  ActionIcon,
  Button,
  Center,
  Icon,
  Video
} from '@lobehub/ui';
import { Typography, Segmented, Tag, Divider, Collapse } from 'antd';
import { createStyles, keyframes } from 'antd-style';
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
  HardDrive,
  Mail,
  Webhook,
  Calendar,
  CircleHelp,
  Atom
} from 'lucide-react';
import {
  OpenAI,
  Anthropic,
  Google,
  DeepSeek,
  Groq,
  Mistral,
  Meta,
  Ollama
} from '@lobehub/icons';
import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
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
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
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
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #ffffff;
    overflow-x: hidden;
    color: #000;
  `,
  splineContainer: css`
    position: absolute;
    top: -100px;
    right: -200px;
    width: 1200px;
    height: 1200px;
    z-index: 0;
    pointer-events: none;
    opacity: 0.6;
    filter: blur(40px);
  `,
  nav: css`
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: calc(100% - 32px);
    max-width: 1000px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    
    &.scrolled {
      top: 8px;
      max-width: 850px;
      filter: drop-shadow(0 12px 24px rgba(0,0,0,0.1));
      
      .ant-layout-header {
        height: 64px !important;
        background: rgba(236, 229, 221, 0.8) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        border-radius: 20px !important;
        border: 1px solid rgba(7, 94, 84, 0.1) !important;
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
    padding: 120px 24px;
    z-index: 1;
    width: calc(100% - 48px);
    max-width: 1440px;
    margin: 24px auto;
    background: #000;
    overflow: hidden;
    color: #fff;
    border-radius: 48px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
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
    display: inline-flex;
    padding: 0 12px;
    background: #075e54;
    color: #fff;
    border-radius: 8px;
    transform: rotate(-2deg);
    margin: 0 8px;
    box-shadow: 0 4px 12px rgba(7, 94, 84, 0.3);
  `,
  heroStatsRow: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1400px;
    position: relative;
    padding-block: 10px;
    padding-inline: 24px;
    
    .marquee-row {
      overflow: hidden;
      position: relative;
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      padding: 10px 0;
    }
    
    .marquee-content {
      display: flex;
      gap: 12px;
      padding-left: 12px;
      animation: marqueeForward 15s linear infinite;
      white-space: nowrap;
      will-change: transform;
      
      &.reverse {
        animation: marqueeReverse 15s linear infinite;
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
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.8);
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3));
      padding: 16px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
      
      @media (min-width: 768px) {
        width: 70px;
        height: 70px;
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
    font-size: clamp(48px, 8vw, 96px) !important;
    font-weight: 1000 !important;
    line-height: 0.95 !important;
    letter-spacing: -5px !important;
    margin-bottom: 32px !important;
    color: #fff;
    text-align: center;
    
    span.accent {
      color: #075e54;
      text-shadow: 0 0 30px rgba(7, 94, 84, 0.5);
    }
  `,
  heroDescription: css`
    font-size: 24px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    max-width: 850px;
    margin: 0 auto 56px;
    line-height: 1.4;
    font-weight: 500;
    text-align: center;
    letter-spacing: -0.5px;
  `,
  agentCardHero: css`
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 28px;
    padding: 28px;
    width: 320px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-10px) scale(1.02);
      border-color: #075e54;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 20px rgba(7, 94, 84, 0.2);
      
      &::before { opacity: 1; }
    }

    h4 { color: #fff; font-size: 18px; font-weight: 800; margin-bottom: 8px; }
    p { color: rgba(255, 255, 255, 0.5); font-size: 14px; line-height: 1.5; margin: 0; }
  `,
  heroGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 100px;
    width: 100%;
    max-width: 1100px;
    position: relative;
    perspective: 2000px;
  `,
  glowButton: css`
    height: 72px !important;
    padding-inline: 56px !important;
    border-radius: 24px !important;
    font-size: 20px !important;
    font-weight: 1000 !important;
    background: #075e54 !important;
    color: #fff !important;
    border: none !important;
    box-shadow: 0 20px 40px rgba(0, 59, 142, 0.3) !important;
    
    &:hover {
       transform: translateY(-4px) scale(1.02);
       background: #075e54 !important;
       box-shadow: 0 30px 60px rgba(7, 94, 84, 0.4) !important;
    }
  `,
  featureSection: css`
    padding: 120px 24px;
    width: 100%;
    position: relative;
  `,
  bentoGrid: css`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 24px;
    margin-top: 80px;
    width: 100%;
  `,
  bentoCard: css`
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(40px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 32px;
    padding: 32px;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 100%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 80px 160px rgba(0, 0, 0, 0.15);
    animation: ${float} 10s infinite ease-in-out;
  `,
  statsGrid: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 48px;
    width: 100%;
    max-width: 1200px;
    margin: 80px auto 0;
    padding: 40px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 32px;
  `,
  statItem: css`
    text-align: center;
    h4 { font-size: 32px; font-weight: 900; margin: 0; color: #075e54; }
    p { font-size: 14px; color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
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
    margin-bottom: 32px;
    padding: 32px;
    background: #f8f9fa;
    border-radius: 24px;
    width: 100%;
    max-width: 1000px;
    h3 { font-size: 20px; font-weight: 800; margin-bottom: 12px; }
    p { font-size: 16px; color: #666; line-height: 1.6; }
  `,
  stepsGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 60px;
    width: 100%;
  `,
  stepCard: css`
    padding: 40px;
    background: #fff;
    border-radius: 32px;
    border: 1px solid #eee;
    text-align: left;
    .step-num { font-size: 48px; font-weight: 900; color: #075e54; opacity: 0.1; line-height: 1; margin-bottom: 16px; }
    h3 { font-size: 24px; font-weight: 800; margin-bottom: 16px; }
    p { font-size: 16px; color: #666; line-height: 1.6; }
  `,
  solutionSection: css`
    padding: 120px 24px;
    background: #000;
    color: #fff;
  `,
  solutionGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 100%;
    max-width: 1440px;
    margin: 60px auto 0;
  `,
  solutionCard: css`
    padding: 48px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-8px);
    }
    h3 { font-size: 24px; font-weight: 800; margin: 24px 0 16px; color: #fff; }
    p { font-size: 16px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; }
    ul { list-style: none; padding: 0; margin-top: 24px; }
    li { display: flex; align-items: center; gap: 8px; font-size: 14px; margin-bottom: 12px; color: rgba(255, 255, 255, 0.8); }
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
    width: 280px;
    height: 220px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #075e54;
      transform: translateY(-8px);
    }

    h4 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 0;
      line-height: 1.4;
    }

    p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.5;
      margin-top: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  ctaBanner: css`
    padding: 100px 48px;
    background-image: url("https://hub-apac-1.lobeobjects.space/landing/waitlist-bg.webp");
    background-size: cover;
    background-position: center;
    width: 100%;
    max-width: 1200px;
    margin: 160px auto 100px;
    position: relative;
    overflow: visible;
    color: #000;
    text-align: center;
    border-radius: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.08), 0 10px 30px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.05);
    
    h2 {
      font-size: clamp(32px, 5vw, 64px);
      font-weight: 900;
      margin-bottom: 16px;
      letter-spacing: -3px;
      line-height: 1.1;
      color: #000;
    }
    h3 {
      font-size: 22px;
      opacity: 0.8;
      max-width: 700px;
      margin: 0 auto 48px;
      font-weight: 500;
      line-height: 1.5;
      color: #444;
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
    gap: 12px;
    padding: 12px 28px;
    background: #075e54;
    color: #fff;
    border-radius: 100px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 40px;
    box-shadow: 0 10px 20px rgba(18, 140, 126, 0.2);
  `,
  videoSection: css`
    padding: 120px 24px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ece5dd;
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
      border-color: rgba(0,0,0,0.1);
      background: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
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
    &::before { content: '$'; font-size: 0.8em; }
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
  segmentedWrapper: css`
    background: #f5f5f5;
    padding: 4px;
    border-radius: 16px;
    margin-bottom: 48px;
    z-index: 1;
  `,
  agentCreateSection: css`
    padding: 80px 24px;
    width: 100%;
    background: #fff;
    color: #000;
  `,
  agentBuilderGrid: css`
    display: flex;
    flex-direction: row;
    gap: 48px;
    margin: 60px auto 0;
    max-width: 1100px;
    align-items: stretch;
    background: #fff;
    border-radius: 40px;
    padding: 48px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 40px 80px rgba(0,0,0,0.03);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      box-shadow: 0 50px 100px rgba(0,0,0,0.05);
      border-color: rgba(7, 94, 84, 0.1);
    }

    @media (max-width: 1024px) {
      flex-direction: column;
      gap: 32px;
      padding: 32px;
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
    padding: 16px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 60px rgba(255, 161, 94, 0.15);
    flex: 1;
    min-width: 300px;
    max-width: 450px;
    @media (max-width: 1024px) {
      max-width: 100%;
      min-width: auto;
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
    border: 1px solid rgba(0,0,0,0.04);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    position: relative;
    padding-right: 12px;
    
    &:hover {
      background: #fff;
      border-color: rgba(0,0,0,0.1);
      box-shadow: 0 20px 40px rgba(0,0,0,0.04);
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
}));

const LandingPage = memo(() => {
  const { styles, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logo = (
    <a href="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <Flexbox horizontal align="center" gap={scrolled ? 8 : 12}>
        <img
          src="/connect-logo.png"
          alt="Connect Logo"
          style={{
            width: scrolled ? 32 : 40,
            height: scrolled ? 32 : 40,
            objectFit: 'contain',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <span style={{
          fontSize: scrolled ? 20 : 24,
          fontWeight: 900,
          letterSpacing: '-0.5px',
          color: '#000',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          Connect
        </span>
      </Flexbox>
    </a>
  );

  const actions = (
    <Flexbox horizontal gap={scrolled ? 12 : 16} align="center">
      <ActionIcon icon={Github} size={scrolled ? "middle" : "large"} style={{ color: '#000' }} />
      <Button
        type="primary"
        size={scrolled ? "middle" : "large"}
        onClick={() => window.location.href = 'https://connect.wozif.com'}
        style={{
          borderRadius: scrolled ? 12 : 16,
          fontWeight: 800,
          paddingInline: scrolled ? 20 : 32,
          background: '#075e54',
          border: 'none',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(7, 94, 84, 0.3)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        Démarrer
      </Button>
    </Flexbox>
  );

  const navLinks = (
    <Flexbox horizontal gap={scrolled ? 20 : 32}>
      <a href="#features" style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 700, fontSize: scrolled ? 14 : 15, textDecoration: 'none', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.85)'}>Concept</a>
      <a href="#showcase" style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 700, fontSize: scrolled ? 14 : 15, textDecoration: 'none', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.85)'}>Moteur</a>
      <a href="/pricing" style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 700, fontSize: scrolled ? 14 : 15, textDecoration: 'none', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.85)'}>Tarification</a>
      <a href="#showcase" style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 700, fontSize: scrolled ? 14 : 15, textDecoration: 'none', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.85)'}>Sécurité</a>
    </Flexbox>
  );

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
            <GridShowcase style={{ width: '100%', maxWidth: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Navigation */}
              <div className={cx(styles.nav, scrolled && 'scrolled')}>
                <Header
                  logo={logo}
                  nav={navLinks}
                  actions={actions}
                  style={{
                    height: scrolled ? 56 : 72,
                    background: 'rgba(236, 229, 221, 0.8)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid rgba(7, 94, 84, 0.1)',
                    borderRadius: 20,
                    padding: '0 32px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>

              <section className={styles.heroWrapper}>
                {/* Decorative Blobs */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={styles.heroGlowCircle}
                  style={{ width: 600, height: 600, top: '-10%', left: '50%', transform: 'translateX(-50%)' }}
                />
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 0.1, x: "-50%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className={styles.heroGlowCircle}
                  style={{ width: 300, height: 300, top: '5%', left: '0%' }}
                />
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 0.1, x: "50%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className={styles.heroGlowCircle}
                  style={{ width: 300, height: 300, top: '5%', right: '0%' }}
                />

                <div className={styles.container}>
                  <Center style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={styles.heroBadge}
                    >
                      <div className="dot" />
                      <span>Découvrez les nouveautés chez Connect</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={styles.heroTitle}
                      style={{ fontSize: 'clamp(40px, 6vw, 84px)', marginBottom: 24 }}
                    >
                      Automatisez vos <br />
                      <span className={styles.heroHighlight}>workflows</span> avec Connect
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className={styles.heroDescription}
                      style={{ color: '#fff', fontSize: 20, maxWidth: 700, opacity: 0.9 }}
                    >
                      L'automatisation WhatsApp universelle. Connectez vos conversations à n'importe quel outil et automatisez vos workflows sans aucune limite.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9, type: "spring", stiffness: 100 }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => window.location.href = 'https://connect.wozif.com'}
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          padding: '20px 56px',
                          height: 'auto',
                          borderRadius: 24,
                          background: '#075e54',
                          border: 'none',
                          color: '#fff',
                          boxShadow: '0 8px 32px rgba(7, 94, 84, 0.4)'
                        }}
                      >
                        Commencer maintenant
                      </Button>
                    </motion.div>

                    {/* Stats Row - Dual Marquee */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 1.1 }}
                      className={styles.heroStatsRow}
                    >
                      {/* Première rangée - Direction Forward */}
                      <div className="marquee-row">
                        <div className="marquee-content">
                          {(() => {
                            const row1Logos = [
                              { icon: <OpenAI.Avatar size={32} />, type: 'lobehub' },
                              { icon: <Anthropic.Avatar size={32} />, type: 'lobehub' },
                              { icon: <Google.Avatar size={32} />, type: 'lobehub' },
                              { icon: <DeepSeek.Avatar size={32} />, type: 'lobehub' },
                              { icon: <Groq.Avatar size={32} />, type: 'lobehub' },
                              { icon: <Mistral.Avatar size={32} />, type: 'lobehub' },
                              { icon: <Meta.Avatar size={32} />, type: 'lobehub' },
                              { icon: <Ollama.Avatar size={32} />, type: 'lobehub' },
                              { icon: '/logos/linear.svg' },
                              { icon: '/logos/notion.svg' },
                              { icon: '/logos/slack.svg' },
                              { icon: '/logos/jira.svg' },
                              { icon: '/logos/airtable.svg' },
                              { icon: '/logos/github.svg' },
                              { icon: '/logos/figma.svg' },
                              { icon: '/logos/gmail.svg' },
                              { icon: '/logos/google-sheets.svg' },
                              { icon: '/logos/supabase.svg' },
                            ];
                            // Dupliquer 4 fois pour remplir complètement
                            const duplicated = [...row1Logos, ...row1Logos, ...row1Logos, ...row1Logos];
                            return duplicated.map((logo, idx) => (
                              <span key={idx} className="logo-card">
                                {logo.type === 'lobehub' ? logo.icon : <img src={logo.icon as string} alt="" />}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Deuxième rangée - Direction Reverse */}
                      <div className="marquee-row">
                        <div className="marquee-content reverse">
                          {(() => {
                            const row2Logos = [
                              { icon: '/logos/google-calendar.svg' },
                              { icon: '/logos/google-docs.svg' },
                              { icon: '/logos/google-drive.svg' },
                              { icon: '/logos/hubspot.svg' },
                              { icon: '/logos/salesforce.svg' },
                              { icon: '/logos/zendesk.svg' },
                              { icon: '/logos/whatsapp.svg' },
                              { icon: '/logos/twitter.svg' },
                              { icon: '/logos/youtube.svg' },
                              { icon: '/logos/outlook.svg' },
                              { icon: '/logos/dropbox.svg' },
                              { icon: '/logos/onedrive.svg' },
                              { icon: '/logos/calcom.svg' },
                              { icon: '/logos/calendly.svg' },
                              { icon: '/logos/confluence.svg' },
                              { icon: '/logos/clickup.svg' },
                            ];
                            // Dupliquer 4 fois pour remplir complètement
                            const duplicated = [...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos];
                            return duplicated.map((logo, idx) => (
                              <span key={idx} className="logo-card">
                                <img src={logo.icon} alt="" />
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    </motion.div>



                  </Center>
                </div>
              </section>

              {/* Video Presentation Section */}
              <section className={styles.videoSection}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 60 }}>
                    <div className={styles.tag} style={{ background: '#075e54' }}>Démo en action</div>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-2px', marginTop: 24 }}>
                      Découvrez Connect en action
                    </h2>
                    <p style={{ fontSize: 18, color: '#666', maxWidth: 600, marginTop: 16 }}>
                      Une démonstration complète de nos capacités d'automatisation WhatsApp avec l'IA.
                    </p>
                  </Center>

                  <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <Video
                      preview
                      src="https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2"
                      variant="filled"
                      style={{
                        borderRadius: 24,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Agent Creation Section */}
              <motion.section {...fadeInUp} id="create" className={styles.agentCreateSection}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 48 }}>
                    <div className={styles.tag} style={{ background: 'var(--ant-color-warning)', color: '#000' }}>Créer</div>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-3px', textAlign: 'center' }}>
                      Les agents comme unité de travail
                    </h2>
                  </Center>

                  <div className={styles.agentBuilderGrid}>
                    <div className={styles.agentControlBox}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ alignSelf: 'flex-start' }}>
                          <Segmented
                            size="large"
                            options={['Créateur d’Agents']}
                            style={{ borderRadius: 12, padding: 4 }}
                          />
                        </div>
                        <div style={{ width: 100, height: 100, position: 'relative' }}>
                          <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%' }}>
                            <circle cx="50" cy="50" r="48" stroke="#075e54" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                            <motion.path
                              d="M20 50 L80 50 M50 20 L50 80"
                              stroke="#075e54"
                              strokeWidth="0.5"
                              opacity="0.2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              style={{ originX: '50px', originY: '50px' }}
                            />
                            <rect x="30" y="30" width="40" height="40" rx="12" fill="#075e54" fillOpacity="0.05" stroke="#075e54" strokeWidth="1.5" />
                            <circle cx="43" cy="45" r="3" fill="#075e54" />
                            <circle cx="57" cy="45" r="3" fill="#075e54" />
                            <motion.path
                              d="M40 60 Q50 65 60 60"
                              stroke="#075e54"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              animate={{ d: ["M40 60 Q50 65 60 60", "M40 62 Q50 58 60 62", "M40 60 Q50 65 60 60"] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                        Créez des agents sans effort, avec un véritable contrôle des compétences
                      </h3>

                      <Collapse
                        ghost
                        accordion
                        defaultActiveKey={['3']}
                        expandIconPosition="start"
                        items={[
                          {
                            key: '1',
                            label: <span style={{ fontSize: 16, fontWeight: 600 }}>Une phrase pour commencer</span>,
                            children: (
                              <div>
                                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>Les noms, rôles, compétences et comportements sont configurés automatiquement.</p>
                                <Divider style={{ margin: '16px 0 0' }} />
                              </div>
                            )
                          },
                          {
                            key: '2',
                            label: <span style={{ fontSize: 16, fontWeight: 600 }}>Auto-configuré par défaut</span>,
                            children: (
                              <div>
                                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>Les noms, rôles, compétences et comportements sont générés automatiquement pour vous.</p>
                                <Divider style={{ margin: '16px 0 0' }} />
                              </div>
                            )
                          },
                          {
                            key: '3',
                            label: <span style={{ fontSize: 16, fontWeight: 600 }}>Utiliser immédiatement</span>,
                            children: (
                              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>Mettez l’Agent au travail immédiatement — aucune étape supplémentaire.</p>
                            )
                          }
                        ]}
                      />
                    </div>

                    <div className={styles.agentVideoBox}>
                      <video
                        loop
                        muted
                        autoPlay
                        playsInline
                        poster="https://hub-apac-1.lobeobjects.space/landing/images/home/agent-builder-light.webp"
                        src="https://hub-apac-1.lobeobjects.space/landing/images/home/agent-builder-light.webm"
                        style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                      />
                    </div>
                  </div>

                  <div className={styles.agentFeatureGrid}>
                    <div className={styles.agentFeatureTile}>
                      <div className={styles.featureTextWrapper}>
                        <h3 className={styles.featureLabel}>10000+ compétences</h3>
                        <h3 className={styles.featureDesc}>Connectez les Agents aux compétences que vous utilisez</h3>
                      </div>
                      <div className={`${styles.skillsImage} feature-image`} />
                    </div>

                    <div className={styles.agentFeatureTile}>
                      <div className={styles.featureTextWrapper}>
                        <h3 className={styles.featureLabel}>Intelligence unifiée</h3>
                        <h3 className={styles.featureDesc}>N’importe quel modèle, n’importe quelle modalité — sous votre contrôle</h3>
                      </div>
                      <img
                        className={`${styles.intelligenceImage} feature-image`}
                        src="https://hub-apac-1.lobeobjects.space/landing/images/home/intelligence-light.webp"
                        alt="Intelligence unifiée"
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* AI Engine Section */}
              <motion.section {...fadeInUp} id="showcase" className={styles.featureSection} style={{ background: 'rgba(0, 59, 142, 0.02)' }}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 60 }}>
                    <div className={styles.tag} style={{ background: '#075e54' }}>Multi-LLM</div>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-2px' }}>
                      L'interface ultime pour vos agents.
                    </h2>
                    <p style={{ fontSize: 18, color: '#666', maxWidth: 600, marginTop: 16 }}>
                      Connect propose une expérience de chat révolutionnaire, inspirée des standards LobeChat, pour piloter vos automatisations WhatsApp avec une fluidité absolue.
                    </p>
                  </Center>

                  <Features
                    items={[
                      {
                        icon: <MessageSquare />,
                        title: 'Chat Lobe-Style',
                        description: 'Une interface conversationnelle premium pour gérer vos échanges WhatsApp et vos agents IA.'
                      },
                      {
                        icon: <Database />,
                        title: 'Sync Google Sheets',
                        description: 'Enregistrez automatiquement les données de vos conversations dans vos tableurs en temps réel.'
                      },
                      {
                        icon: <Zap />,
                        title: 'Flows Ultra-Rapides',
                        description: 'Des automatisations qui s\'exécutent instantanément entre WhatsApp, vos CRM et vos outils.'
                      },
                      {
                        icon: <Smartphone />,
                        title: 'Multi-Device Support',
                        description: 'Pilotez votre instance Connect depuis votre ordinateur ou votre mobile avec la même fluidité.'
                      }
                    ]}
                    columns={2}
                  />

                </div>
              </motion.section>


              {/* Solutions & Use Cases Section */}
              <motion.section {...fadeInUp} id="solutions" className={styles.solutionSection}>
                <div className={styles.container}>
                  <Center>
                    <div className={styles.tag} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Gallerrie d'Agents</div>
                    <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-3px', color: '#fff' }}>
                      Cas d'usage réels.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginTop: 16 }}>
                      Découvrez comment nos clients orchestrent leur intelligence.
                    </p>
                  </Center>

                  <div className={styles.useCaseScroll}>
                    {[
                      { title: "WhatsApp vers Google Sheets", desc: "Collecte de données automatique depuis WhatsApp directement synchronisée dans vos tableurs Sheets." },
                      { title: "CRM intelligent sur WhatsApp", desc: "Notification automatique de votre CRM lors de chaque interaction client qualifiée via IA." },
                      { title: "Support Client Multi-Agent", desc: "Plusieurs agents IA spécialisés gérant vos départements (Ventes, Support, Logistique) en simultané." },
                      { title: "Dashboard No-Code", desc: "Configurez vos webhooks et vos automatisations sans écrire une seule ligne de code via notre interface." },
                      { title: "Mémoire Conversationnelle", desc: "Vos agents se souviennent du contexte de chaque client pour un service ultra-personnalisé." },
                      { title: "Export de rapports auto", desc: "Générez des rapports hebdomadaires sur vos automatisations envoyés directement par email." }
                    ].map((item, idx) => (
                      <div key={idx} className={styles.useCaseCard}>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                        <Flexbox horizontal justify="space-between" align="center" style={{ marginTop: 20 }}>
                          <span style={{ fontSize: 12, color: '#075e54', fontWeight: 800 }}>DÉMO DISPONIBLE</span>
                          <ExternalLink size={14} color="rgba(255,255,255,0.4)" />
                        </Flexbox>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Atomic Security SVG Animation Section */}
              <motion.section {...fadeInUp} style={{ background: '#f8f9fa', padding: '120px 24px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div className={styles.container}>
                  <Flexbox horizontal align="center" justify="flex-start" style={{ gap: 40, flexWrap: 'wrap' }}>
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Shield size={120} color="#075e54" strokeWidth={1.5} />
                    </motion.div>

                    <div style={{ flex: 1, minWidth: 320 }}>
                      <div className={styles.tag} style={{ background: '#075e54', color: '#fff', marginBottom: 16, width: 'fit-content' }}>Sécurité Militaire</div>
                      <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 900, textAlign: 'left', letterSpacing: '-2px', marginBottom: 16, lineHeight: 1.1 }}>
                        Confidentialité Atomique.
                      </h2>
                      <p style={{ color: '#666', fontSize: 20, maxWidth: 600, textAlign: 'left', lineHeight: 1.5 }}>
                        Vos données sont sacrées. Connect utilise un chiffrement de bout en bout et une architecture isolée pour garantir une sécurité totale.
                      </p>
                    </div>
                  </Flexbox>
                </div>


              </motion.section>

              {/* Global Connectivity Section */}
              <motion.section {...fadeInUp} style={{ background: '#000', padding: '120px 24px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 80 }}>
                    <div className={styles.tag} style={{ background: '#075e54', color: '#fff' }}>Réseau Mondial</div>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, textAlign: 'center', letterSpacing: '-3px' }}>
                      Connectivité Universelle.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, maxWidth: 800, textAlign: 'center', marginTop: 24 }}>
                      Une infra-structure distribuée sur les 5 continents pour une latence minimale et une fiabilité maximale. Touchez vos clients où qu'ils soient.
                    </p>
                  </Center>
                </div>
              </motion.section>

              {/* How It Works Section */}
              <motion.section {...fadeInUp} className={styles.featureSection}>
                <div className={styles.container}>
                  <Center>
                    <div className={styles.tag}>Le Workflow</div>
                    <h2 style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-2px' }}>Comment ça marche ?</h2>
                  </Center>

                  <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
                      <Center style={{ height: 120, marginBottom: 20 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          style={{ padding: 20, background: 'rgba(7, 94, 84, 0.05)', borderRadius: '50%' }}
                        >
                          <MessageSquare size={40} color="#075e54" />
                        </motion.div>
                      </Center>
                      <div className="step-num">01</div>
                      <h3>Connectez votre compte</h3>
                      <p>Liez votre numéro WhatsApp Business en 30 secondes via notre portail sécurisé hautement performant.</p>
                    </div>
                    <div className={styles.stepCard}>
                      <Center style={{ height: 120, marginBottom: 20 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          style={{ padding: 20, background: 'rgba(7, 94, 84, 0.05)', borderRadius: '50%' }}
                        >
                          <Cpu size={40} color="#075e54" />
                        </motion.div>
                      </Center>
                      <div className="step-num">02</div>
                      <h3>Configurez vos agents</h3>
                      <p>Définissez la personnalité et les connaissances de votre IA. Choisissez parmi les meilleurs modèles au monde.</p>
                    </div>
                    <div className={styles.stepCard}>
                      <Center style={{ height: 120, marginBottom: 20 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          style={{ padding: 20, background: 'rgba(7, 94, 84, 0.05)', borderRadius: '50%' }}
                        >
                          <Zap size={40} color="#075e54" />
                        </motion.div>
                      </Center>
                      <div className="step-num">03</div>
                      <h3>Connectez vos outils</h3>
                      <p>Créez des automations puissantes qui connectent WhatsApp à vos Google Sheets, CRM et bases de données en temps réel.</p>
                    </div>
                  </div>


                </div>
              </motion.section>

              {/* Advanced Features Detailed Section */}
              <motion.section {...fadeInUp} className={styles.featureSection} style={{ borderTop: '1px solid #eee' }}>
                <div className={styles.container}>
                  <Center>
                    <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 80 }}>Fonctionnalités Avancées</h2>
                  </Center>
                  <Features
                    items={[
                      {
                        icon: <Layers />,
                        title: 'Mémoire Infinie',
                        description: 'Vos agents se souviennent de chaque interaction passée pour une personnalisation extrême.'
                      },
                      {
                        icon: <Settings />,
                        title: 'Hooks Personnalisés',
                        description: 'Déclenchez des actions complexes dans vos systèmes externes en fonction des réponses.'
                      },
                      {
                        icon: <Database />,
                        title: 'RAG Architecture',
                        description: 'Connectez vos fichiers, PDF et bases de données pour des réponses expertes et précises.'
                      },
                      {
                        icon: <Search />,
                        title: 'Navigation Web',
                        description: 'Permettez à vos agents d\'aller chercher des informations en temps réel sur internet.'
                      }
                    ]}
                    columns={2}
                  />
                </div>
              </motion.section>

              {/* Pricing Section */}
              <motion.section {...fadeInUp} id="pricing" style={{ padding: '120px 24px', width: '100%', background: '#fff' }}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 48 }}>
                    <div className={styles.tag} style={{ background: '#075e54', color: '#fff' }}>Tarification</div>
                    <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-3px', marginTop: 24, textAlign: 'center', color: '#000' }}>
                      Plans et tarifs
                    </h2>
                    <p style={{ fontSize: 20, color: '#666', maxWidth: 650, textAlign: 'center', marginTop: 16 }}>
                      Commencez un essai gratuit de GPT / Claude / Gemini 500,000 Credits. <br />
                      Aucune carte de crédit requise.
                    </p>
                  </Center>

                  <Center>
                    <div className={styles.segmentedWrapper}>
                      <Segmented
                        size="large"
                        options={[
                          { label: <Flexbox horizontal align="center" gap={6} style={{ padding: '0 12px' }}>Paiement annuel <Tag color="success" style={{ background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a', margin: 0 }}>Remise de 23%</Tag></Flexbox>, value: 'yearly' },
                          { label: <div style={{ padding: '0 12px' }}>Paiement mensuel</div>, value: 'monthly' },
                        ]}
                        value={billingCycle}
                        onChange={setBillingCycle as any}
                        style={{ background: 'transparent' }}
                      />
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
                    <motion.div variants={fadeInUp} className={styles.pricingCard}>
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #c57948, #803718)', borderColor: '#ffc385', color: '#ffc385' }}>
                          <Sparkles size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Version de base</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Pour une utilisation plus légère et occasionnelle</p>
                        </div>
                        <div>
                          <div className={styles.priceValue}>{billingCycle === 'yearly' ? '9.9' : '12.9'}</div>
                          <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/ Par {billingCycle === 'yearly' ? 'mois (Paiement annuel)' : 'mois'}</div>
                        </div>
                        {billingCycle === 'yearly' && (
                          <Flexbox horizontal gap={4} align="center">
                            <span style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>$118.8 / Par an</span>
                            <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 23%</Tag>
                          </Flexbox>
                        )}
                        <Button type="primary" block style={{ fontWeight: 500, height: 40, borderRadius: 8, background: '#075e54', border: 'none' }}>Commencer</Button>
                      </Flexbox>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#000' }}>
                          Calcul des crédits <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>5,000,000 / Par mois</div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>GPT-4o mini <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 7,000 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>DeepSeek R1 <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 1,900 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>Claude 3.5 Sonnet New <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 300 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>Gemini 1.5 Flash <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 7,000 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ opacity: 0.8, color: '#000' }}>Voir plus de modèles...</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#000' }}>
                          Fichiers & Connaissance <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, color: '#000' }}>Stockage de fichiers</div>
                            <div style={{ fontSize: 14, color: '#000' }}>1.0 GB</div>
                          </Flexbox>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, color: '#000' }}>Stockage de vecteurs</div>
                            <div style={{ fontSize: 14, color: '#000' }}>5,000 entrées <span style={{ opacity: 0.5, fontSize: 12 }}>(≈ 50MB)</span></div>
                          </Flexbox>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Fournisseurs</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Utilisez vos propres clés API</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Demandes de messages illimitées</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Services cloud</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Historique des conversations illimité</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Synchronisation cloud globale</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Fonctionnalités avancées</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Points forts du Marché d’agents</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Compétences premium</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Recherche web</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Support client</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Support par e-mail prioritaire</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Achat de forfaits de crédits supp.</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Premium */}
                    <motion.div variants={fadeInUp} className={cx(styles.pricingCard, styles.featuredCard)}>
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #a5b4c2, #606e7b)', borderColor: '#fcfdff', color: '#fcfdff' }}>
                          <Zap size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Premium</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Pour les professionnels exigeants</p>
                        </div>
                        <div>
                          <div className={styles.priceValue}>{billingCycle === 'yearly' ? '19.9' : '24.9'}</div>
                          <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/ Par {billingCycle === 'yearly' ? 'mois (Paiement annuel)' : 'mois'}</div>
                        </div>
                        {billingCycle === 'yearly' && (
                          <Flexbox horizontal gap={4} align="center">
                            <span style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>$238.8 / Par an</span>
                            <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 20%</Tag>
                          </Flexbox>
                        )}
                        <Button type="primary" block style={{ fontWeight: 500, height: 40, borderRadius: 8, background: '#075e54', border: 'none' }}>Commencer</Button>
                      </Flexbox>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#000' }}>
                          Calcul des crédits <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>15,000,000 / Par mois</div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>GPT-4o mini <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 21,100 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>DeepSeek R1 <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 5,800 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>Claude 3.5 Sonnet New <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 900 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>Gemini 1.5 Flash <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 21,100 messages</div>
                          </Flexbox>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#000' }}>
                          Fichiers & Connaissance <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, color: '#000' }}>Stockage de fichiers</div>
                            <div style={{ fontSize: 14, color: '#000' }}>2.0 GB</div>
                          </Flexbox>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, color: '#000' }}>Stockage de vecteurs</div>
                            <div style={{ fontSize: 14, color: '#000' }}>10,000 entrées <span style={{ opacity: 0.5, fontSize: 12 }}>(≈ 100MB)</span></div>
                          </Flexbox>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Fournisseurs</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Utilisez vos propres clés API</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Demandes de messages illimitées</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Services cloud</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Historique des conversations illimité</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Synchronisation cloud globale</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Fonctionnalités avancées</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Points forts du Marché d’agents</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Compétences premium</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Recherche web</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Support client</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Support par e-mail prioritaire</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Achat de forfaits de crédits supp.</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Ultimate */}
                    <motion.div variants={fadeInUp} className={styles.pricingCard}>
                      <Flexbox gap={16}>
                        <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #f7a82f, #bb7227)', borderColor: '#fcfa6e', color: '#fcfa6e' }}>
                          <Atom size={18} />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Ultimate</h2>
                          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, color: '#000' }}>Pour une utilisation intensive</p>
                        </div>
                        <div>
                          <div className={styles.priceValue}>{billingCycle === 'yearly' ? '39.9' : '49.9'}</div>
                          <div style={{ fontSize: 13, opacity: 0.5, color: '#000' }}>/ Par {billingCycle === 'yearly' ? 'mois (Paiement annuel)' : 'mois'}</div>
                        </div>
                        {billingCycle === 'yearly' && (
                          <Flexbox horizontal gap={4} align="center">
                            <span style={{ fontSize: 12, opacity: 0.5, color: '#000' }}>$478.8 / Par an</span>
                            <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 20%</Tag>
                          </Flexbox>
                        )}
                        <Button type="primary" block style={{ fontWeight: 500, height: 40, borderRadius: 8, background: '#075e54', border: 'none' }}>Commencer</Button>
                      </Flexbox>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#000' }}>
                          Calcul des crédits <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>35,000,000 / Par mois</div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>GPT-4o mini <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 49,100 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>DeepSeek R1 <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 13,400 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>Claude 3.5 Sonnet New <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 2,100 messages</div>
                          </Flexbox>
                        </div>

                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}>Gemini 1.5 Flash <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                            <div style={{ fontSize: 12, opacity: 0.6, color: '#000' }}>Environ 49,100 messages</div>
                          </Flexbox>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#000' }}>
                          Fichiers & Connaissance <CircleHelp size={14} style={{ opacity: 0.5 }} />
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, color: '#000' }}>Stockage de fichiers</div>
                            <div style={{ fontSize: 14, color: '#000' }}>4.0 GB</div>
                          </Flexbox>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <Flexbox>
                            <div style={{ fontWeight: 600, color: '#000' }}>Stockage de vecteurs</div>
                            <div style={{ fontSize: 14, color: '#000' }}>20,000 entrées <span style={{ opacity: 0.5, fontSize: 12 }}>(≈ 200MB)</span></div>
                          </Flexbox>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Fournisseurs</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Utilisez vos propres clés API</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Demandes de messages illimitées</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Services cloud</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Historique des conversations illimité</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Synchronisation cloud globale</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Fonctionnalités avancées</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Points forts du Marché d’agents</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Compétences premium</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Recherche web</div>
                        </div>
                      </div>

                      <Divider dashed style={{ margin: 0 }} />

                      <div className={styles.featureGroup}>
                        <div style={{ fontWeight: 600, color: '#000' }}>Support client</div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Support par e-mail prioritaire</div>
                        </div>
                        <div className={styles.featureItem}>
                          <CheckCircle2 size={16} fill="#52c41a" color="#fff" />
                          <div style={{ color: '#000' }}>Achat de forfaits de crédits supp.</div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                </div>
              </motion.section>

              {/* FAQ Section */}
              <motion.section {...fadeInUp} className={styles.faqSection}>
                <div className={styles.container}>
                  <Center style={{ marginBottom: 60 }}>
                    <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1px' }}>Questions Fréquentes</h2>
                  </Center>
                  <div className={styles.faqItem}>
                    <h3>C'est quoi l'utilité des crédits ?</h3>
                    <p>Les crédits existent car chaque message généré par l'agent a un coût en termes de frais serveur et d'IA. C'est comme recharger des unités sur un mobile : cela permet un système flexible pay-as-you-go. Chacun paye uniquement selon son usage.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>L'agent IA fonctionne-t-il sur mon propre numéro WhatsApp ?</h3>
                    <p>Oui ! Vous pouvez connecter votre propre numéro en moins d'une minute simplement en scannant un QR code.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Puis-je tester gratuitement ?</h3>
                    <p>Oui, vous pouvez explorer toutes les fonctionnalités de la plateforme gratuitement. Cependant, pour connecter votre compte WhatsApp et utiliser l'assistant en production, vous devrez souscrire à l'un de nos plans.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Est-ce que mon numéro sera banni ?</h3>
                    <p>Il est impossible de se faire bannir avec Connect. Notre technologie génère des messages original et naturels à chaque fois, respectant strictement les règles de WhatsApp.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Quelles langues sont supportées ?</h3>
                    <p>Nous supportons plus de 133 langues. Connect peut converser naturellement avec vos clients dans le monde entier.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Mes données sont-elles sécurisées ?</h3>
                    <p>Oui, nous sommes entièrement conformes à la GDPR. Vos données sont privées et ne sont jamais utilisées pour entraîner des modèles IA publics.</p>
                  </div>
                </div>
              </motion.section>


              <section className={styles.ctaBanner} style={{
                background: '#dcf8c6',
                borderRadius: 48,
                margin: '80px auto 40px',
                width: 'calc(100% - 48px)',
                maxWidth: 1440
              }}>
                <div className={styles.waitlistSpline}>
                  <Spline scene="https://prod.spline.design/6Wq1Q7YGyMvjMvjr/scene.splinecode" />
                </div>
                <div style={{ zIndex: 1 }}>
                  <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-2px', color: '#075e54' }}>Des agents IA qui grandissent avec vous</h2>
                  <h3 style={{ color: '#128c7e', opacity: 0.8 }}>Commencez à utiliser Connect dès aujourd'hui et rejoignez des milliers d'entreprises innovantes.</h3>

                  <Flexbox horizontal justify="center" align="center" gap={16} style={{ marginTop: 40 }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => window.location.href = 'https://connect.wozif.com'}
                      style={{
                        height: 64,
                        paddingInline: 40,
                        borderRadius: 20,
                        fontSize: 18,
                        fontWeight: 800,
                        background: '#075e54',
                        border: 'none',
                        color: '#fff',
                        boxShadow: '0 8px 32px rgba(7, 94, 84, 0.4)'
                      }}
                    >
                      Commencez gratuitement
                    </Button>
                    <Button
                      size="large"
                      style={{
                        height: 64,
                        paddingInline: 40,
                        borderRadius: 20,
                        fontSize: 18,
                        fontWeight: 800,
                        background: '#075e54',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 8px 32px rgba(7, 94, 84, 0.2)'
                      }}
                      icon={<Smartphone size={20} />}
                      iconPlacement="end"
                      onClick={() => window.location.href = '#'}
                    >
                      Télécharger la version macOS
                    </Button>
                  </Flexbox>
                </div>
              </section>

              {/* Custom Footer inspired by CinetPay */}
              <section style={{ width: '100%', background: 'transparent', padding: '0 24px 40px 24px' }}>
                <div className={styles.container} style={{
                  background: '#ece5dd',
                  borderRadius: 48,
                  border: '1px solid rgba(7, 94, 84, 0.1)',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: 1440,
                  margin: '0 auto'
                }}>
                  {/* Newsletter CTA */}
                  <div style={{ width: '100%', padding: '48px 24px', borderBottom: '1px solid rgba(7, 94, 84, 0.1)' }}>
                    <Flexbox horizontal justify="space-between" align="center" gap={32} style={{ maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#075e54', flex: '1 1 400px' }}>
                        Recevez les dernières actualités IA & Automatisation directement dans votre boîte mail
                      </h2>
                      <Flexbox horizontal gap={8} style={{ flex: '1 1 350px', width: '100%' }}>
                        <input
                          type="email"
                          placeholder="Votre adresse email"
                          style={{
                            flex: 1,
                            height: 48,
                            borderRadius: 12,
                            border: '1px solid rgba(7, 94, 84, 0.2)',
                            paddingInline: 16,
                            fontSize: 16
                          }}
                        />
                        <Button
                          type="primary"
                          style={{ height: 48, borderRadius: 12, background: '#075e54', fontWeight: 700 }}
                        >
                          Souscrire
                        </Button>
                      </Flexbox>
                    </Flexbox>
                  </div>

                  {/* Footer Content Widgets */}
                  <div style={{ width: '100%', padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 48,
                      width: '100%'
                    }}>
                      {/* Logo Column */}
                      <Flexbox gap={24} align="start">
                        <div>
                          <Flexbox horizontal align="center" gap={12}>
                            <img
                              src="https://framerusercontent.com/images/8WfVzYJ9pXQ5hZ3Z0zY7mYc.png"
                              alt="Connect Logo"
                              style={{ width: 40, height: 40, objectFit: 'contain' }}
                            />
                            <span style={{ fontSize: 24, fontWeight: 900, color: '#000' }}>Connect</span>
                          </Flexbox>
                          <p style={{ marginTop: 16, color: '#666', lineHeight: 1.6 }}>
                            Réinventer l'automatisation, propulser votre croissance.
                          </p>
                        </div>
                        <Button
                          variant="text"
                          icon={<Globe size={16} />}
                          style={{ color: '#075e54', fontWeight: 600, padding: 0 }}
                        >
                          Français <ChevronRight size={14} style={{ marginLeft: 4 }} />
                        </Button>
                      </Flexbox>

                      {/* Products Column */}
                      <Flexbox gap={16}>
                        <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#075e54', opacity: 0.6 }}>Produits</span>
                        <Flexbox gap={12}>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Orchestrateur IA</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Agents WhatsApp</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>WhatsApp Collect</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>School Automation</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>API Connect Direct</a>
                        </Flexbox>
                      </Flexbox>

                      {/* Developers Column */}
                      <Flexbox gap={16}>
                        <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#075e54', opacity: 0.6 }}>Développeurs</span>
                        <Flexbox gap={12}>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Bien démarrer</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Bibliothèque SDK</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Tutoriels</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Documentation API</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Statut Système</a>
                        </Flexbox>
                      </Flexbox>

                      {/* Resources Column */}
                      <Flexbox gap={16}>
                        <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#075e54', opacity: 0.6 }}>Ressources</span>
                        <Flexbox gap={12}>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Études de cas</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Actualités IA</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Recrutement</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Démo Live</a>
                        </Flexbox>
                      </Flexbox>

                      {/* Connect Column */}
                      <Flexbox gap={16}>
                        <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#075e54', opacity: 0.6 }}>Connect</span>
                        <Flexbox gap={12}>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>À propos</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Nous contacter</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Conditions</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Confidentialité</a>
                          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>CGU Services</a>
                        </Flexbox>
                      </Flexbox>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div style={{ width: '100%', padding: '32px 24px', borderTop: '1px solid rgba(7, 94, 84, 0.1)', maxWidth: 1200, margin: '0 auto' }}>
                    <Flexbox horizontal justify="space-between" align="center" gap={24} style={{ flexWrap: 'wrap' }}>
                      <p style={{ color: '#666', margin: 0 }}>
                        © 2016 - 2026 Connect. Tous droits réservés par Wozif Innovation.
                      </p>
                      <Flexbox horizontal gap={24}>
                        <a href="#" style={{ color: '#075e54' }}><Linkedin size={20} /></a>
                        <a href="#" style={{ color: '#075e54' }}><Facebook size={20} /></a>
                        <a href="#" style={{ color: '#075e54' }}><Twitter size={20} /></a>
                        <a href="#" style={{ color: '#075e54' }}><Github size={20} /></a>
                      </Flexbox>
                    </Flexbox>
                  </div>
                </div>
              </section>
            </GridShowcase>
          </motion.main>
        )}
      </AnimatePresence>
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
        strategy="afterInteractive"
      />
    </>
  );
});

export default LandingPage;
