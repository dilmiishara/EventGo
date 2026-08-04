import type { Metadata } from "next";
import Link from "next/link";

import { getAccountDashboardStats } from "@/features/account/queries/get-account-dashboard-stats";
import { requireUser } from "@/features/auth/lib/require-user";

export const metadata: Metadata = {
  title: "My Account | EventGo",
  description:
    "Manage your EventGo account, bookings, and tickets.",
};

export default async function AccountPage() {
  const { supabase, userId } = await requireUser();

  const stats = await getAccountDashboardStats(
    supabase,
    userId,
  );

  const overviewCards = [
    {
      title: "Upcoming bookings",
      value: stats.upcomingBookings,
      description:
        "Your confirmed upcoming event bookings.",
      href: "/account/bookings",
      linkLabel: "View bookings",
    },
    {
      title: "Digital tickets",
      value: stats.digitalTickets,
      description:
        "Valid QR tickets currently available in your account.",
      href: "/account/tickets",
      linkLabel: "View tickets",
    },
    {
      title: "Completed events",
      value: stats.completedEvents,
      description:
        "Paid events whose scheduled date has passed.",
      href: "/account/bookings",
      linkLabel: "View history",
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
          Attendee dashboard
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          My EventGo account
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
          View your bookings, access digital tickets, and
          manage your attendee information.
        </p>
      </div>

      {stats.hasError && (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
          <p className="font-semibold text-amber-900">
            Some account statistics could not be loaded.
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-700">
            Refresh the page to try loading them again.
          </p>
        </div>
      )}

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
          >
            <p className="text-sm font-semibold text-gray-500">
              {card.title}
            </p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-gray-950">
              {card.value}
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {card.description}
            </p>

            <Link
              href={card.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition group-hover:text-violet-600"
            >
              {card.linkLabel}
              <span
                aria-hidden="true"
                className="transition group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-gray-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
          Discover something new
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          Your next live experience is waiting
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300">
          Browse upcoming musical events and reserve your
          preferred ticket type through EventGo.
        </p>

        <Link
          href="/events"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-violet-100"
        >
          Browse Events
        </Link>
      </section>
    </div>
  );
}