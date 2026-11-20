import type { Metadata } from "next";

import { AboutSection } from "@/components/sections/AboutSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

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
      <GallerySection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
