"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className={cn(
        "relative flex items-center h-8 w-16 p-1 rounded-full bg-neutral-200/50 dark:bg-neutral-800 transition-colors duration-300 ring-1 ring-neutral-200 dark:ring-neutral-700 outline-none focus-visible:ring-primary",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      aria-label="Toggle language"
    >
      <div 
        className={cn(
          "absolute inset-y-1 w-6.5 bg-white dark:bg-neutral-600 rounded-full shadow-sm transition-all duration-300 ease-spring",
          locale === "bn" ? "left-8.5" : "left-1"
        )} 
      />
      <div className="relative z-10 flex w-full justify-between px-1.5 text-[0.65rem] font-bold text-neutral-500 dark:text-neutral-400">
        <span className={cn("transition-colors duration-300", locale === "en" ? "text-neutral-900 dark:text-white" : "")}>EN</span>
        <span className={cn("transition-colors duration-300", locale === "bn" ? "text-neutral-900 dark:text-white" : "")}>BN</span>
      </div>
    </button>
  );
}
