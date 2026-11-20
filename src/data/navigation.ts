export type NavigationItem = {
  label: string;
  href: string;
  id: string;
};

export const navigation: NavigationItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Services", href: "#services", id: "services" },
  { label: "Why Us", href: "#why-us", id: "why-us" },
  { label: "Our Approach", href: "#approach", id: "approach" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const sectionIds = navigation.map((item) => item.id);
