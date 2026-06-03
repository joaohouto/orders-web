import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { MembershipStatus } from "@/types/association";

const membershipStatusLabels: Record<MembershipStatus, string> = {
  PENDING: "PENDENTE",
  ACTIVE: "ATIVO",
  EXPIRED: "EXPIRADO",
  CANCELED: "CANCELADO",
};

const statusStyles: Record<MembershipStatus, string> = {
  PENDING:
    "bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/50 dark:border-amber-200/50",
  ACTIVE:
    "bg-green-100 border-green-200 text-green-800 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/50 dark:border-green-200/50",
  EXPIRED:
    "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:border-gray-200/50",
  CANCELED:
    "bg-red-100 border-red-200 text-red-800 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/50 dark:border-red-200/50",
};

const StatusIcon: Record<MembershipStatus, React.ElementType> = {
  PENDING: Clock,
  ACTIVE: CheckCircle,
  EXPIRED: AlertCircle,
  CANCELED: XCircle,
};

interface MembershipStatusBadgeProps {
  status: MembershipStatus;
  className?: string;
}

export function MembershipStatusBadge({ status, className }: MembershipStatusBadgeProps) {
  const Icon = StatusIcon[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border-1 flex items-center gap-1.5",
        statusStyles[status],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {membershipStatusLabels[status]}
    </Badge>
  );
}
