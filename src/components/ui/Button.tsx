import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-[0_1px_0_0_rgba(255,255,255,0.14)_inset,0_10px_30px_-16px_rgba(37,99,235,0.85)] hover:bg-brand-dark",
        dark: "bg-midnight text-white hover:bg-deep",
        light: "bg-white text-midnight hover:bg-cloud",
        outline:
          "border border-line bg-white text-ink hover:border-slate-300 hover:bg-canvas",
        "outline-light":
          "border border-white/20 bg-white/[0.02] text-white hover:border-white/35 hover:bg-white/[0.06]",
        ghost: "text-ink hover:bg-canvas",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.9375rem]",
        lg: "h-[3.25rem] px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component: ElementType = asChild ? Slot : "button";

  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
