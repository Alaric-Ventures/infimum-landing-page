import { ArrowDown, ArrowUpRight } from "lucide-react";

import { InfiniteImageMarquee } from "@/components/gallery/InfiniteImageMarquee";
import { Button } from "@/components/ui/Button";
import { galleryConfig, galleryImages } from "@/data/gallery";

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

      <div className="shell relative pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20">
          <div className="max-w-xl lg:max-w-none">
            <p
              className="eyebrow animate-rise text-balance text-[9px] tracking-[0.13em] text-accent sm:text-[11px] sm:tracking-[0.2em]"
              style={{ animationDelay: "40ms" }}
            >
              Technology consulting • Digital innovation
            </p>

            <h1
              id="hero-heading"
              className="text-display animate-rise mt-7 text-white"
              style={{ animationDelay: "110ms" }}
            >
              <span className="block">Technology that</span>{" "}
              <span className="block">moves business</span>{" "}
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
              className="animate-rise mt-8 max-w-xl text-[1.0625rem] leading-7 text-white/65 sm:leading-8"
              style={{ animationDelay: "180ms" }}
            >
              Infimum builds practical digital solutions across software, web,
              mobile, cloud and Microsoft 365.
            </p>

            <div
              className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "250ms" }}
            >
              <Button asChild variant="light" size="lg" className="w-full sm:w-auto">
                <a href="#services">
                  Explore services
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
                  Let’s talk
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <div
            className="animate-fade relative min-w-0"
            style={{ animationDelay: "200ms" }}
          >
            <InfiniteImageMarquee
              images={galleryImages}
              durationSeconds={galleryConfig.durationSeconds}
              label="Technology showcase"
              eagerCount={3}
            />
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
