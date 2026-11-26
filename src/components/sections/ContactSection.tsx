import { ArrowUpRight, Check, Phone } from "lucide-react";

import { LazyContactForm } from "@/components/forms/LazyContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site-config";

function ContactFormFallback() {
  return (
    <div className="mt-7 space-y-5" aria-hidden="true">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-[4.75rem] animate-pulse rounded-lg bg-line/60" />
        <div className="h-[4.75rem] animate-pulse rounded-lg bg-line/60" />
      </div>
      <div className="h-[4.75rem] animate-pulse rounded-lg bg-line/60" />
      <div className="h-[4.75rem] animate-pulse rounded-lg bg-line/60" />
      <div className="h-[10.5rem] animate-pulse rounded-lg bg-line/60" />
      <div className="h-12 animate-pulse rounded-lg bg-line/60" />
    </div>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-36"
    >
      <div
        className="pointer-events-none absolute -left-40 top-1/4 size-[30rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow text-brand-dark">Contact</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="contact-heading"
                className="text-h2 mt-6 max-w-[14ch] text-ink"
              >
                Let’s talk about your next project.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-md text-[1.0625rem] leading-7 text-muted">
                Whether you have a defined brief or just a problem worth
                solving, we’d like to hear about it. Share a little context and
                we’ll take it from there.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 space-y-3">
                {siteConfig.phones.map((phone) => (
                  <a
                    key={phone.region}
                    href={`tel:${phone.href}`}
                    className="card-surface group flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors duration-200 hover:border-brand/30 hover:bg-card-hover sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-card-line bg-white text-brand transition-colors duration-200 group-hover:border-brand/25">
                        <Phone className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          {phone.region}
                        </p>
                        <p className="mt-1 truncate font-display text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink sm:text-lg">
                          {phone.display}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 border-t border-line pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  What happens next
                </p>
                <ol className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-sm leading-6 text-muted">
                    <Check
                      className="mt-1 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    We review your enquiry and the context you’ve shared.
                  </li>
                  <li className="flex items-start gap-3 text-sm leading-6 text-muted">
                    <Check
                      className="mt-1 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    We come back to arrange a short, no-obligation conversation.
                  </li>
                </ol>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} y={22}>
            <div className="card-surface relative rounded-2xl border p-5 shadow-[0_2px_4px_rgba(15,23,42,0.03),0_30px_80px_-56px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
              <div className="border-b border-card-line pb-6">
                <div>
                  <h3 className="text-h3 text-ink">Project enquiry</h3>
                  <p className="mt-1.5 text-sm text-muted">
                    Fields marked <span className="text-brand">*</span> are
                    required.
                  </p>
                </div>
              </div>

              <LazyContactForm fallback={<ContactFormFallback />} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
