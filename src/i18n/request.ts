import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Import split message files and merge them
  const common = (await import(`../../messages/${locale}/common.json`)).default;
  const landing = (await import(`../../messages/${locale}/landing.json`))
    .default;
  const about = (await import(`../../messages/${locale}/about.json`)).default;
  const contact = (await import(`../../messages/${locale}/contact.json`))
    .default;
  const notice = (await import(`../../messages/${locale}/notice.json`)).default;
  const gallery = (await import(`../../messages/${locale}/gallery.json`))
    .default;
  const admissions = (await import(`../../messages/${locale}/admissions.json`))
    .default;

  // When you add a new page, just add another import above and spread it below
  return {
    locale,
    messages: {
      ...common,
      ...landing,
      ...about,
      ...contact,
      ...notice,
      ...gallery,
      ...admissions,
    },
  };
});
