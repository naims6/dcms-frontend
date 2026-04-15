import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const t = useTranslations("About");

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image (on large devices) */}
          <div
            className="relative h-[300px] sm:h-[400px] lg:h-[550px] rounded-3xl overflow-hidden shadow-lg border border-border/50 order-2 lg:order-1"
            style={{
              animation: "fadeInLeft 0.8s ease both",
            }}
          >
            <div className="absolute inset-0 bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/hero-school2.png"
                  alt={t("imageAlt")}
                  fill
                  className="object-cover object-center w-full h-full transition-transform duration-700 hover:scale-105"
                />
                
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            className="flex flex-col justify-center space-y-8 order-1 lg:order-2"
            style={{
              animation: "fadeInRight 0.8s ease both",
            }}
          >
            <div className="space-y-6">
              {/* Heading */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
                  {t("title")}
                </h2>
                <div className="w-16 h-1.5 bg-primary rounded-full mb-6 mx-auto lg:mx-0" />
              </div>

              {/* Description */}
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed lg:text-left">
                <p>{t("description1")}</p>
                <p>{t("description2")}</p>
              </div>
            </div>

            {/* Highlights List */}
            <ul className="space-y-4 pt-6 mt-6 border-t border-border">
              {(["highlight1", "highlight2", "highlight3"] as const).map(
                (key, idx) => (
                  <li key={idx} className="flex gap-3 items-start justify-center lg:justify-start">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-base font-medium text-foreground text-left">
                      {t(key)}
                    </span>
                  </li>
                ),
              )}
            </ul>

            {/* CTA Button */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <Button size="lg" className="h-12 px-8 gap-2 group text-base">
                {t("ctaButton")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
