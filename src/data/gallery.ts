/**
 * Placeholder gallery assets for the "Technology in motion" section.
 *
 * Client-supplied images were copied from public/branding into descriptive
 * filenames. The remaining photographs are from Unsplash and used under the
 * Unsplash License (https://unsplash.com/license). Replace these placeholders
 * with owned or commissioned photography before launch.
 *
 * Unsplash source photo IDs:
 * - enterprise-architecture: photo-1486406146926-c627a92ad1ab
 * - modern-workplace: photo-1497366754035-f200968a6e72
 * - digital-foundations: photo-1518770660439-4636190af475
 * - consulting-team: photo-1522071820081-009f0129c71c
 * - connected-systems: photo-1451187580459-43490279c0fa
 */

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: "Client-supplied" | "Unsplash";
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
    id: "enterprise-architecture",
    src: "/images/gallery/enterprise-architecture.jpg",
    alt: "Glass facades of modern enterprise office towers against a clear sky.",
    caption: "Enterprise architecture",
    credit: "Unsplash",
  },
  {
    id: "developer-workspace",
    src: "/images/gallery/developer-workspace.jpg",
    alt: "A developer working at a desk with three monitors showing code editors.",
    caption: "Engineering in practice",
    credit: "Client-supplied",
  },
  {
    id: "modern-workplace",
    src: "/images/gallery/modern-workplace.jpg",
    alt: "A minimal office corridor lined with glass-walled meeting rooms and warm lighting.",
    caption: "Spaces for focus",
    credit: "Unsplash",
  },
  {
    id: "digital-foundations",
    src: "/images/gallery/digital-foundations.jpg",
    alt: "A close-up of a circuit board with illuminated traces and electronic components.",
    caption: "Digital foundations",
    credit: "Unsplash",
  },
  {
    id: "consulting-team",
    src: "/images/gallery/consulting-team.jpg",
    alt: "A team collaborating around a table with laptops in a workshop setting.",
    caption: "Collaborative delivery",
    credit: "Unsplash",
  },
  {
    id: "connected-systems",
    src: "/images/gallery/connected-systems.jpg",
    alt: "Satellite view of Earth at night with a network of illuminated connections.",
    caption: "Connected systems",
    credit: "Unsplash",
  },
] as const;

export const galleryConfig = {
  /** Seconds for one full pass of the image sequence. */
  durationSeconds: 44,
} as const;
