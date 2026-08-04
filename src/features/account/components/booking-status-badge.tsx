import type { Database } from "@/types/database";

type BookingStatus =
  Database["public"]["Enums"]["booking_status"];

type BookingStatusBadgeProps = {
  status: BookingStatus;
};

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-gray-100 text-gray-700 ring-gray-200",
  expired: "bg-orange-50 text-orange-700 ring-orange-200",
  refunded: "bg-blue-50 text-blue-700 ring-blue-200",
};

export function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}