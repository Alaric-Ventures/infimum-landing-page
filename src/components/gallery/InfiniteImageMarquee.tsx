"use client";

import Image from "next/image";
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
};

const GALLERY_SIZES =
  "(max-width: 639px) 17.5rem, (max-width: 1023px) 21rem, (max-width: 1279px) 24rem, 26rem";

const CARD_GAP_PX = 20;
const INSTRUCTIONS_ID = "gallery-instructions";

function GalleryCard({
  image,
  duplicate = false,
}: {
  image: GalleryImage;
  duplicate?: boolean;
}) {
  return (
    <li
      data-gallery-card
      className="group/card relative aspect-[4/3] w-[17.5rem] shrink-0 overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)] sm:w-[21rem] lg:w-[24rem] xl:w-[26rem]"
    >
      <Image
        src={image.src}
        alt={duplicate ? "" : image.alt}
        fill
        sizes={GALLERY_SIZES}
        quality={80}
        loading="lazy"
        draggable={false}
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-midnight/85 via-midnight/15 to-transparent"
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
}: InfiniteImageMarqueeProps) {
  const x = useMotionValue(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLUListElement>(null);
  const secondGroupRef = useRef<HTMLUListElement>(null);
  const loopWidthRef = useRef(0);
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const draggingRef = useRef(false);
  const [loopWidth, setLoopWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();

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
    <div
      ref={regionRef}
      role="region"
      aria-label="Technology in motion image gallery"
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
      className="relative focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
    >
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
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
          className="flex w-max cursor-grab touch-pan-y select-none gap-4 pl-5 will-change-transform active:cursor-grabbing sm:gap-5 sm:pl-8 lg:pl-16"
        >
          <ul
            ref={firstGroupRef}
            className="flex shrink-0 gap-4 sm:gap-5"
            aria-label="Technology showcase"
          >
            {images.map((image) => (
              <GalleryCard key={image.id} image={image} />
            ))}
          </ul>

          <ul
            ref={secondGroupRef}
            aria-hidden="true"
            className="flex shrink-0 gap-4 sm:gap-5"
          >
            {images.map((image) => (
              <GalleryCard key={`duplicate-${image.id}`} image={image} duplicate />
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
