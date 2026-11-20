"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Button } from "@/components/ui/Button";
import { navigation, sectionIds } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-line bg-white/90 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="shell flex h-[76px] items-center justify-between gap-4">
          <a
            href="#home"
            aria-label="Infimum Consulting — back to top"
            className="shrink-0 rounded-md"
            onClick={() => setActiveSection("home")}
          >
            <span
              className={cn(
                "inline-flex items-center rounded-md transition-all duration-300",
                scrolled
                  ? "bg-transparent p-0"
                  : "bg-white px-2.5 py-2 shadow-[0_12px_36px_-16px_rgba(0,0,0,0.55)]",
              )}
            >
              <Logo priority alt="" />
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center lg:flex">
            {navigation.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "relative rounded-md px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 xl:px-4",
                    scrolled
                      ? isActive
                        ? "text-ink"
                        : "text-muted hover:text-ink"
                      : isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-px origin-left transition-transform duration-300 xl:inset-x-4",
                      isActive ? "scale-x-100" : "scale-x-0",
                      scrolled ? "bg-brand" : "bg-accent",
                    )}
                  />
                </a>
              );
            })}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Button
              asChild
              variant={scrolled ? "primary" : "light"}
              size="sm"
              className="h-11 px-5"
            >
              <a href="#contact">
                Let’s talk
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors lg:hidden",
              scrolled
                ? "border-line bg-white text-ink hover:bg-canvas"
                : "border-white/15 bg-white/[0.04] text-white hover:bg-white/10",
            )}
          >
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </button>
        </div>
      </header>

      <MobileNavigation open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
