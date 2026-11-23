import { Cloud, Code2, Compass, LifeBuoy, SlidersHorizontal, Target, Workflow } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const propositions = [
  {
    title: "Business-led decisions",
    description:
      "Technology choices are tested against operational goals and commercial reality.",
    icon: Target,
  },
  {
    title: "End-to-end delivery",
    description:
      "From early planning through build, launch and ongoing support.",
    icon: Workflow,
  },
  {
    title: "Engagement that fits",
    description:
      "Support and delivery options shaped around each client’s needs and budget.",
    icon: SlidersHorizontal,
  },
];

const operatingLayers = [
  {
    title: "Strategy & architecture",
    description: "Business requirements, planning and system design.",
    icon: Compass,
    theme: "light" as const,
  },
  {
    title: "Engineering & integration",
    description: "Custom applications and connected business systems.",
    icon: Code2,
    theme: "dark" as const,
  },
  {
    title: "Cloud & infrastructure",
    description: "Cloud platforms, infrastructure and migration.",
    icon: Cloud,
    theme: "light" as const,
  },
  {
    title: "Support & optimisation",
    description: "Ongoing support, refinement and improvement.",
    icon: LifeBuoy,
    theme: "light" as const,
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-canvas py-24 sm:py-28 lg:py-36"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-brand/[0.06] blur-[100px]"
        aria-hidden="true"
      />
      <div className="shell relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-20">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-brand-dark">About Infimum Consulting</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 id="about-heading" className="text-h2 mt-6 max-w-[16ch] text-ink">
                The business comes first. The technology follows.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-7 max-w-xl space-y-5 text-[1.0625rem] leading-7 text-muted">
                <p>
                  Infimum Consulting is an IT consultancy. We work with
                  organisations to plan, design and deliver technology across
                  custom applications, digital experiences, cloud infrastructure
                  and Microsoft 365.
                </p>
                <p>
                  Our starting point is the business need: how work gets done,
                  where time is lost and what your teams and customers actually
                  require. From there, we shape a solution that fits — then stay
                  involved as it is implemented, adopted and refined.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 border-l-2 border-brand/30 pl-5">
                <p className="max-w-lg text-sm leading-6 text-ink/70">
                  Our mission is straightforward: high-quality technology
                  services at a sensible cost, with engagement options that
                  respect each client’s needs and budget.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-10 border-t border-line">
                {propositions.map((item) => {
                  const Icon = item.icon;
                  return (
                  <li
                    key={item.title}
                    className="grid gap-2 border-b border-line py-5 sm:grid-cols-[auto_1fr] sm:gap-6"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg border border-line bg-canvas text-brand sm:mt-1">
                      <Icon className="size-[16px]" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand"
              >
                Start a conversation
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:self-center xl:col-span-6 xl:col-start-7">
            <Reveal delay={0.1} y={24}>
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-brand/[0.05] blur-2xl lg:-inset-10"
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)]">
                  <div className="relative p-6 sm:p-8">
                    <div
                      className="pointer-events-none absolute inset-0 dot-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
                      aria-hidden="true"
                    />

                    <div className="relative grid grid-cols-1 gap-3">
                      {operatingLayers.map((layer) => {
                        const Icon = layer.icon;
                        const isDark = layer.theme === "dark";
                        return (
                          <div
                            key={layer.title}
                            className={cn(
                              "relative flex items-start gap-4 rounded-xl border p-4 transition-colors duration-300 sm:items-center sm:gap-5 sm:p-5",
                              isDark
                                ? "border-deep bg-midnight text-white shadow-[0_20px_50px_-30px_rgba(11,18,33,0.8)]"
                                : "card-surface hover:border-brand/25",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                                isDark
                                  ? "border-white/15 bg-white/[0.06] text-accent"
                                  : "border-card-line bg-white text-brand",
                              )}
                              aria-hidden="true"
                            >
                              <Icon className="size-[18px]" />
                            </span>

                            <div className="min-w-0">
                              <h3
                                className={cn(
                                  "font-display text-[17px] font-semibold leading-snug tracking-[-0.02em]",
                                  isDark ? "text-white" : "text-ink",
                                )}
                              >
                                {layer.title}
                              </h3>
                              <p
                                className={cn(
                                  "mt-1 text-[13px] leading-5",
                                  isDark ? "text-white/55" : "text-muted",
                                )}
                              >
                                {layer.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
