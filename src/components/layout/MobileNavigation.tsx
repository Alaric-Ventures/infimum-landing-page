"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Phone, X } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";

type MobileNavigationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavigation({
  open,
  onOpenChange,
}: MobileNavigationProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-midnight/70 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.25s_ease-out]" />
        <Dialog.Content
          id="mobile-navigation"
          aria-describedby={undefined}
          className="fixed inset-0 z-[70] flex flex-col bg-midnight text-white outline-none data-[state=open]:animate-[fade-in_0.3s_ease-out]"
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <div className="shell flex h-[76px] shrink-0 items-center justify-between">
            <span className="inline-flex items-center rounded-md bg-white px-3 py-2">
              <Logo priority alt="" />
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white/10"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close navigation menu</span>
              </button>
            </Dialog.Close>
          </div>

          <nav
            aria-label="Mobile primary"
            className="shell flex flex-1 flex-col justify-center overflow-y-auto py-8"
          >
            <ul className="w-full border-t border-white/10">
              {navigation.map((item, index) => (
                <li key={item.id} className="border-b border-white/10">
                  <a
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className="group flex items-center gap-4 py-4"
                  >
                      <span className="font-mono text-[10px] tracking-[0.18em] text-white/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[clamp(1.6rem,8vw,2.5rem)] font-medium tracking-[-0.03em] text-white">
                        {item.label}
                      </span>
                    <ArrowUpRight
                      className="ml-auto size-5 -translate-x-1 text-white/40 transition-all duration-200 group-hover:translate-x-0 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shell shrink-0 border-t border-white/10 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {siteConfig.phones.map((phone) => (
                  <a
                    key={phone.region}
                    href={`tel:${phone.href}`}
                    className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <Phone className="size-3.5 text-accent" aria-hidden="true" />
                    <span>
                      {phone.region}: {phone.display}
                    </span>
                  </a>
                ))}
              </div>
              <Button
                asChild
                variant="light"
                size="md"
                className="w-full sm:w-auto"
              >
                <a href="#contact" onClick={() => onOpenChange(false)}>
                  Let’s talk
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
