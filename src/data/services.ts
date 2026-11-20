export const serviceSlugs = [
  "content-management",
  "mobile-application-development",
  "application-development",
  "website-design-development",
  "infrastructure-cloud",
  "microsoft-365",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const enquiryServiceValues = [...serviceSlugs, "general"] as const;
export type EnquiryServiceValue = (typeof enquiryServiceValues)[number];

export type ServiceIconName =
  | "layout-template"
  | "smartphone"
  | "code"
  | "globe"
  | "cloud"
  | "layout-grid";

export type Service = {
  slug: ServiceSlug;
  title: string;
  legacyName?: string;
  summary: string;
  capabilities: readonly string[];
  icon: ServiceIconName;
  featured?: boolean;
};

export const services: readonly Service[] = [
  {
    slug: "content-management",
    title: "Content Management System",
    summary:
      "Structured content platforms that let your team publish, govern and evolve digital content with confidence — without waiting on a release cycle.",
    capabilities: [
      "Content architecture and modelling",
      "CMS implementation and integration",
      "Editorial workflows and publishing",
      "Migration and ongoing support",
    ],
    icon: "layout-template",
    featured: true,
  },
  {
    slug: "mobile-application-development",
    title: "Mobile Application Development",
    summary:
      "Purpose-built mobile applications shaped around real user needs, from the first concept through to a reliable, supported product.",
    capabilities: [
      "Mobile strategy and consulting",
      "iOS and Android application delivery",
      "Customer-facing and internal tools",
      "Interface design focused on adoption",
    ],
    icon: "smartphone",
  },
  {
    slug: "application-development",
    title: "Application Development",
    summary:
      "Custom software that fits the way your business actually operates — practical systems, clean integrations and maintainable foundations.",
    capabilities: [
      "Custom business applications",
      "Enterprise application delivery",
      "Systems integration and data flow",
      "Modernisation of existing applications",
    ],
    icon: "code",
  },
  {
    slug: "website-design-development",
    title: "Website Design & Development",
    summary:
      "Fast, accessible websites, web applications and enterprise portals that represent your business properly and support the work behind it.",
    capabilities: [
      "Responsive website design",
      "Corporate and marketing websites",
      "Web applications and enterprise portals",
      "Performance, accessibility and SEO foundations",
    ],
    icon: "globe",
  },
  {
    slug: "infrastructure-cloud",
    title: "Infrastructure & Cloud Computing",
    summary:
      "Cloud and infrastructure solutions that give your systems a secure, resilient foundation — planned carefully and supported in operation.",
    capabilities: [
      "Cloud consulting and planning",
      "Infrastructure design and migration",
      "Hosted environment configuration",
      "Operational support and improvement",
    ],
    icon: "cloud",
  },
  {
    slug: "microsoft-365",
    title: "Microsoft 365 Services",
    legacyName: "Office 365 Service",
    summary:
      "Practical Microsoft 365 deployment and management that helps teams collaborate, communicate and work productively with the tools they already know.",
    capabilities: [
      "Microsoft 365 and Office 365 deployment",
      "Tenant and identity configuration",
      "Collaboration and productivity setup",
      "User management and adoption guidance",
    ],
    icon: "layout-grid",
  },
] as const;

export const enquiryServiceOptions: ReadonlyArray<{
  value: EnquiryServiceValue;
  label: string;
}> = [
  ...services.map((service) => ({
    value: service.slug,
    label: service.title,
  })),
  { value: "general", label: "General enquiry" },
];

export function getServiceLabel(value: EnquiryServiceValue): string {
  return (
    enquiryServiceOptions.find((option) => option.value === value)?.label ??
    "General enquiry"
  );
}
