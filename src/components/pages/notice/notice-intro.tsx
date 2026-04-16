import { useTranslations } from "next-intl";
import { Megaphone } from "lucide-react";

/**
 * NoticeIntro
 * A hero section for the Notice Board page, utilizing the global CSS colors to match the app's aesthetic.
 */
const NoticeIntro = () => {
  const t = useTranslations("NoticeIntro");

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-background border-b border-border/40">
      {/* Decorative background elements */}
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-6 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary/20 transition-colors">
              <Megaphone className="h-4 w-4" />
              {t("badge")}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              {t("title")}
              <span className="text-primary">{t("titleHighlight")}</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeIntro;
