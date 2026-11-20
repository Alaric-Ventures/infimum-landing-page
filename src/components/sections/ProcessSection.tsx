import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We listen, examine the current state and agree what the solution needs to achieve — for the business and the people using it.",
    detail: "Context · Requirements",
  },
  {
    number: "02",
    title: "Strategize",
    description:
      "We identify the right technology, scope and sequence, with the trade-offs and risks made clear before delivery begins.",
    detail: "Options · Direction",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Design and engineering move forward in focused increments, with progress visible and decisions documented along the way.",
    detail: "Design · Engineering",
  },
  {
    number: "04",
    title: "Evolve",
    description:
      "We support launch, refine what matters and adapt the solution as your business needs change.",
    detail: "Support · Improvement",
  },
];

export function ProcessSection() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="relative overflow-hidden bg-canvas py-24 sm:py-28 lg:py-32"
    >
      <div className="shell relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow text-brand-dark">Our approach</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="approach-heading"
                className="text-h2 mt-6 max-w-[14ch] text-ink"
              >
                From vision to execution.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-sm leading-6 text-muted lg:mb-1.5">
              A practical, transparent path from the first conversation to a
              solution in use. Each stage is shaped around the engagement — not
              forced into a fixed formula.
            </p>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.number}>
              <Reveal delay={index * 0.06} y={16} className="h-full">
                <div className="relative h-full border-t border-slate-300/80 pt-8">
                  <span className="absolute -top-[22px] left-0 flex size-11 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[11px] font-medium tracking-[0.08em] text-brand">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                  <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                    {step.detail}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-2xl border-t border-line pt-6 text-xs leading-5 text-muted">
          This is a proposed consulting workflow. The shape and sequence of each
          engagement is agreed with you.
        </p>
      </div>
    </section>
  );
}
