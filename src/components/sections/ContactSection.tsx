import { Suspense } from "react";
import { ArrowUpRight, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
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
        className="pointer-events-none absolute -left-40 top-1/4 size-[30rem] rounded-full bg-brand/[0.05] blur-[110px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow text-brand">Contact</p>
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
                    className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 transition-colors duration-200 hover:border-brand/30 hover:bg-canvas sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-canvas text-brand transition-colors duration-200 group-hover:bg-white">
                        <Phone className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          {phone.region} · {phone.city}
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
                    <span className="mt-1 font-mono text-[10px] text-brand/70">
                      01
                    </span>
                    We review your enquiry and the context you’ve shared.
                  </li>
                  <li className="flex items-start gap-3 text-sm leading-6 text-muted">
                    <span className="mt-1 font-mono text-[10px] text-brand/70">
                      02
                    </span>
                    We come back to arrange a short, no-obligation conversation.
                  </li>
                </ol>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} y={22}>
            <div className="relative rounded-2xl border border-line bg-white p-5 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.5)] sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
                <div>
                  <h3 className="text-h3 text-ink">Project enquiry</h3>
                  <p className="mt-1.5 text-sm text-muted">
                    Fields marked <span className="text-brand">*</span> are
                    required.
                  </p>
                </div>
                <span className="hidden font-mono text-[10px] tracking-[0.16em] text-muted/60 sm:block">
                  ENQ / 01
                </span>
              </div>

              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
