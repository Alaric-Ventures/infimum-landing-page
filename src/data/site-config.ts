const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://infimumconsulting.com.au"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "Infimum Consulting",
  url: siteUrl,
  title: "Infimum Consulting | IT Consulting, Software & Cloud Solutions",
  description:
    "IT consulting, custom software, cloud and Microsoft 365 solutions for organisations across Australia and the United States.",
  shortDescription:
    "Technology consulting, software engineering and cloud solutions for organisations in Australia and the United States.",
  tagline: "Technology that moves business forward.",
  phones: [
    {
      region: "Australia",
      city: "Sydney, NSW",
      display: "+61 405 364 625",
      href: "+61405364625",
    },
    {
      region: "United States",
      city: "New York, US",
      display: "+1 970 387 8989",
      href: "+19703878989",
    },
  ],
} as const;
