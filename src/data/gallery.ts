/**
 * Gallery assets for the full-width infinite hero background.
 *
 * These are client-supplied images stored locally. The selected set favours
 * landscape technology imagery suitable for full-width background panels.
 */

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: "Client-supplied";
};

export const galleryImages: readonly GalleryImage[] = [
  {
    id: "server-infrastructure",
    src: "/images/gallery/server-infrastructure.jpg",
    alt: "A long aisle between rows of server racks inside a data centre.",
    caption: "Data centre infrastructure",
    credit: "Client-supplied",
  },
  {
    id: "developer-workspace",
    src: "/images/gallery/developer-workspace.jpg",
    alt: "A developer working at a desk with three monitors showing code editors.",
    caption: "Software engineering",
    credit: "Client-supplied",
  },
  {
    id: "digital-foundations",
    src: "/images/gallery/digital-foundations.jpg",
    alt: "A close-up of an electronic circuit board.",
    caption: "Digital foundations",
    credit: "Client-supplied",
  },
  {
    id: "connected-systems",
    src: "/images/gallery/connected-systems.jpg",
    alt: "The Earth at night seen from space, with illuminated cities and networks.",
    caption: "Connected systems",
    credit: "Client-supplied",
  },
] as const;

export const galleryConfig = {
  /** Seconds for one full pass of the image sequence. */
  durationSeconds: 72,
} as const;
