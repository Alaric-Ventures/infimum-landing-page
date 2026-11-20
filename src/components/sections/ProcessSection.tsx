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

        <div className="relative mt-14 lg:mt-16">
          <span
            className="absolute bottom-2 left-[21px] top-2 w-px bg-line lg:hidden"
            aria-hidden="true"
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.number} className="relative pl-16 lg:pl-0">
                {index < steps.length - 1 ? (
                  <span
                    className="absolute left-11 right-[-1.5rem] top-[21px] hidden h-px bg-line lg:block"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="absolute left-0 top-0 z-10 flex size-11 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[11px] font-medium tracking-[0.08em] text-brand lg:static lg:mb-6">
                  {step.number}
                </span>
                <Reveal delay={index * 0.06} y={16}>
                  <div className="pt-1.5 lg:pt-0">
                    <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
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
        </div>

        <p className="mt-12 max-w-2xl border-t border-line pt-6 text-xs leading-5 text-muted">
          This is a proposed consulting workflow. The shape and sequence of each
          engagement is agreed with you.
        </p>
      </div>
    </section>
  );
}
