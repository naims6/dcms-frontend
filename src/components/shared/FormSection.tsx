import { Card } from "@/components/ui/card";

interface FormSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor?: "primary" | "secondary" | "accent";
  children: React.ReactNode;
}

const ACCENT_STYLES = {
  primary: { card: "to-primary/5", blob: "from-primary/10" },
  secondary: { card: "to-secondary/10", blob: "from-primary/10" },
  accent: { card: "to-accent/5", blob: "from-accent/10" },
} as const;

export function FormSection({
  icon: Icon,
  title,
  description,
  accentColor = "primary",
  children,
}: FormSectionProps) {
  const colors = ACCENT_STYLES[accentColor];

  return (
    <Card
      className={`hover:translate-y-0 relative overflow-hidden border border-border shadow-md bg-linear-to-br from-background via-background ${colors.card} `}
    >
      <div
        className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br ${colors.blob} to-transparent blur-2xl -mr-16 -mt-16`}
      />

      <div className="relative p-6 sm:p-8 z-10">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-md">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground leading-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
          <div className="h-0.5 w-12 bg-linear-to-r from-primary to-transparent rounded-full" />
        </div>

        {children}
      </div>
    </Card>
  );
}
