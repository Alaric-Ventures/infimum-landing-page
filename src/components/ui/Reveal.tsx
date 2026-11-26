"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

const revealedElements = new WeakMap<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;
let pendingReveals: Element[] = [];
let rafScheduled = false;

function flushReveals() {
  rafScheduled = false;
  const batch = pendingReveals;
  pendingReveals = [];
  for (const el of batch) {
    el.setAttribute("data-reveal", "visible");
    revealedElements.delete(el);
  }
}

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            pendingReveals.push(entry.target);
            sharedObserver?.unobserve(entry.target);
          }
        }
        if (pendingReveals.length > 0 && !rafScheduled) {
          rafScheduled = true;
          requestAnimationFrame(flushReveals);
        }
      },
      { rootMargin: "-70px 0px" },
    );
  }
  return sharedObserver;
}

/**
 * Lightweight reveal component using a single shared IntersectionObserver
 * and CSS attribute transitions batched in requestAnimationFrame.
 */
export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-reveal", "visible");
      return;
    }

    const observer = getSharedObserver();
    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, []);

  const style = {
    "--reveal-delay": `${delay}s`,
    "--reveal-y": `${y}px`,
  } as CSSProperties;

  return (
    <div ref={ref} data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}
