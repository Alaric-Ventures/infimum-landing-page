import { ArrowUpRight, Code, Compass, Gauge, Layers, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    title: "The business defines the brief",
    description:
      "We begin with how your organisation works, where the friction is and what the outcome needs to be — not with a product in search of a problem.",
    icon: Compass,
  },
  {
    title: "Solutions sized to the need",
    description:
      "We scope for the value at stake, with engagement options that respect your budget rather than inflating the programme.",
    icon: Gauge,
  },
  {
    title: "Engineering you can maintain",
    description:
      "Clean architecture, sensible integrations and documentation that leave your team with a system it can actually operate.",
    icon: Code,
  },
  {
    title: "One partner across the stack",
    description:
      "Web, mobile, applications, cloud and Microsoft 365 brought together as a coherent service — not disconnected projects.",
    icon: Layers,
  },
];

export function WhyChooseUsSection() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="relative overflow-hidden bg-midnight py-24 text-white sm:py-28 lg:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-50 [mask-image:linear-gradient(120deg,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-0 size-[30rem] rounded-full bg-brand/15 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 size-[26rem] rounded-full bg-accent/[0.07] blur-[120px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-accent">Why Infimum Consulting</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="why-us-heading"
                className="text-h2 mt-6 max-w-[13ch] text-white"
              >
                The right technology. A smarter way forward.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-md text-[1.0625rem] leading-7 text-white/60">
                Technology is only useful when it makes the work better. We
                bring consulting judgement and hands-on engineering together, so
                decisions are grounded in delivery — and the solution is
                grounded in your business.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-white/55">
                  <span className="font-medium text-white">Our principle:</span>{" "}
                  no technology for technology’s sake. Every choice should earn
                  its place.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent"
              >
                Talk through your requirements
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="border-t border-white/10">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="group border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.015]"
                    >
                      <div className="flex items-start gap-5">
                        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-accent transition-colors duration-300 group-hover:border-accent/30">
                          <Icon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] tracking-[0.16em] text-white/55">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className="text-lg font-medium tracking-[-0.015em] text-white">
                              {feature.title}
                            </h3>
                          </div>
                          <p className="mt-2 max-w-lg text-sm leading-6 text-white/50">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
