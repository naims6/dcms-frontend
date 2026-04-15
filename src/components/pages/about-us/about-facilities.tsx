import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  BookOpen,
  Dumbbell,
  FlaskConical,
  Lock,
  Monitor,
  Music,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface FacilityItemProps {
  icon: React.ReactNode;
  label: string;
}

function FacilityItem({ icon, label }: FacilityItemProps) {
  return (
    <div className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 hover:-translate-y-0.5 transition-all duration-300">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

const AboutFacilities = () => {
  const t = useTranslations("AboutPage");

  const facilities: { icon: React.ReactNode; labelKey: string }[] = [
    { icon: <FlaskConical className="h-5 w-5" />, labelKey: "facility1" },
    { icon: <BookOpen className="h-5 w-5" />, labelKey: "facility2" },
    { icon: <Dumbbell className="h-5 w-5" />, labelKey: "facility3" },
    { icon: <Monitor className="h-5 w-5" />, labelKey: "facility4" },
    { icon: <Music className="h-5 w-5" />, labelKey: "facility5" },
    { icon: <Lock className="h-5 w-5" />, labelKey: "facility6" },
    { icon: <UtensilsCrossed className="h-5 w-5" />, labelKey: "facility7" },
    { icon: <Stethoscope className="h-5 w-5" />, labelKey: "facility8" },
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-muted/30 border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title={t("facilitiesTitle")}
          subtitle={t("facilitiesSubtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {facilities.map((f) => (
            <FacilityItem
              key={f.labelKey}
              icon={f.icon}
              label={t(f.labelKey as Parameters<typeof t>[0])}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFacilities;
