import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";

function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <Icon className="h-16 w-16 text-muted-foreground/40 mb-4" />
      {title && <p className="text-base font-medium text-foreground mb-1">{title}</p>}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {children}
    </div>
  );
}

export { EmptyState };
