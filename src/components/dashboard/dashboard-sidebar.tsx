"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Megaphone,
  List,
  FilePlus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export interface NavSubItem {
  title: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  permission?: string;
}

export interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  children?: NavSubItem[];
}

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, onClose }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const navItems: NavItem[] = [
    { title: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { title: "Users", path: "/dashboard/users", icon: Users, permission: "users:read" },
    { title: "Roles & RBAC", path: "/dashboard/rbac/roles", icon: ShieldCheck, permission: "roles:read" },
    {
      title: "Notices",
      path: "/dashboard/notices",
      icon: Megaphone,
      children: [
        { title: "All Notices", path: "/dashboard/notices", icon: List },
        { title: "Create Notice", path: "/dashboard/notices/create", icon: FilePlus },
      ],
    },
  ];

  const isPathActive = (path: string) => pathname === path;

  const isItemActive = (item: NavItem) => {
    if (item.children?.length) {
      return (
        item.children.some((c) => isPathActive(c.path)) ||
        pathname.startsWith(`${item.path}/`)
      );
    }
    return isPathActive(item.path);
  };

  // Auto-expand any section whose child is active
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const set = new Set<string>();
    navItems.forEach((item) => {
      if (item.children?.some((c) => isPathActive(c.path))) set.add(item.path);
    });
    return set;
  });

  const toggleSection = (path: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const visibleNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  const renderNav = (opts: { collapsed?: boolean; onNavigate?: () => void } = {}) => {
    const isCollapsed = !!opts.collapsed;

    return visibleNavItems.map((item) => {
      const Icon = item.icon;
      const hasChildren = !!item.children?.length;
      const isActive = isItemActive(item);
      const isOpen = openSections.has(item.path);

      const base =
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
      const activeCls = "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs";
      const idleCls =
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

      const iconCls = cn(
        "h-5 w-5 shrink-0",
        isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70"
      );

      // Collapsed: render a plain icon link (sub-items hidden)
      if (isCollapsed) {
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => opts.onNavigate?.()}
            className={cn(base, "justify-center px-2", isActive ? activeCls : idleCls)}
            title={item.title}
          >
            <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70")} />
          </Link>
        );
      }

      return (
        <div key={item.path}>
          {/* Top-level item */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleSection(item.path)}
              aria-expanded={isOpen}
              className={cn(base, "w-full text-left", isActive ? activeCls : idleCls)}
            >
              <Icon className={iconCls} />
              <span className="flex-1 truncate">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
          ) : (
            <Link href={item.path} onClick={() => opts.onNavigate?.()} className={cn(base, isActive ? activeCls : idleCls)}>
              <Icon className={iconCls} />
              <span className="truncate">{item.title}</span>
            </Link>
          )}

          {/* Sub-items */}
          {hasChildren && isOpen && (
            <div className="mt-1 space-y-0.5">
              {(item.children ?? []).map((child) => {
                if (child.permission && !hasPermission(child.permission)) return null;
                const childActive = isPathActive(child.path);
                const ChildIcon = child.icon;
                return (
                  <Link
                    key={child.path}
                    href={child.path}
                    onClick={() => opts.onNavigate?.()}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg py-2 pl-10 pr-3 text-[13px] font-medium transition-colors",
                      childActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {ChildIcon ? (
                      <ChildIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                    )}
                    <span className="truncate">{child.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Desktop sidebar (hidden on small screens) */}
      <aside
        className={cn(
          "relative hidden lg:flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out select-none",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
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
          {renderNav({ collapsed })}
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

      {/* Mobile drawer sidebar (full size, opened via header menu button) */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onClose?.()}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 p-0 flex flex-col gap-0 bg-sidebar text-sidebar-foreground border-sidebar-border"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>

          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-sidebar-foreground whitespace-nowrap">
                DCMS Portal
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {renderNav({ onNavigate: onClose })}
          </nav>

          {/* Footer info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs text-sidebar-accent-foreground">
              <p className="font-semibold">DCMS v1.0.0</p>
              <p className="text-muted-foreground mt-0.5">Role Based Access Control</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}