import { useTranslations } from "next-intl";
import { parseErrorMessage } from "@/lib/error-utils";

export function useFormError() {
  const t = useTranslations("admissions");

  return (error?: string) => {
    const parsed = parseErrorMessage(error);
    if (!parsed) return null;
    return t(parsed.key as any, parsed.values);
  };
}
