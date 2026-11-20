import {
  Cloud,
  Code,
  Globe,
  LayoutGrid,
  LayoutTemplate,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import type { ServiceIconName } from "@/data/services";

const icons: Record<ServiceIconName, LucideIcon> = {
  "layout-template": LayoutTemplate,
  smartphone: Smartphone,
  code: Code,
  globe: Globe,
  cloud: Cloud,
  "layout-grid": LayoutGrid,
};

type ServiceIconProps = {
  name: ServiceIconName;
  className?: string;
};

export function ServiceIcon({ name, className }: ServiceIconProps) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
