import { useTranslations } from "next-intl";
import { Megaphone } from "lucide-react";
import PageIntro from "@/components/shared/PageIntro";

/**
 * NoticeIntro
 * A hero section for the Notice Board page, utilizing the reusable PageIntro component.
 */
const NoticeIntro = () => {
  const t = useTranslations("NoticeIntro");

  return (
    <PageIntro
      badgeIcon={<Megaphone className="h-4 w-4" />}
      badgeText={t("badge")}
      title={t("title")}
      titleHighlight={t("titleHighlight")}
      description={t("subtitle")}
    />
  );
};

export default NoticeIntro;
