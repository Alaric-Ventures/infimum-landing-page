/**
 * Gallery assets for the infinite carousel in the hero.
 *
 * These are the client-supplied images copied from `public/branding` into
 * descriptive filenames. No third-party placeholder photography is used.
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
    id: "cloud-architecture",
    src: "/images/gallery/cloud-architecture.jpg",
    alt: "A glowing cloud network rising above illuminated data centre infrastructure.",
    caption: "Cloud architecture",
    credit: "Client-supplied",
  },
  {
    id: "modern-workspace",
    src: "/images/gallery/workspace-studio.jpg",
    alt: "A designer reviewing a three-dimensional building model on a large monitor in a bright studio.",
    caption: "Modern workspace",
    credit: "Client-supplied",
  },
  {
    id: "server-infrastructure",
    src: "/images/gallery/server-infrastructure.jpg",
    alt: "A blue-lit aisle between rows of server racks inside a data centre.",
    caption: "Infrastructure at scale",
    credit: "Client-supplied",
  },
  {
    id: "developer-workspace",
    src: "/images/gallery/developer-workspace.jpg",
    alt: "A developer working at a desk with three monitors showing code editors.",
    caption: "Engineering in practice",
    credit: "Client-supplied",
  },
] as const;

export const galleryConfig = {
  /** Seconds for one full pass of the image sequence. */
  durationSeconds: 24,
} as const;
