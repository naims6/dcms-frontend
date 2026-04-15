import { SectionHeader } from "@/components/shared/SectionHeader";
import { Eye, Target } from "lucide-react";
import { useTranslations } from "next-intl";


const AboutMission = () => {
  const t = useTranslations("AboutPage");
  return (
    <section className="w-full py-20 md:py-32 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title={t("missionTitle")}
          subtitle={t("missionSubtitle")}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            {/* Accent corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px]" />
            <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-[60px]" />

            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("missionHeading")}
                </h3>
              </div>
            </div>
            <div className="w-12 h-1 bg-primary rounded-full mb-5 group-hover:w-20 transition-all duration-500" />
            <p className="text-muted-foreground leading-relaxed">
              {t("missionText")}
            </p>
          </div>

          {/* Vision */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px]" />
            <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-[60px]" />

            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Eye className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("visionHeading")}
                </h3>
              </div>
            </div>
            <div className="w-12 h-1 bg-primary rounded-full mb-5 group-hover:w-20 transition-all duration-500" />
            <p className="text-muted-foreground leading-relaxed">
              {t("visionText")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
