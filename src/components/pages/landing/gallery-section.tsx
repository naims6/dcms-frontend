"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const galleryItems = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
    title: "Science Fair 2025",
    category: "Events",
    className: "col-span-2 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop",
    title: "Classroom Activities",
    category: "Academic",
    className: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    title: "Library Study",
    category: "Campus",
    className: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    title: "Tech Workshop",
    category: "Workshop",
    className: "col-span-2 md:col-span-2 row-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    title: "Annual Sports Day",
    category: "Sports",
    className: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop",
    title: "Campus View",
    category: "Campus",
    className: "col-span-1 row-span-1",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    title: "Graduation Ceremony",
    category: "Events",
    className: "col-span-2 md:col-span-2 lg:col-span-2 row-span-1",
  },
];

export function GallerySection() {
  const t = useTranslations("Gallery");
  const [selectedImg, setSelectedImg] = useState<typeof galleryItems[0] | null>(null);

  // Close lightbox on Escape key
  if (typeof window !== "undefined") {
    window.onkeydown = (e) => {
      if (e.key === "Escape") setSelectedImg(null);
    };
  }

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[250px]">
          {galleryItems.map((item) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
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
          <Button variant="default" className="px-8 py-6 rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
            {t("viewAll")}
          </Button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8" onClick={() => setSelectedImg(null)}>
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
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 sm:p-8">
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
