"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useMemo } from "react";
import { X, ZoomIn, Search, Filter, Calendar, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { galleryData, type GalleryItem } from "@/constants/galleryData";

const GalleryGridMain = () => {
  const t = useTranslations("GalleryPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBatch, setActiveBatch] = useState("all");
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);

  // Derive unique categories and batches
  const categories = useMemo(
    () => [
      "all",
      ...Array.from(new Set(galleryData.map((item) => item.category))),
    ],
    [],
  );
  const batches = useMemo(
    () => [
      "all",
      ...Array.from(new Set(galleryData.map((item) => item.batch))),
    ],
    [],
  );

  // Filter Logic
  const filteredImages = useMemo(() => {
    return galleryData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesBatch = activeBatch === "all" || item.batch === activeBatch;
      return matchesSearch && matchesCategory && matchesBatch;
    });
  }, [searchQuery, activeCategory, activeBatch]);

  return (
    <div className="w-full bg-background py-12">
      <div className="container mx-auto px-4">
        {/* --- Filters & Search Controls --- */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-10 h-12 rounded-xl border-border/60 bg-card/50 focus:bg-card transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Toggle */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat === "all"
                    ? t("categories.all")
                    : t.has(`categories.${cat.toLowerCase()}`)
                      ? t(`categories.${cat.toLowerCase()}`)
                      : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter: Batch */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2 mr-2 text-muted-foreground shrink-0">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">{t("filters.batch")}:</span>
            </div>
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setActiveBatch(batch)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeBatch === batch
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {batch === "all" ? t("allBatches") : batch}
              </button>
            ))}
          </div>
        </div>

        {/* --- Gallery Grid --- */}
        {filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((item) => (
              <div
                key={item.id}
                className="group relative break-inside-avoid overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-xl transition-all duration-500 cursor-zoom-in"
                onClick={() => setSelectedImg(item)}
              >
                <div className="relative aspect-auto">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={800}
                    height={
                      item.width === "tall"
                        ? 1200
                        : item.width === "wide"
                          ? 600
                          : 800
                    }
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                          {item.category}
                        </span>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border border-white/20">
                          {item.batch}
                        </span>
                      </div>
                      <h3 className="text-white text-lg font-bold leading-tight flex items-center gap-2">
                        {item.title}
                        <ZoomIn className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <LayoutGrid className="h-12 w-12 text-muted/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("noResults")}</p>
            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveBatch("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* --- Lightbox --- */}
        {selectedImg && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="h-8 w-8" />
            </button>
            <div
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={selectedImg.src}
                  alt={selectedImg.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="mt-6 text-center text-white space-y-2 max-w-2xl px-4">
                <div className="flex items-center justify-center gap-4 text-primary text-sm font-bold uppercase tracking-widest">
                  <span>{selectedImg.category}</span>
                  <span className="h-1 w-1 bg-white/30 rounded-full" />
                  <span>{selectedImg.batch}</span>
                  <span className="h-1 w-1 bg-white/30 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {selectedImg.year}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold">
                  {selectedImg.title}
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryGridMain;
