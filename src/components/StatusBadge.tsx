import React from "react";
import { CheckCircle2, AlertTriangle, Clock, XCircle } from "lucide-react";

export type StatusType = "complete" | "partial" | "pending" | "failed";

/**
 * StatusBadge component
 *
 * Displays a color‑coded badge with an icon that corresponds to the given status.
 * Use this component on dashboards or reports to quickly convey the state of a feature or test case.
 *
 * Status meanings:
 * - `complete`: The feature is fully implemented and tested.
 * - `partial`: The feature is partially implemented or only some tests pass.
 * - `pending`: The feature is not yet implemented or tests are not available.
 * - `failed`: Tests failed or the feature is broken.
 */
export const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  let content;
  switch (status) {
    case "complete":
      content = {
        label: "Complete",
        color: "bg-green-100 text-green-800",
        Icon: CheckCircle2,
      };
      break;
    case "partial":
      content = {
        label: "Partial",
        color: "bg-yellow-100 text-yellow-800",
        Icon: AlertTriangle,
      };
      break;
    case "failed":
      content = {
        label: "Failed",
        color: "bg-red-100 text-red-800",
        Icon: XCircle,
      };
      break;
    case "pending":
    default:
      content = {
        label: "Pending",
        color: "bg-gray-100 text-gray-800",
        Icon: Clock,
      };
      break;
  }
  const IconComponent = content.Icon;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${content.color}`}
      data-testid={`status-badge-${status}`}
    >
      <IconComponent className="mr-1 h-3 w-3" />
      {content.label}
    </span>
  );
};

export default StatusBadge;