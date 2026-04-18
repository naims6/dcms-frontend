"use client";

import { useTranslations } from "next-intl";
import { HERO_STATS } from "@/constants/heroStats";

export function HeroStats() {
  const t = useTranslations("Hero");

  return (
    <div className="w-full">
      {/* Mobile View - Single Column Stack */}
      <div className="flex flex-col gap-3 sm:hidden">
        {HERO_STATS.map(({ icon: Icon, value, labelKey }, index) => (
          <div
            key={labelKey}
            className="group relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-primary/8 via-primary/4 to-transparent dark:from-primary/12 dark:via-primary/6 dark:to-transparent backdrop-blur-md p-4 transition-all duration-500 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
            style={{
              animation: `slideInUp 0.6s ease-out ${0.1 * index}s both`,
            }}
          >
            <div className="relative z-10 flex items-center gap-3">
              {/* Icon */}
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-linear-to-br from-primary/30 to-primary/20 group-hover:from-primary/40 group-hover:to-primary/30 shadow-md shadow-primary/10 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-500">
                <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-extrabold text-primary leading-none">
                  {value}
                </span>
                <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {t(labelKey)}
                </span>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-transparent group-hover:to-primary/5 transition-all duration-500" />
            <div className="absolute -top-1 -right-1 h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* Tablet & Desktop View - Horizontal Layout */}
      <div className="hidden sm:flex gap-4 md:gap-8 pt-2 justify-between">
        {HERO_STATS.map(({ icon: Icon, value, labelKey }, index) => (
          <div
            key={labelKey}
            className="group flex-1 flex items-center gap-4 md:gap-5 px-5 md:px-6 py-5 md:py-6 rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 to-primary/3 dark:from-primary/8 dark:to-primary/4 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-linear-to-r hover:from-primary/8 hover:to-primary/5 dark:hover:from-primary/12 dark:hover:to-primary/6 hover:shadow-lg hover:shadow-primary/15"
            style={{
              animation: `slideInUp 0.6s ease-out ${0.1 * index}s both`,
            }}
          >
            {/* Icon Container */}
            <div className="shrink-0 flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-lg bg-primary/20 dark:bg-primary/25 group-hover:bg-primary/30 dark:group-hover:bg-primary/40 transition-colors duration-300">
              <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <span className="text-xl md:text-2xl font-extrabold text-primary leading-none">
                {value}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground font-semibold tracking-wide uppercase">
                {t(labelKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
