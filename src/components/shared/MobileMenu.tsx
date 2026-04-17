"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Squash as Hamburger } from "hamburger-react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "./ThemeToggle";
import { navMenuItems } from "@/constants/navMenuItems";

export function MobileMenu() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="xl:hidden z-50 cursor-pointer -mr-2 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors">
        <Hamburger
          toggled={open}
          toggle={setOpen}
          size={24}
          color="currentColor"
          rounded
          label="Show menu"
          distance="sm"
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[85vw] sm:w-[400px] p-0 flex flex-col border-l-0 shadow-2xl"
        >
          <SheetHeader className="p-6 pb-4 text-left border-b border-neutral-100 dark:border-neutral-800/50">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
                <GraduationCap className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
                DCMS
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col flex-1 overflow-y-auto p-6">
            <nav className="flex flex-col gap-2.5">
              {navMenuItems.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300",
                      isActive
                        ? "text-primary bg-primary/10 dark:bg-primary/20 translate-x-2"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
                    )}
                  >
                    <span
                      className={cn(
                        "transition-transform duration-300",
                        isActive ? "scale-105 font-semibold" : "",
                      )}
                    >
                      {t(link.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-center h-12 rounded-xl text-base font-medium"
                asChild
              >
                <Link href="/login" onClick={() => setOpen(false)}>
                  {t("login")}
                </Link>
              </Button>
              <Button
                className="w-full justify-center h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                asChild
              >
                <Link href="/register" onClick={() => setOpen(false)}>
                  {t("register")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu bottom toolbar */}
          <div className="p-6 bg-neutral-50/50 dark:bg-neutral-900/50 mt-auto border-t border-neutral-100 dark:border-neutral-800/50 flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {t("toggleTheme") || "Theme"}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
