"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { navMenuItems } from "@/constants/navMenuItems";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  return (
    <header className="w-full sticky top-0 z-50 border-b border-neutral-200/50 dark:border-white/10 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-6 h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
            <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 transition-colors">
            DCMS
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navMenuItems.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10 dark:bg-primary/20"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                )}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Mobile Menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden sm:flex items-center gap-1 lg:gap-2">
            <ThemeToggle />
            <LanguageToggle />

            <div className="h-6 w-px bg-neutral-200 dark:bg-white/10 mx-1 hidden lg:block" />

            <div className="hidden lg:flex items-center gap-2 ml-1">
              <Button
                variant="ghost"
                className="font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded-full"
                asChild
              >
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button
                className="font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 rounded-full"
                asChild
              >
                <Link href="/register">{t("register")}</Link>
              </Button>
            </div>
          </div>
          {/* Extremely compact view language toggle on tiny screens */}
          <div className="flex sm:hidden items-center gap-1 mr-1">
            <LanguageToggle />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
