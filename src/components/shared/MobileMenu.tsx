"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Squash as Hamburger } from "hamburger-react";
import { GraduationCap, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ThemeToggle } from "./ThemeToggle";
import { navMenuItems } from "@/constants/navMenuItems";
import { useAuth } from "@/hooks/use-auth";

export function MobileMenu() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
          className="w-[85vw] sm:w-100 p-0 flex flex-col border-l-0 shadow-2xl [&>button]:hidden bg-background text-foreground"
        >
          {/* Header */}
          <DialogTitle className="sr-only">Mobile Menu</DialogTitle>
          <div className="p-6 pb-4 text-left border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
                <GraduationCap className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                DCMS
              </span>
            </div>
            <div className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              <Hamburger
                toggled={open}
                toggle={setOpen}
                size={20}
                color="currentColor"
                rounded
                label="Close menu"
                distance="sm"
              />
            </div>
          </div>

          {/* User profile banner if logged in */}
          {isAuthenticated && user && (
            <div className="mx-6 mt-4 p-4 rounded-xl bg-muted/50 border border-border/80 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {(user.firstName[0] + (user.lastName?.[0] || "")).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.firstName} {user.lastName || ""}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                {user.roles && user.roles.length > 0 && (
                  <Badge variant="secondary" className="mt-1 text-[10px] py-0 px-1.5 font-semibold">
                    {user.roles[0]}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Middle Navigation */}
          <div className="flex flex-col flex-1 overflow-y-auto p-6">
            <nav className="flex flex-col gap-2">
              {navMenuItems.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                      isActive
                        ? "text-primary bg-primary/10 dark:bg-primary/20 translate-x-2"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span
                      className={cn(
                        "transition-transform duration-300",
                        isActive ? "scale-105 font-semibold" : ""
                      )}
                    >
                      {t(link.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    className="w-full justify-center h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 gap-2"
                    asChild
                  >
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center h-12 rounded-xl text-base font-medium border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
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
                    <Link href="/admissions" onClick={() => setOpen(false)}>
                      {t("admissionPortal")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="p-6 bg-muted/40 border-t border-border flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
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
