import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import PageIntro from "@/components/shared/PageIntro";

const ContactIntro = () => {
  const t = useTranslations("ContactPage");

  return (
    <PageIntro
      badgeIcon={<Mail className="h-4 w-4" />}
      badgeText={t("heroBadge")}
      title={t("heroTitle")}
      titleHighlight={t("heroTitleHighlight")}
      description={t("heroSubtitle")}
    />
  );
};

export default ContactIntro;
