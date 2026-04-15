import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

const ContactIntro = () => {
  const t = useTranslations("ContactPage");

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

      <div className="container mx-auto px-4 md:px-6 py-18 md:py-24 xl:py-28 relative z-10 flex flex-col items-center justify-center text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Mail className="h-4 w-4" />
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
    </section>
  );
};

export default ContactIntro;
