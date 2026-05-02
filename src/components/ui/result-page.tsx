import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

type ResultStatus = "success" | "error" | "warning" | "info";

const statusConfig: Record<ResultStatus, { icon: React.ElementType; iconClass: string }> = {
  success: { icon: CheckCircle2, iconClass: "text-green-500" },
  error: { icon: XCircle, iconClass: "text-red-500" },
  warning: { icon: AlertCircle, iconClass: "text-orange-500" },
  info: { icon: Info, iconClass: "text-blue-500" },
};

function ResultPage({
  status = "info",
  title,
  description,
  children,
  className,
}: {
  status?: ResultStatus;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, iconClass } = statusConfig[status];
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <Icon className={cn("h-16 w-16 mb-4", iconClass)} />
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      {description && <p className="text-muted-foreground mb-6 max-w-md">{description}</p>}
      {children && <div className="flex gap-3">{children}</div>}
    </div>
  );
}

export { ResultPage };
