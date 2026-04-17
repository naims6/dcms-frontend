import { SectionHeaderProps } from "@/types/admission";


export function SectionHeader({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-md">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <div className="h-0.5 w-12 bg-linear-to-r from-primary to-transparent rounded-full" />
    </div>
  );
}
