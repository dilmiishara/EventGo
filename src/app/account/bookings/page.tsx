import type { Metadata } from "next";
import Link from "next/link";

import { BookingCard } from "@/features/account/components/booking-card";
import { requireUser } from "@/features/auth/lib/require-user";

export const metadata: Metadata = {
  title: "My Bookings | EventGo",
  description: "View your EventGo booking history.",
};

export default async function BookingsPage() {
  const { supabase, userId } = await requireUser();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to load bookings:", error);

    return (
      <div>
        <PageHeader />

        <div
          role="alert"
          className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6"
        >
          <h2 className="font-bold text-red-900">
            We could not load your bookings
          </h2>

          <p className="mt-2 text-sm leading-7 text-red-700">
            Refresh the page and try again. Your booking information has not
            been changed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader />

      {bookings.length === 0 ? (
        <EmptyBookings />
      ) : (
        <section className="mt-8 space-y-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
        Booking history
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
        My bookings
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
        View your upcoming and previous EventGo ticket purchases.
      </p>
    </div>
  );
}

function EmptyBookings() {
  return (
    <section className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
        <TicketIcon />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-950">
        No bookings yet
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600">
        When you purchase tickets through EventGo, your booking details will
        appear here.
      </p>

      <Link
        href="/events"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
      >
        Browse Events
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6V7Z"
      />

      <path
        strokeLinecap="round"
        d="M13 8v1m0 3v1m0 3v1"
      />
    </svg>
  );
}