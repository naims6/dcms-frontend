"use client";

import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export function ContactInfoCards() {
  const t = useTranslations("ContactInfoCards");

  const cards = [
    {
      icon: Phone,
      title: t("phoneTitle"),
      description: t("phoneDesc"),
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Mail,
      title: t("emailTitle"),
      description: t("emailDesc"),
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: MapPin,
      title: t("locationTitle"),
      description: t("locationDesc"),
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      icon: Clock,
      title: t("hoursTitle"),
      description: t("hoursDesc"),
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-muted/40 border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border/60 hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                <div
                  className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
