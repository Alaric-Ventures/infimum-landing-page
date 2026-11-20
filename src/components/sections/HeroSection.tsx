import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";

import { HeroVisual } from "@/components/sections/HeroVisual";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-midnight text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 -top-56 size-[34rem] rounded-full bg-brand/20 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/3 size-[26rem] rounded-full bg-accent/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="shell relative pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
          <div>
            <p
              className="eyebrow animate-rise text-accent"
              style={{ animationDelay: "60ms" }}
            >
              Technology consulting · Digital innovation
            </p>

            <h1
              id="hero-heading"
              className="text-display animate-rise mt-7 text-white"
              style={{ animationDelay: "140ms" }}
            >
              <span className="block">Technology that</span>
              <span className="block">moves business</span>
              <span className="relative inline-block text-accent">
                forward.
                <svg
                  className="absolute -bottom-2 left-0 h-2.5 w-full text-accent/50 sm:-bottom-3"
                  viewBox="0 0 240 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9.5C54 4.5 138 2 238 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="animate-rise mt-8 max-w-xl text-[1.0625rem] leading-7 text-white/65 sm:text-lg sm:leading-8"
              style={{ animationDelay: "220ms" }}
            >
              Infimum Consulting helps organisations turn technology ambition
              into working systems — custom software, mobile and web
              experiences, cloud infrastructure and Microsoft 365, delivered
              with a clear business purpose.
            </p>

            <div
              className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "300ms" }}
            >
              <Button asChild variant="light" size="lg" className="w-full sm:w-auto">
                <a href="#services">
                  Explore our services
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline-light"
                size="lg"
                className="w-full sm:w-auto"
              >
                <a href="#contact">
                  Let’s discuss your project
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>

            <div
              className="animate-rise mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60"
              style={{ animationDelay: "380ms" }}
            >
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                Australia · United States
              </span>
              <span className="hidden size-1 rounded-full bg-white/20 sm:block" aria-hidden="true" />
              <span>Consulting, engineering and support</span>
            </div>
          </div>

          <div
            className="animate-fade relative mx-auto w-full max-w-[33rem] lg:max-w-none"
            style={{ animationDelay: "260ms" }}
          >
            <HeroVisual />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
