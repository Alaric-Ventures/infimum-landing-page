import { ArrowUp, ArrowUpRight, Phone } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { navigation } from "@/data/navigation";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-midnight text-white">
      <div
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="shell relative py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <a
              href="#home"
              aria-label="Infimum Consulting — back to top"
              className="inline-flex items-center rounded-md bg-white px-3 py-2"
            >
              <Logo alt="" />
            </a>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/55">
              {siteConfig.shortDescription}
            </p>
            <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
              Australia · United States
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Navigate
            </h2>
            <ul className="mt-5 space-y-3">
              {navigation.slice(1).map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <a
                    href={`#service-${service.slug}`}
                    className="text-sm leading-5 text-white/65 transition-colors hover:text-white"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Contact
            </h2>
            <ul className="mt-5 space-y-4">
              {siteConfig.phones.map((phone) => (
                <li key={phone.region}>
                  <a
                    href={`tel:${phone.href}`}
                    className="group inline-flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-accent">
                      <Phone className="size-3.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-white/55">
                        {phone.region} · {phone.city}
                      </span>
                      <span className="mt-1 block text-sm text-white/70 transition-colors group-hover:text-white">
                        {phone.display}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 border-b border-white/20 pb-1 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent"
            >
              Send an enquiry
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Infimum Consulting. All rights reserved.</p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            Back to top
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
