"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { navMenuItems } from "@/constants/navMenuItems";
import Logo from "./Logo";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  return (
    <header className="w-full sticky top-0 z-50 border-b border-primary/10 dark:border-primary/20 bg-background/80 backdrop-blur-2xl shadow-[0_1px_40px_0_rgba(99,102,241,0.08)] dark:shadow-[0_1px_40px_0_rgba(99,102,241,0.15)] transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-6 h-16 sm:h-20">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
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

            <div className="h-6 w-px bg-primary/15 dark:bg-primary/25 mx-1 hidden xl:block" />

            <div className="hidden xl:flex items-center gap-2 ml-1">
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
                <Link href="/admissions">{t("admissionPortal")}</Link>
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
