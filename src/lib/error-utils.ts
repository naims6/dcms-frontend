import type { TranslationValues } from "next-intl";

interface ErrorMessage {
  key: string;
  values?: TranslationValues;
}

export function parseErrorMessage(error?: string): ErrorMessage | null {
  if (!error) return null;

  try {
    const parsed = JSON.parse(error);
    if (parsed.key) {
      return parsed;
    }
  } catch {
    // If not JSON, treat as simple key
    return { key: error };
  }

  return { key: error };
}
