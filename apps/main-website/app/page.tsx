"use client";

import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";
import SectionHero from "@/framer/section-hero";
import SolutionsSection from "@/components/SolutionsSection";
import WorkflowsContainer from "@/framer/helper/workflows-container";
import TestimonialsSection from "@/framer/section/testimonials";
import FaqSection from "@/framer/section/fa-qs";
import CtaSection from "@/framer/helper/cta";
import LogoContainer from "@/framer/helper/logo-container";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center bg-[rgb(245,245,245)]">
            {/* Navbar */}
            <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                <MainNavbar.Responsive />
            </div>

            {/* Hero */}
            <div style={{ width: "100%", marginTop: "-92.5px" }}>
                <SectionHero.Responsive style={{ width: "100%", maxWidth: "100%" }} />
            </div>

            {/* Logos / Partners */}
            <LogoContainer.Responsive />

            {/* Solutions Wozif */}
            <SolutionsSection />

            {/* Workflows */}
            <WorkflowsContainer.Responsive
                direction="Horizontal"
            />

            {/* Testimonials */}
            <TestimonialsSection.Responsive />

            {/* FAQ */}
            <FaqSection.Responsive />

            {/* CTA */}
            <CtaSection.Responsive />

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
