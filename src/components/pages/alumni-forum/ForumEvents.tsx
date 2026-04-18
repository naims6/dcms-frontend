import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface EventItem {
  date: string;
  title: string;
  description: string;
}

function EventCard({ date, title, description }: EventItem) {
  return (
    <article className="group flex gap-5 rounded-2xl border border-border bg-card/95 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <CalendarDays className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {date}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function ForumEvents() {
  const t = useTranslations("AlumniForumPage");

  const events: EventItem[] = [
    {
      date: t("events.items.0.date"),
      title: t("events.items.0.title"),
      description: t("events.items.0.description"),
    },
    {
      date: t("events.items.1.date"),
      title: t("events.items.1.title"),
      description: t("events.items.1.description"),
    },
  ];

  return (
    <section
      id="events"
      className="border-t border-border bg-muted/30 py-16 md:py-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          badge={t("events.badge")}
          title={t("events.title")}
          subtitle={t("events.subtitle")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
}
