import Link from "next/link";

import { BookingStatusBadge } from "@/features/account/components/booking-status-badge";
import type { Database } from "@/types/database";

type Booking =
  Database["public"]["Tables"]["bookings"]["Row"];

type BookingCardProps = {
  booking: Booking;
};

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatCurrency(value: number | null) {
  return currencyFormatter.format(value ?? 0);
}

export function BookingCard({
  booking,
}: BookingCardProps) {
  const totalAmount =
    booking.total_amount ??
    booking.subtotal + booking.service_fee;

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-gray-500">
              Booking reference
            </p>

            <BookingStatusBadge status={booking.status} />
          </div>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-950">
            {booking.reference_code}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Created{" "}
            {dateFormatter.format(
              new Date(booking.created_at),
            )}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            Total amount
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-950">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
        <BookingDetail
          label="Subtotal"
          value={formatCurrency(booking.subtotal)}
        />

        <BookingDetail
          label="Service fee"
          value={formatCurrency(booking.service_fee)}
        />

        <BookingDetail
          label="Currency"
          value={booking.currency}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/account/bookings/${booking.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
        >
          View booking
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

type BookingDetailProps = {
  label: string;
  value: string;
};

function BookingDetail({
  label,
  value,
}: BookingDetailProps) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}