import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Megaphone,
  BookUser,
  List,
  FilePlus,
  UserPlus,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────
export interface NavSubItem {
  title: string;
  path: string;
  icon?: ComponentType<{ className?: string }>;
  permission?: string;
}

export interface NavItem {
  title: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  permission?: string;
  children?: NavSubItem[];
}

// ── Nav items ─────────────────────────────────────────────────────────────
export const dashboardNavItems: NavItem[] = [
  {
    title: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    path: "/dashboard/students",
    icon: BookUser,
    permission: "students:read",
    children: [
      { title: "All Students", path: "/dashboard/students", icon: List },
      { title: "Create Student", path: "/dashboard/students/create", icon: UserPlus },
    ],
  },
  {
    title: "Users",
    path: "/dashboard/users",
    icon: Users,
    permission: "users:read",
  },
  {
    title: "Roles & RBAC",
    path: "/dashboard/rbac/roles",
    icon: ShieldCheck,
    permission: "roles:read",
  },
  {
    title: "Notices",
    path: "/dashboard/notices",
    icon: Megaphone,
    permission: "notices:read",
    children: [
      { title: "All Notices", path: "/dashboard/notices", icon: List },
      { title: "Create Notice", path: "/dashboard/notices/create", icon: FilePlus },
    ],
  },
];
