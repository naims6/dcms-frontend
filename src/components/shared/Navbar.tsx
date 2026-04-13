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
    <header className="w-full sticky top-0 z-50 border-b border-primary/10 dark:border-primary/20 bg-white/80 dark:bg-[oklch(0.13_0.04_260)]/90 backdrop-blur-2xl shadow-[0_1px_40px_0_rgba(99,102,241,0.08)] dark:shadow-[0_1px_40px_0_rgba(99,102,241,0.15)] transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-6 h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
            <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 dark:from-primary dark:to-primary/70 transition-colors">
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
                    ? "text-primary bg-primary/10 dark:bg-primary/20 dark:text-primary"
                    : "text-neutral-600 dark:text-primary/70 hover:text-primary dark:hover:text-primary hover:bg-primary/8 dark:hover:bg-primary/15",
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

            <div className="h-6 w-px bg-primary/15 dark:bg-primary/25 mx-1 hidden lg:block" />

            <div className="hidden lg:flex items-center gap-2 ml-1">
              <Button
                variant="ghost"
                className="font-medium text-neutral-600 dark:text-primary/70 hover:text-primary dark:hover:text-primary hover:bg-primary/8 dark:hover:bg-primary/15 rounded-full"
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
