export function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center flex flex-col items-center mb-14">
      {badge && (
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 dark:bg-primary/12 px-4 py-1.5 text-sm font-semibold text-primary mb-4 tracking-wide">
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
        {title}
      </h2>
      <div className="w-16 h-1.5 bg-primary rounded-full mb-5" />
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}