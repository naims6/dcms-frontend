"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const t = useTranslations("About");

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
      {/* Premium background gradient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image (on large devices) */}
          <div
            className="relative h-80 md:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-primary/15 order-2 lg:order-1"
            style={{
              animation: "fadeInLeft 0.8s ease both",
            }}
          >
            {/* Image Placeholder with premium styling */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-accent/10 to-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/hero-school2.png"
                  alt={t("imageAlt")}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

            {/* Premium border effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/20" />
          </div>

          {/* Right: Content */}
          <div
            className="space-y-6 md:space-y-8 order-1 lg:order-2"
            style={{
              animation: "fadeInRight 0.8s ease both",
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 w-fit backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                {t("badge")}
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
                {t("title")}
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary via-primary/70 to-accent rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
                {t("description1")}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
                {t("description2")}
              </p>
            </div>

            {/* Highlights List */}
            <div className="space-y-3.5 pt-6 border-t border-border/40">
              {(["highlight1", "highlight2", "highlight3"] as const).map(
                (key, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                        <svg
                          className="w-3.5 h-3.5 font-bold"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-foreground leading-snug pt-0.5">
                      {t(key)}
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                size="lg"
                className="gap-2 font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {t("ctaButton")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
