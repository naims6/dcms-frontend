import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import PageIntro from "@/components/shared/PageIntro";

/**
 * GalleryIntro
 * A hero section for the School Gallery page, utilizing the reusable PageIntro component.
 */
const GalleryIntro = () => {
  const t = useTranslations("GalleryPage");

  return (
    <PageIntro
      badgeIcon={<Camera className="h-4 w-4" />}
      badgeText={t("badge")}
      title={t("title")}
      titleHighlight={t("titleHighlight")}
      description={t("subtitle")}
    />
  );
};

export default GalleryIntro;
