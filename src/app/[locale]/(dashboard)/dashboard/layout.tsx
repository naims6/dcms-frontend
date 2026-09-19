import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export const metadata = {
  title: "Dashboard - DCMS",
  description: "Dhanbari Collegiate Model School Management Portal",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex w-full bg-background text-foreground antialiased">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
