"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { GalleryImage } from "@/data/gallery";

const InfiniteImageMarquee = dynamic(
  () =>
    import("@/components/gallery/InfiniteImageMarquee").then(
      (mod) => mod.InfiniteImageMarquee,
    ),
  { ssr: false },
);

type DeferredHeroMarqueeProps = {
  images: readonly GalleryImage[];
  durationSeconds?: number;
};

/**
 * Delays loading and mounting the interactive marquee until after the page
 * has finished loading and painted the server-rendered LCP hero image.
 */
export function DeferredHeroMarquee({
  images,
  durationSeconds = 72,
}: DeferredHeroMarqueeProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const schedule = () => {
      timer = window.setTimeout(() => setReady(true), 2500);
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

  if (!ready) return null;

  return (
    <div className="absolute inset-0">
      <InfiniteImageMarquee
        images={images}
        durationSeconds={durationSeconds}
        eagerCount={1}
      />
    </div>
  );
}
