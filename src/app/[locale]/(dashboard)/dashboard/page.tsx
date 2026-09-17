"use client";

import { useAuth } from "@/hooks/use-auth";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { ShieldCheck, UserPlus, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span>Role-Based Access Control Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName} {user?.lastName || ""}! 👋
          </h1>
          <p className="text-sm md:text-base text-primary-foreground/80">
            Dhanbari Collegiate Model School Administrative Control Center. You are currently logged in with{" "}
            <span className="font-bold underline underline-offset-4">{user?.roles?.[0] || "User"}</span> privileges.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {user?.roles?.map((role) => (
              <Badge key={role} className="bg-white/20 hover:bg-white/30 text-white border-none font-semibold text-xs">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Section */}
      <OverviewStats user={user} />

      {/* Grid Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions Card */}
        <Card className="md:col-span-1 border border-border/80 bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Quick Management</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Authorized actions based on your role permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Can perform="users:create">
              <Link href="/dashboard/users" className="block">
                <Button variant="outline" className="w-full justify-between h-11 border-border/70 hover:border-primary">
                  <span className="flex items-center gap-2.5 text-xs font-semibold">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Create New User
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
            </Can>

            <Can perform="roles:read">
              <Link href="/dashboard/rbac/roles" className="block">
                <Button variant="outline" className="w-full justify-between h-11 border-border/70 hover:border-primary">
                  <span className="flex items-center gap-2.5 text-xs font-semibold">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Manage System Roles
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
            </Can>
          </CardContent>
        </Card>

        {/* Activity Feed Section */}
        <div className="md:col-span-2">
          <RecentActivity user={user} />
        </div>
      </div>
    </div>
  );
}
