import { Hero } from "@/components/landing/hero";
import { VisualShowcase } from "@/components/landing/showcase";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhatsAppRetargeting } from "@/components/landing/whatsapp-retargeting";
import { CheckoutDemo } from "@/components/landing/checkout-demo";

export default function LandingPage() {
    return (
        <main className="bg-[#020202] min-h-screen">
            <Hero />
            <VisualShowcase />
            <Features />
            <HowItWorks />
            <WhatsAppRetargeting />
            <CheckoutDemo />
        </main>
    );
}
