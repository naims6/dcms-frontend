import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, CheckCircle2, TrendingUp } from "lucide-react";
import { User } from "@/types/auth.types";

interface OverviewStatsProps {
  user: User | null;
}

export function OverviewStats({ user }: OverviewStatsProps) {
  const stats = [
    {
      title: "Active Roles",
      value: user?.roles?.length || 0,
      description: "Assigned access levels",
      icon: Shield,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Permissions Count",
      value: user?.permissions?.includes("*") ? "All (*)" : user?.permissions?.length || 0,
      description: "Granted authorization tags",
      icon: Key,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Account Status",
      value: user?.status || "ACTIVE",
      description: "System connection state",
      icon: CheckCircle2,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      title: "System Performance",
      value: "99.9%",
      description: "Service uptime",
      icon: TrendingUp,
      color: "text-violet-500 bg-violet-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="border border-border/80 bg-card shadow-xs transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
