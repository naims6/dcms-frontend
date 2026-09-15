import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, UserCheck, KeyRound } from "lucide-react";
import { User } from "@/types/auth.types";

interface RecentActivityProps {
  user: User | null;
}

export function RecentActivity({ user }: RecentActivityProps) {
  const activities = [
    {
      id: "act-1",
      title: "Authentication Successful",
      description: `User ${user?.email || "admin@dcms.com"} logged into dashboard`,
      time: "Just now",
      icon: UserCheck,
      badge: "Auth",
      badgeVariant: "default" as const,
    },
    {
      id: "act-2",
      title: "Permissions Hydrated",
      description: `${user?.permissions?.length || 0} system permissions verified`,
      time: "1 min ago",
      icon: KeyRound,
      badge: "RBAC",
      badgeVariant: "secondary" as const,
    },
    {
      id: "act-3",
      title: "Token Refreshed",
      description: "JWT access token successfully issued",
      time: "5 mins ago",
      icon: Lock,
      badge: "Security",
      badgeVariant: "outline" as const,
    },
  ];

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">Recent Security & Session Events</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Live stream of authentication and access control activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{act.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant={act.badgeVariant} className="text-[10px] px-1.5 py-0">
                    {act.badge}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
