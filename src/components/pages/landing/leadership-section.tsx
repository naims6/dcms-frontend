"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export function LeadershipSection() {
  const t = useTranslations("Leadership");

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background/50 relative overflow-hidden">
      {/* Background visual flair */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
              {t("sectionTitle")}
            </h2>
            <div className="w-16 h-1.5 bg-primary rounded-full mx-auto sm:mx-0" />
          </div>
          <Button variant="outline" className="gap-2 group">
            {t("viewAllBtn")}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="flex flex-col space-y-4 group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/20">
                <div className="absolute inset-0 bg-[#0d505a] translate-x-3 translate-y-3 rounded-2xl transition-transform group-hover:translate-x-4 group-hover:translate-y-4" />
                <div className="absolute inset-0 bg-muted border border-border z-10 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                    alt="President"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-xl text-foreground mb-1">
                  {t("card1Name")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  {t("card1Role")}
                </p>
                <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 group/btn">
                  {t("card1Btn")}{" "}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col space-y-4 group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/20">
                <div className="absolute inset-0 bg-[#0d505a] -translate-x-3 translate-y-3 rounded-2xl transition-transform group-hover:-translate-x-4 group-hover:translate-y-4" />
                <div className="absolute inset-0 bg-[#e6f4ea] border border-border z-10 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                    alt="Head Teacher"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-xl text-foreground mb-1">
                  {t("card2Name")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  {t("card2Role")}
                </p>
                <button className="text-destructive text-sm font-semibold hover:underline flex items-center gap-1 group/btn">
                  {t("card2Btn")}{" "}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col space-y-4 group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/20">
                <div className="absolute inset-0 bg-[#0d505a] -translate-x-3 -translate-y-3 rounded-2xl transition-transform group-hover:-translate-x-4 group-hover:-translate-y-4" />
                <div className="absolute inset-0 bg-muted border border-border z-10 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                    alt="Assistant Head"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-xl text-foreground mb-1">
                  {t("card3Name")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  {t("card3Role")}
                </p>
                <button className="text-destructive text-sm font-semibold hover:underline flex items-center gap-1 group/btn">
                  {t("card3Btn")}{" "}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Welcome Message */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
              {t("welcomeTitle")}
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:h-full before:max-h-20 before:w-1 before:bg-primary before:rounded-full">
                {t("welcomeText1")}
              </p>
              <p>{t("welcomeText2")}</p>
            </div>

            {/* Optional extra elements for premium feel */}
            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
                      alt="President"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
                      alt="Head"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Dedicated Leadership
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Guiding since 2005
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
