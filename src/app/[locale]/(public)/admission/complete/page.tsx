"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function CompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tranId = searchParams.get("tranId");
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    const query = new URLSearchParams();
    if (tranId) query.set("tranId", tranId);
    if (status) query.set("status", status);
    if (message) query.set("message", message);
    query.set("step", "4");

    // Redirect to admissions page with query params
    router.replace(`/admissions?${query.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">
        Processing payment confirmation and preparing your receipt...
      </p>
    </div>
  );
}

export default function AdmissionCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
