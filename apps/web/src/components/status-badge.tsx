import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<
    ApplicationStatus,
    { variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive"; label: string }
  > = {
    draft: { variant: "secondary", label: "Draft" },
    submitted: { variant: "info", label: "Submitted" },
    under_review: { variant: "warning", label: "Under Review" },
    interview: { variant: "info", label: "Interview" },
    accepted: { variant: "success", label: "Accepted" },
    rejected: { variant: "destructive", label: "Rejected" },
    waitlisted: { variant: "warning", label: "Waitlisted" },
  };

  const { variant, label } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}
