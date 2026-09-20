import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardPageHeaderProps {
  /** Page title text */
  title: string;
  /** Optional subtitle / description shown below the title */
  description?: string;
  /** Lucide icon rendered next to the title */
  icon?: LucideIcon;
  /** Tailwind colour class applied to the icon, e.g. "text-primary" */
  iconClassName?: string;
  /** Optional slot rendered on the right side (e.g. action buttons) */
  actions?: ReactNode;
}

/**
 * Reusable header block shared across every dashboard page.
 *
 * Usage:
 * ```tsx
 * <DashboardPageHeader
 *   title="User Accounts"
 *   description="Manage registered users"
 *   icon={Users}
 *   actions={<Button>Create User</Button>}
 * />
 * ```
 */
export function DashboardPageHeader({
  title,
  description,
  icon: Icon,
  iconClassName = "text-primary",
  actions,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          {Icon && <Icon className={`h-7 w-7 shrink-0 ${iconClassName}`} />}
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
