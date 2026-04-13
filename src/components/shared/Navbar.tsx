"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <nav className="w-full sticky top-0 z-50 border-b bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
          DCMS
        </span>

        {/* Language selector */}
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
          <Globe size={16} className="shrink-0" />
          <div className="relative">
            <select
              value={locale}
              onChange={handleLocaleChange}
              disabled={isPending}
              className="appearance-none bg-transparent text-sm font-medium cursor-pointer outline-none pr-5 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {LOCALES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            {/* Tiny chevron */}
            <svg
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
