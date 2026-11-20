import { InfiniteImageMarquee } from "@/components/gallery/InfiniteImageMarquee";
import { Reveal } from "@/components/ui/Reveal";
import { galleryConfig, galleryImages } from "@/data/gallery";

export function GallerySection() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow text-brand-dark">Inside the work</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="gallery-heading" className="text-h2 mt-5 text-ink">
                Technology in Motion.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-7 text-muted">
                A closer look at the systems, spaces and teams behind modern
                digital delivery — from cloud platforms and engineering desks to
                the workplaces they support.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="hidden lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {String(galleryImages.length).padStart(2, "0")} / selected frames
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 sm:mt-14">
        <InfiniteImageMarquee
          images={galleryImages}
          durationSeconds={galleryConfig.durationSeconds}
        />
      </div>

      <div className="shell mt-6 flex flex-col gap-2 text-[11px] leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p id="gallery-instructions">
          Drag or use the arrow keys to explore. Movement pauses on hover or
          focus.
        </p>
        <p>
          Placeholder imagery from{" "}
          <a
            href="https://unsplash.com/license"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-2 transition-colors hover:text-ink"
          >
            Unsplash
          </a>{" "}
          and client-supplied assets.
        </p>
      </div>
    </section>
  );
}
