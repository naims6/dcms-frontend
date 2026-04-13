"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Users, Trophy } from "lucide-react";
import {
  HERO_STATS,
  HERO_PASS_RATE_CARD,
  HERO_FOUNDED_YEAR,
} from "@/constants/heroStats";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative w-full overflow-hidden bg-background flex items-center">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />

        {/* Large ambient orb — top-left */}
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full bg-primary/10 blur-[120px]" />
        {/* Large ambient orb — bottom-right */}
        <div className="absolute -bottom-32 -right-32 w-[560px] h-[560px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 xl:gap-20 items-center">

          {/* ── Left: Text Content ── */}
          <div
            className="flex flex-col justify-center space-y-8"
            style={{ animation: "heroFadeUp 0.7s ease both" }}
          >
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
              <GraduationCap className="h-4 w-4" />
              {t("badge")}
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl xl:text-[4rem] 2xl:text-[4.5rem]">
                <span className="text-foreground">{t("headline")}</span>
              </h1>

              <p className="max-w-[540px] text-muted-foreground text-base md:text-lg leading-relaxed">
                {t("subheading")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-12 px-8 rounded-xl gap-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("applyNow")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-xl font-semibold border-border/60 bg-background/60 backdrop-blur-md hover:bg-accent/60 hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("learnMore")}
              </Button>
            </div>

            {/* Stats Row — values from constants, labels from i18n */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/40">
              {HERO_STATS.map(({ icon: Icon, value, labelKey }) => (
                <div key={labelKey} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary/70" />
                    <span className="text-2xl font-extrabold text-primary leading-none">
                      {value}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {t(labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Rectangular Image Block ── */}
          <div
            className="relative w-full"
            style={{ animation: "heroFadeUp 0.9s 0.15s ease both" }}
          >
            {/* Decorative glow behind image */}
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl z-0" />

            {/* Main rectangular image card */}
            <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-white/20 dark:border-white/8 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.22)] bg-card">
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent z-10 pointer-events-none" />

              <Image
                src="/images/hero-school2.png"
                alt={t("imageAlt")}
                width={900}
                height={600}
                className="w-full h-auto object-cover aspect-[3/2] transition-transform duration-700 hover:scale-[1.03]"
                priority
              />

              {/* Bottom gradient caption bar */}
              <div className="absolute bottom-0 inset-x-0 z-20 h-28 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-white text-sm font-semibold drop-shadow">
                  {t("captionText", { year: HERO_FOUNDED_YEAR })}
                </span>
              </div>
            </div>

            {/* Floating "Pass Rate" card — bottom-right */}
            <div
              className="absolute -bottom-5 -right-4 md:-right-8 z-20 px-5 py-4 rounded-2xl border border-white/30 dark:border-white/10 bg-white/80 dark:bg-card/90 backdrop-blur-xl shadow-2xl hidden sm:block"
              style={{ animation: "heroFloat 3s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <Trophy className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground leading-none">
                    {HERO_PASS_RATE_CARD.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">
                    {t(HERO_PASS_RATE_CARD.labelKey)}
                  </p>
                </div>
              </div>
            </div>

            {/* Dot accent */}
            <div
              className="absolute top-1/2 -right-10 z-0 h-28 w-28 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--primary) / 0.5) 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
