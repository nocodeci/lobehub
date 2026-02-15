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
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <LogoContainer.Responsive />
            </div>

            {/* Solutions Wozif */}
            <div id="features" style={{ width: "100%" }}>
                <SolutionsSection />
            </div>

            {/* Workflows */}
            <div id="avantages" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <WorkflowsContainer.Responsive direction="Horizontal" style={{ width: "100%", maxWidth: 1200 }} />
            </div>

            {/* Testimonials */}
            <div id="temoignages" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <TestimonialsSection.Responsive style={{ width: "100%", maxWidth: 1200 }} />
            </div>

            {/* FAQ */}
            <div id="faq" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <FaqSection.Responsive style={{ width: "100%", maxWidth: 1200 }} />
            </div>

            {/* CTA */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <CtaSection.Responsive style={{ width: "100%", maxWidth: 1200 }} />
            </div>

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
