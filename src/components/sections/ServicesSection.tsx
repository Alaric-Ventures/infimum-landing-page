import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-white py-24 sm:py-28 lg:py-36"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow text-brand-dark">What we do</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="services-heading"
                className="text-h2 mt-6 max-w-[18ch] text-ink"
              >
                Technology solutions built around your business.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="lg:max-w-sm">
            <p className="border-l-2 border-brand/25 pl-5 text-sm leading-6 text-muted lg:mb-1.5">
              Every business arrives with a different mix of legacy systems,
              growth plans and practical constraints. We help you choose the
              right technology — then design and deliver it properly.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map((service, index) => {
            const featured = service.featured === true;

            return (
              <Reveal
                key={service.slug}
                delay={index * 0.04}
                y={20}
                className="h-full"
              >
                <article
                  id={`service-${service.slug}`}
                  className={cn(
                    "group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-xl border p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 focus-within:border-brand/40 sm:p-7",
                    featured
                      ? "border-deep bg-midnight text-white hover:border-brand/60 hover:shadow-[0_30px_80px_-40px_rgba(11,18,33,0.55)]"
                      : "card-surface hover:border-brand/30 hover:bg-card-hover hover:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)]",
                  )}
                >
                  {featured ? (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 blueprint-grid opacity-50 [mask-image:linear-gradient(135deg,black,transparent_75%)]"
                        aria-hidden="true"
                      />
                      <div
                        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28)_0%,transparent_70%)]"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative flex items-start">
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-lg border transition-colors duration-300",
                        featured
                          ? "border-white/15 bg-white/[0.06] text-accent"
                          : "border-card-line bg-white text-brand group-hover:border-brand/20",
                      )}
                    >
                      <ServiceIcon name={service.icon} className="size-5" />
                    </span>
                  </div>

                  <div className="relative">
                    <h3
                      className={cn(
                        "mt-6 font-display text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.025em]",
                        featured ? "text-white" : "text-ink",
                      )}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={cn(
                        "mt-3 text-sm leading-6",
                        featured ? "text-white/60" : "text-muted",
                      )}
                    >
                      {service.summary}
                    </p>
                  </div>

                  <ul
                    className={cn(
                      "relative mt-6 grid gap-2.5 border-t pt-5 text-[13px] leading-5",
                      featured
                        ? "border-white/10 text-white/60"
                        : "border-card-line text-muted",
                    )}
                    aria-label={`${service.title} capabilities`}
                  >
                    {service.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-[7px] size-1 shrink-0 rounded-full",
                            featured ? "bg-accent/80" : "bg-brand/50",
                          )}
                          aria-hidden="true"
                        />
                        {capability}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto flex items-center justify-between gap-4 pt-7">
                    <Link
                      href={`/?service=${service.slug}#contact`}
                      aria-label={`Discuss this service: ${service.title}`}
                      className={cn(
                        "inline-flex items-center gap-2 text-[13px] font-semibold transition-colors duration-200",
                        featured
                          ? "text-white hover:text-accent"
                          : "text-ink hover:text-brand",
                      )}
                    >
                      Discuss this service
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full border transition-transform duration-200 group-hover:translate-x-0.5",
                          featured
                            ? "border-white/15 text-accent"
                            : "border-card-line text-brand",
                        )}
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
