import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const AboutIntro = () => {
  const t = useTranslations("AboutPage");

  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border/40">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 -top-32 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-55 dark:opacity-10"
          style={{
            backgroundImage: `
                linear-gradient(to right, oklch(from var(--border) l c h / 0.7) 1px, transparent 1px),
                linear-gradient(to bottom, oklch(from var(--border) l c h / 0.7) 1px, transparent 1px)
              `,
            backgroundSize: "26px 26px",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 20%, #000 35%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at 50% 20%, #000 35%, transparent 100%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-18 md:py-24 xl:py-28 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <GraduationCap className="h-4 w-4" />
              {t("heroBadge")}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl xl:text-[3.45rem]">
              <span className="text-foreground">{t("heroTitle")}</span>{" "}
              <span className="text-primary">{t("heroTitleHighlight")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] items-stretch xl:gap-8">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card max-h-[400px]">
            <Image
              src="/images/hero-school2.png"
              alt="Dhanbari Collegiate Model School"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-white/85 font-semibold">
                Legacy of excellence
              </p>
              <p className="mt-2 text-sm md:text-base font-semibold">
                Building confident learners and responsible leaders since 1972.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-2">
                Mission Snapshot
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("missionText")}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-2">
                Vision Snapshot
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("visionText")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
          <Link href="/admissions">
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-xl font-semibold border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
