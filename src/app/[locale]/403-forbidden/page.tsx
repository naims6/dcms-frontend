"use client";

import { Link } from "@/i18n/navigation";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in-0 duration-300">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-md">
          <ShieldX className="h-12 w-12" />
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
            HTTP Status 403
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not have the required role or permission privileges to access this area. If you believe this is an error, please contact your administrator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
