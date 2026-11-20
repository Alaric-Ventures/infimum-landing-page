import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function Logo({
  className,
  priority = false,
  alt = "Infimum Consulting",
}: LogoProps) {
  return (
    <Image
      src="/branding/infimum-logo.png"
      alt={alt}
      width={326}
      height={56}
      priority={priority}
      className={cn("h-6 w-auto sm:h-7", className)}
    />
  );
}
