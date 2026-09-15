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

import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  if (pathname?.includes("/dashboard")) {
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string | null) => {
    const f = firstName?.[0] || "U";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase();
  };

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
                    : "text-neutral-600 dark:text-primary/70 hover:text-primary dark:hover:text-primary hover:bg-primary/8 dark:hover:bg-primary/15"
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
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2.5 px-3 py-1.5 h-10 rounded-full border-primary/20 hover:border-primary/40 bg-card shadow-xs transition-all hover:scale-102"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                        {getInitials(user?.firstName, user?.lastName)}
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {user?.firstName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border bg-card">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground">
                          {user?.firstName} {user?.lastName || ""}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user?.email}
                        </p>
                        {user?.roles && user.roles.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {user.roles.map((role) => (
                              <Badge key={role} variant="secondary" className="text-[10px] py-0 px-1.5 font-semibold">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer flex items-center gap-2.5 text-xs font-medium py-2">
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer flex items-center gap-2.5 text-xs font-medium py-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer flex items-center gap-2.5 text-xs font-medium py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
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
                </>
              )}
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
