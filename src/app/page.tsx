import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { AboutSection } from "@/components/sections/AboutSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

// Lazy-load below-fold sections to reduce initial JS bundle.
// These sections are well below the viewport on mobile and don't affect LCP/FCP.
const WhyChooseUsSection = dynamic(
  () =>
    import("@/components/sections/WhyChooseUsSection").then(
      (mod) => mod.WhyChooseUsSection,
    ),
  { ssr: true },
);
const ProcessSection = dynamic(
  () =>
    import("@/components/sections/ProcessSection").then(
      (mod) => mod.ProcessSection,
    ),
  { ssr: true },
);
const CTASection = dynamic(
  () =>
    import("@/components/sections/CTASection").then((mod) => mod.CTASection),
  { ssr: true },
);
const ContactSection = dynamic(
  () =>
    import("@/components/sections/ContactSection").then(
      (mod) => mod.ContactSection,
    ),
  { ssr: true },
);

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: `${siteConfig.url}/branding/infimum-logo.png`,
  image: `${siteConfig.url}/api/og`,
  telephone: siteConfig.phones.map((phone) => phone.display),
  areaServed: [
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: services.map((service) => service.title),
  contactPoint: siteConfig.phones.map((phone) => ({
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: phone.display,
    areaServed: phone.region,
    availableLanguage: "English",
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Technology consulting services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
      },
    })),
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, developer-authored content only — no user input enters this JSON.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <CapabilitiesSection />
      <AboutSection />
      <ServicesSection />
      <div className="content-defer">
        <WhyChooseUsSection />
      </div>
      <div className="content-defer">
        <ProcessSection />
      </div>
      <div className="content-defer">
        <CTASection />
      </div>
      <div className="content-defer">
        <ContactSection />
      </div>
    </>
  );
}
