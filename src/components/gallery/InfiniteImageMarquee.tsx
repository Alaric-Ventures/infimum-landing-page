"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { GalleryImage } from "@/data/gallery";

type InfiniteImageMarqueeProps = {
  images: readonly GalleryImage[];
  durationSeconds?: number;
  label?: string;
  eagerCount?: number;
};

const PANEL_SIZES = "100vw";

export function InfiniteImageMarquee({
  images,
  durationSeconds = 72,
  eagerCount = 1,
}: InfiniteImageMarqueeProps) {
  const x = useMotionValue(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const secondGroupRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const visibleRef = useRef(false);
  const [userWantsMotion, setUserWantsMotion] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const reducedMotion = mounted ? Boolean(prefersReducedMotion) : false;
  const motionEnabled = userWantsMotion === null ? !reducedMotion : userWantsMotion;

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? false;
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const firstGroup = firstGroupRef.current;
    const secondGroup = secondGroupRef.current;
    if (!firstGroup || !secondGroup) return;

    const measure = () => {
      const width = secondGroup.offsetLeft - firstGroup.offsetLeft;
      if (width <= 0) return;

      loopWidthRef.current = width;

      const current = x.get();
      if (current <= -width) {
        x.set(current + width);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(firstGroup);
    resizeObserver.observe(secondGroup);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [images.length, x]);

  useAnimationFrame((_time, delta) => {
    if (!motionEnabled || !visibleRef.current) return;

    const width = loopWidthRef.current;
    if (!width) return;

    const speed = width / Math.max(20, durationSeconds);
    let next = x.get() - speed * (Math.min(delta, 64) / 1000);

    if (next <= -width) {
      next += width;
    }

    x.set(next);
  });

  function toggleMotion() {
    setUserWantsMotion(!motionEnabled);
  }

  return (
    <div
      ref={regionRef}
      data-hero-carousel="true"
      className="relative h-full w-full overflow-hidden"
    >
      <motion.div
        ref={trackRef}
        data-hero-carousel-track="true"
        style={{ x, willChange: "transform" }}
        className="flex h-full w-max"
        aria-hidden="true"
      >
        <div ref={firstGroupRef} className="flex h-full shrink-0">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative h-full w-screen shrink-0 overflow-hidden"
              aria-hidden="true"
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes={PANEL_SIZES}
                quality={75}
                loading={index < eagerCount ? "eager" : "lazy"}
                fetchPriority={
                  index === 0 && index < eagerCount ? "high" : "auto"
                }
                draggable={false}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div
          ref={secondGroupRef}
          className="flex h-full shrink-0"
          aria-hidden="true"
        >
          {images.map((image) => (
            <div
              key={`duplicate-${image.id}`}
              className="relative h-full w-screen shrink-0 overflow-hidden"
              aria-hidden="true"
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes={PANEL_SIZES}
                quality={75}
                loading="lazy"
                draggable={false}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <button
        type="button"
        onClick={toggleMotion}
        aria-pressed={motionEnabled}
        aria-label={motionEnabled ? "Pause background carousel" : "Play background carousel"}
        className="absolute bottom-4 right-4 z-20 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-midnight/70 text-white/85 backdrop-blur transition-colors hover:bg-midnight/90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {motionEnabled ? (
          <Pause className="size-4" aria-hidden="true" />
        ) : (
          <Play className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
