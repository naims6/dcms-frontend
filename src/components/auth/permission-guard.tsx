"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface PermissionGuardProps {
  requiredPermission: string;
  children: React.ReactNode;
}

export function PermissionGuard({ requiredPermission, children }: PermissionGuardProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-5 animate-in fade-in-0 duration-300">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            403 - Access Restricted
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not possess the required permission (<code className="font-mono font-semibold text-destructive">{requiredPermission}</code>) to access this administrative section.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/dashboard">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return Overview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
