import { ArrowDown, ArrowUpRight } from "lucide-react";

import { InfiniteImageMarquee } from "@/components/gallery/InfiniteImageMarquee";
import { Button } from "@/components/ui/Button";
import { galleryConfig, galleryImages } from "@/data/gallery";

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[82vh] items-center overflow-hidden bg-midnight text-white"
    >
      <div className="absolute inset-0 z-0">
        <InfiniteImageMarquee
          images={galleryImages}
          durationSeconds={galleryConfig.durationSeconds}
          eagerCount={1}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-midnight/92 via-midnight/62 to-midnight/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-brand/[0.06]"
        aria-hidden="true"
      />

      <div className="shell relative z-20 w-full py-24 sm:py-28 lg:py-32">
        <div className="max-w-[640px]">
          <p className="eyebrow text-[10px] tracking-[0.18em] text-accent sm:text-[11px]">
            Technology consulting
          </p>

          <h1
            id="hero-heading"
            className="text-display mt-7 text-white"
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

          <p className="mt-8 max-w-xl text-[1.0625rem] leading-7 text-white/70 sm:leading-8">
            Infimum Consulting delivers software, web, mobile and cloud
            solutions designed around business needs.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
