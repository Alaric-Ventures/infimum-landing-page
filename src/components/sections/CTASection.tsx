import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-y border-white/10 bg-deep text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-40 [mask-image:linear-gradient(to_right,black,transparent_85%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 size-[24rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 hidden size-[30rem] -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[14%] rounded-full border border-dashed border-white/[0.08] motion-safe:animate-[spin-slow_140s_linear_infinite]" />
        <div className="absolute inset-[30%] rounded-full border border-white/[0.06]" />
        <div className="absolute left-[22%] top-[18%] size-1.5 rounded-full bg-accent" />
      </div>

      <div className="shell relative py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow text-accent">Next step</p>
            <h2 id="cta-heading" className="text-display mt-6 max-w-[11ch] text-white">
              Let’s build what’s next.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-sm text-[1.0625rem] leading-7 text-white/60">
              Bring us the technology challenge, the digital opportunity or the
              project that has been waiting for the right moment. We’ll start
              with the business context.
            </p>
            <Button asChild variant="light" size="lg" className="mt-8">
              <a href="#contact">
                Start a conversation
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
