"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Key,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const segments = pathname.split("/");
  const locale = segments[1] && (segments[1] === "en" || segments[1] === "bn") ? segments[1] : "en";

  const navItems: NavItem[] = [
    { title: "Overview", path: `/${locale}/dashboard`, icon: LayoutDashboard },
    { title: "Users", path: `/${locale}/dashboard/users`, icon: Users, permission: "users:read" },
    { title: "Roles & RBAC", path: `/${locale}/dashboard/rbac/roles`, icon: ShieldCheck, permission: "roles:read" },
    { title: "Permissions", path: `/${locale}/dashboard/rbac/permissions`, icon: Key, permission: "permissions:read" },
    { title: "Profile", path: `/${locale}/dashboard/profile`, icon: User },
  ];

  const visibleNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-sidebar-foreground whitespace-nowrap">
              DCMS Portal
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-20 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-accent text-foreground"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </Button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== `/${locale}/dashboard` && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs text-sidebar-accent-foreground">
            <p className="font-semibold">DCMS v1.0.0</p>
            <p className="text-muted-foreground mt-0.5">Role Based Access Control</p>
          </div>
        </div>
      )}
    </aside>
  );
}
