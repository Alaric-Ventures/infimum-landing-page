"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { GalleryImage } from "@/data/gallery";

type InfiniteImageMarqueeProps = {
  images: readonly GalleryImage[];
  durationSeconds?: number;
  label?: string;
  eagerCount?: number;
};

const PANEL_SIZES = "100vw";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * CSS-animation-driven infinite horizontal marquee.
 *
 * On initial load, only the first (LCP) slide is rendered so Chrome's
 * horizontal lazy-load threshold (~2500px on 4G) does not eagerly fetch
 * off-screen slides and compete with the LCP image. Remaining slides and
 * the duplicate loop track mount once the browser is idle.
 */
export function InfiniteImageMarquee({
  images,
  durationSeconds = 72,
  eagerCount = 1,
}: InfiniteImageMarqueeProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const [slidesReady, setSlidesReady] = useState(false);

  const playing = userPlaying ?? !prefersReducedMotion;

  // Defer mounting off-screen slides & starting marquee animation until after
  // initial paint/LCP window so extra slides never compete on Slow 4G.
  useEffect(() => {
    let timer: number | undefined;
    const schedule = () => {
      timer = window.setTimeout(() => setSlidesReady(true), 2500);
    };
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
    return () => {
      window.removeEventListener("load", schedule);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  // Pause when off-screen
  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = playing && visible && slidesReady;
  const visibleImages = slidesReady ? images : images.slice(0, 1);

  return (
    <div
      ref={regionRef}
      data-hero-carousel="true"
      className="relative h-full w-full overflow-hidden"
    >
      <div
        data-hero-carousel-track="true"
        className="flex h-full w-max"
        aria-hidden="true"
        style={
          slidesReady
            ? {
                ["--marquee-count" as string]: images.length,
                animation: `marquee-scroll ${durationSeconds}s linear infinite`,
                animationPlayState: shouldAnimate ? "running" : "paused",
              }
            : undefined
        }
      >
        {/* First group */}
        <div className="flex h-full shrink-0">
          {visibleImages.map((image, index) => (
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
                quality={65}
                loading={index < eagerCount ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={
                  index === 0 && index < eagerCount ? "high" : "auto"
                }
                draggable={false}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Duplicate group for seamless loop — mounted after idle */}
        {slidesReady ? (
          <div className="flex h-full shrink-0" aria-hidden="true">
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
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setUserPlaying(!playing)}
        aria-pressed={playing}
        aria-label={playing ? "Pause background carousel" : "Play background carousel"}
        className="absolute bottom-4 right-4 z-20 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-midnight/70 text-white/85 backdrop-blur transition-colors hover:bg-midnight/90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {playing ? (
          <Pause className="size-4" aria-hidden="true" />
        ) : (
          <Play className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
