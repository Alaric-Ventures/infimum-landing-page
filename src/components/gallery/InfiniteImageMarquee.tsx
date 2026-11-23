"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import type { GalleryImage } from "@/data/gallery";

type InfiniteImageMarqueeProps = {
  images: readonly GalleryImage[];
  durationSeconds?: number;
  label?: string;
  eagerCount?: number;
};

const CAROUSEL_SIZES =
  "(max-width: 639px) 15.5rem, (max-width: 1023px) 17.5rem, (max-width: 1279px) 18.5rem, 19.5rem";

const CARD_GAP_PX = 20;
const INSTRUCTIONS_ID = "technology-carousel-instructions";

function CarouselCard({
  image,
  index,
  duplicate,
  eagerCount,
}: {
  image: GalleryImage;
  index: number;
  duplicate: boolean;
  eagerCount: number;
}) {
  const eager = !duplicate && index < eagerCount;

  return (
    <li
      data-gallery-card
      className="group/card relative aspect-[4/5] w-[15.5rem] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_-35px_rgba(0,0,0,0.8)] sm:w-[17.5rem] lg:w-[18.5rem] xl:w-[19.5rem]"
    >
      <Image
        src={image.src}
        alt={duplicate ? "" : image.alt}
        fill
        sizes={CAROUSEL_SIZES}
        quality={82}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager && index === 0 ? "high" : "auto"}
        draggable={false}
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-midnight/90 via-midnight/15 to-transparent"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/90">
          {image.caption}
        </p>
        <span
          className="size-1.5 shrink-0 rounded-full bg-accent"
          aria-hidden="true"
        />
      </div>
    </li>
  );
}

export function InfiniteImageMarquee({
  images,
  durationSeconds = 44,
  label = "Technology showcase",
  eagerCount = 0,
}: InfiniteImageMarqueeProps) {
  const x = useMotionValue(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLUListElement>(null);
  const secondGroupRef = useRef<HTMLUListElement>(null);
  const loopWidthRef = useRef(0);
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);
  const pausedRef = useRef(false);
  const [userPaused, setUserPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const focusedRef = useRef(false);
  const draggingRef = useRef(false);
  const [loopWidth, setLoopWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const reducedMotion = mounted ? prefersReducedMotion : false;
  const paused = Boolean(reducedMotion) || userPaused;

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

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
      setLoopWidth(width);

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
    if (
      prefersReducedMotion ||
      pausedRef.current ||
      !visibleRef.current ||
      hoveredRef.current ||
      focusedRef.current ||
      draggingRef.current
    ) {
      return;
    }

    const width = loopWidthRef.current;
    if (!width) return;

    const speed = width / Math.max(20, durationSeconds);
    let next = x.get() - speed * (Math.min(delta, 64) / 1000);

    if (next <= -width) {
      next += width;
    }

    x.set(next);
  });

  function moveByStep(direction: -1 | 1) {
    const width = loopWidthRef.current;
    const firstCard =
      trackRef.current?.querySelector<HTMLElement>("[data-gallery-card]");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 320;
    let next = x.get() + (direction === 1 ? -1 : 1) * (cardWidth + CARD_GAP_PX);

    if (width > 0) {
      while (next <= -width) next += width;
      while (next > 0) next -= width;
    }

    x.set(next);
  }

  function togglePaused() {
    if (prefersReducedMotion) return;
    setUserPaused((value) => !value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveByStep(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveByStep(-1);
    }
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      hoveredRef.current = true;
    }
  }

  function handlePointerLeave() {
    hoveredRef.current = false;
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-brand/[0.12] blur-3xl"
        aria-hidden="true"
      />

      <div
        ref={regionRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        aria-describedby={INSTRUCTIONS_ID}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={() => {
          focusedRef.current = true;
        }}
        onBlurCapture={() => {
          focusedRef.current = false;
        }}
        className="relative rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-4">
          <div className="overflow-hidden rounded-lg [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <motion.div
              ref={trackRef}
              style={{ x, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{ left: -loopWidth, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => {
                draggingRef.current = true;
              }}
              onDragEnd={() => {
                draggingRef.current = false;
              }}
              className="flex w-max cursor-grab touch-pan-y select-none gap-4 will-change-transform active:cursor-grabbing sm:gap-5"
            >
              <ul
                ref={firstGroupRef}
                className="flex shrink-0 gap-4 sm:gap-5"
                aria-label="Showcase items"
              >
                {images.map((image, index) => (
                  <CarouselCard
                    key={image.id}
                    image={image}
                    index={index}
                    duplicate={false}
                    eagerCount={eagerCount}
                  />
                ))}
              </ul>

              <ul
                ref={secondGroupRef}
                aria-hidden="true"
                className="flex shrink-0 gap-4 sm:gap-5"
              >
                {images.map((image, index) => (
                  <CarouselCard
                    key={`duplicate-${image.id}`}
                    image={image}
                    index={index}
                    duplicate
                    eagerCount={eagerCount}
                  />
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePaused}
          disabled={Boolean(reducedMotion)}
          aria-pressed={paused}
          aria-label={paused ? "Play carousel" : "Pause carousel"}
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-midnight/70 text-white/80 backdrop-blur transition-colors hover:bg-midnight/90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {paused ? (
            <Play className="size-4" aria-hidden="true" />
          ) : (
            <Pause className="size-4" aria-hidden="true" />
          )}
        </button>

        <p id={INSTRUCTIONS_ID} className="sr-only">
          Use the left and right arrow keys to move through the showcase, drag
          it with a pointer, or use the pause button to stop automatic motion.
        </p>
      </div>
    </div>
  );
}
