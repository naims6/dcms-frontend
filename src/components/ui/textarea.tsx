import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground hover:border-input/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 focus-visible:bg-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
