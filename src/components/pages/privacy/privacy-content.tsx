import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default async function PrivacyContent({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("header.title")}
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {t("header.intro")}
          </p>
          <p className="mt-7 text-sm text-muted-foreground">
            {t("header.updatedLabel")}: {t("header.updatedAt")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <nav className="mb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("contents.title")}
          </p>
          <ol className="grid gap-2 text-sm sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-t border-border/60 py-8"
          >
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              {index + 1}. {section.title}
            </h2>

            {section.paragraphs?.map((paragraph, i) => (
              <p
                key={i}
                className="mt-4 text-[0.9375rem] leading-7 text-foreground/80"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.9375rem] leading-7 text-foreground/80 marker:text-muted-foreground/50">
                {section.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <Link
          href="/contact"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          {t("cta.label")}
        </Link>
      </div>
    </>
  );
}