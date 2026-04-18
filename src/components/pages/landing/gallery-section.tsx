"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingGalleryItems } from "@/constants/galleryData";
import Link from "next/link";

export function GallerySection() {
  const t = useTranslations("Gallery");
  const [selectedImg, setSelectedImg] = useState<
    (typeof landingGalleryItems)[0] | null
  >(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImg(null);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <section className="w-full py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {t("sectionSubtitle")}
          </p>
          <div className="w-16 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] sm:auto-rows-[220px] md:auto-rows-[250px]">
          {landingGalleryItems.map((item) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-xl md:rounded-2xl bg-muted cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${item.className}`}
              onClick={() => setSelectedImg(item)}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                placeholder="blur"
                blurDataURL={`${item.src}&blur=20`} // Basic blur fallback
              />

              {/* Overlay Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 sm:px-3 py-1 mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary-foreground bg-primary/90 backdrop-blur-sm rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-white text-sm sm:text-lg md:text-xl font-bold flex items-center gap-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/gallery">
            <Button
              variant="default"
              className="px-8 py-6 rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {t("viewAll")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImg(null);
            }}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-video sm:aspect-auto sm:h-[80vh] rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImg.src}
              alt={selectedImg.title}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 sm:p-8">
              <span className="text-primary font-medium tracking-wide uppercase text-sm sm:text-base">
                {selectedImg.category}
              </span>
              <h3 className="text-white text-xl sm:text-3xl font-bold mt-2">
                {selectedImg.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
