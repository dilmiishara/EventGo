import type { Database } from "@/types/database";

type TicketStatus =
  Database["public"]["Enums"]["ticket_status"];

type TicketStatusBadgeProps = {
  status: TicketStatus;
};

const statusStyles: Record<TicketStatus, string> = {
  valid:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  used:
    "bg-blue-50 text-blue-700 ring-blue-200",
  cancelled:
    "bg-gray-100 text-gray-700 ring-gray-200",
  refunded:
    "bg-amber-50 text-amber-700 ring-amber-200",
};

export function TicketStatusBadge({
  status,
}: TicketStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}