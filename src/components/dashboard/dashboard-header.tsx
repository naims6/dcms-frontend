"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, Moon, Sun, User as UserIcon, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const getInitials = (firstName?: string, lastName?: string | null) => {
    const f = firstName?.[0] || "U";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 md:px-6 backdrop-blur-md">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records, users, roles..."
            className="pl-9 h-9 text-sm bg-muted/40 border-border/80 focus-visible:bg-background"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="font-medium text-xs px-2.5 h-8 border border-border/50"
          title="Switch Language"
        >
          {locale === "en" ? "বাংলা" : "EN"}
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Toggle Theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2.5 px-2 py-1 h-auto rounded-full hover:bg-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs shadow-xs">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {user?.firstName} {user?.lastName || ""}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {user?.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-foreground">
                  {user?.firstName} {user?.lastName || ""}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
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
              <Link href="/dashboard/profile" className="cursor-pointer flex items-center gap-2 text-xs">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer flex items-center gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
