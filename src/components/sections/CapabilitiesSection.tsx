import { Cloud, Code, Compass, Workflow } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";

const capabilities = [
  {
    title: "Digital transformation",
    description: "Modernising how the business works.",
    icon: Compass,
  },
  {
    title: "Software engineering",
    description: "Applications built for real operations.",
    icon: Code,
  },
  {
    title: "Cloud solutions",
    description: "Infrastructure that supports growth.",
    icon: Cloud,
  },
  {
    title: "Technology consulting",
    description: "Decisions grounded in business need.",
    icon: Workflow,
  },
];

export function CapabilitiesSection() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="relative border-b border-line bg-white"
    >
      <h2 id="capabilities-heading" className="sr-only">
        Core capabilities
      </h2>
      <div className="shell">
        <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-2 sm:py-6 lg:grid-cols-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Reveal
                key={capability.title}
                delay={index * 0.06}
                y={12}
                className="h-full"
              >
                <div className="card-surface group flex h-full flex-col justify-between gap-8 rounded-xl border p-6 transition-colors duration-300 hover:bg-card-hover sm:p-7 lg:p-8">
                  <div className="flex items-start">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-card-line bg-white text-brand transition-colors duration-300 group-hover:border-brand/25">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                      {capability.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-5.5 text-muted">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
