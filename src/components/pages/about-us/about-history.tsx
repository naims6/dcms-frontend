import { SectionHeader } from "@/components/shared/SectionHeader";
import { useTranslations } from "next-intl";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft: boolean;
  delay?: number;
}

function TimelineItem({
  year,
  title,
  description,
  isLeft,
  delay = 0,
}: TimelineItemProps) {
  return (
    <div
      className={`relative flex items-start gap-6 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Content */}
      <div
        className={`flex-1 md:max-w-[calc(50%-2rem)] ${isLeft ? "md:pr-10 md:text-right" : "md:pl-10"}`}
      >
        <div
          className={`group p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 ${
            isLeft ? "md:ml-auto" : ""
          }`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {year}
          </span>
          <h3 className="text-base font-bold text-foreground mb-1.5">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex md:w-16 shrink-0 items-start justify-center pt-5">
        <div className="relative">
          <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/20 shadow-md shadow-primary/30" />
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        </div>
      </div>

      {/* Empty right */}
      <div className="hidden md:block flex-1" />

      {/* Mobile left dot */}
      <div className="md:hidden shrink-0 mt-5">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
        </div>
      </div>
    </div>
  );
}

const AboutHistory = () => {
  const t = useTranslations("AboutPage");

  const timeline = [
    {
      yearKey: "history1Year",
      titleKey: "history1Title",
      descKey: "history1Desc",
    },
    {
      yearKey: "history2Year",
      titleKey: "history2Title",
      descKey: "history2Desc",
    },
    {
      yearKey: "history3Year",
      titleKey: "history3Title",
      descKey: "history3Desc",
    },
    {
      yearKey: "history4Year",
      titleKey: "history4Title",
      descKey: "history4Desc",
    },
    {
      yearKey: "history5Year",
      titleKey: "history5Title",
      descKey: "history5Desc",
    },
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-background border-b border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title={t("historyTitle")}
          subtitle={t("historySubtitle")}
        />

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />

          <div className="flex flex-col gap-10 md:gap-12">
            {timeline.map((item, idx) => (
              <TimelineItem
                key={item.yearKey}
                year={t(item.yearKey as Parameters<typeof t>[0])}
                title={t(item.titleKey as Parameters<typeof t>[0])}
                description={t(item.descKey as Parameters<typeof t>[0])}
                isLeft={idx % 2 === 0}
                delay={idx * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistory;
