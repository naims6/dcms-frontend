import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { LeadershipCards } from "./leadership-cards";

export function LeadershipSection() {
  const t = useTranslations("Leadership");

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background/50 relative overflow-hidden">
      {/* Background visual flair */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
              {t("sectionTitle")}
            </h2>
            <div className="w-16 h-1.5 bg-primary rounded-full mx-auto sm:mx-0" />
          </div>
          <Link href="/teacher" className="inline-flex">
            <Button variant="outline" className="gap-2 group">
              {t("viewAllBtn")}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <LeadershipCards />

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
                      src="https://res.cloudinary.com/dynxnpj21/image/upload/v1776512089/5_balnma.webp"
                      alt="President"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative">
                    <Image
                      src="https://res.cloudinary.com/dynxnpj21/image/upload/v1776512089/278056786_930805360926876_7862545157050764468_n_syisvc.jpg"
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
