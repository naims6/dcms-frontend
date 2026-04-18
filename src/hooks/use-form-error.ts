import { useTranslations } from "next-intl";
import { parseErrorMessage } from "@/lib/error-utils";

export function useFormError(namespace: string = "admissions") {
  const t = useTranslations(namespace);

  return (error?: string) => {
    const parsed = parseErrorMessage(error);
    if (!parsed) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return t(parsed.key as any, parsed.values);
  };
}
