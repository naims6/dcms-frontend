import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/shared/PageIntro";

const AboutIntro = () => {
  const t = useTranslations("AboutPage");

  return (
    <PageIntro
      badgeIcon={<GraduationCap className="h-4 w-4" />}
      badgeText={t("heroBadge")}
      title={t("heroTitle")}
      titleHighlight={t("heroTitleHighlight")}
      description={t("heroSubtitle")}
    >
      {/* ─── Bottom Grid Content ─────────────────────────────────────────────────── */}
      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] items-stretch xl:gap-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card max-h-[400px]">
          <Image
            src="/images/hero-school2.png"
            alt="Dhanbari Collegiate Model School"
            width={1200}
            height={800}
            sizes="400px"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/85 font-semibold text-left">
              Legacy of excellence
            </p>
            <p className="mt-2 text-sm md:text-base font-semibold text-left">
              Building confident learners and responsible leaders since 1972.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-border/60 bg-muted/40 p-6 text-left">
            <p className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-2">
              Mission Snapshot
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("missionText")}
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6 text-left">
            <p className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-2">
              Vision Snapshot
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("visionText")}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Action Buttons ──────────────────────────────────────────────────────── */}
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
    </PageIntro>
  );
};

export default AboutIntro;
