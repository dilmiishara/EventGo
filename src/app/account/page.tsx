import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Account | EventGo",
  description: "Manage your EventGo account, bookings, and tickets.",
};

const overviewCards = [
  {
    title: "Upcoming bookings",
    value: "0",
    description: "Your confirmed upcoming event bookings.",
  },
  {
    title: "Digital tickets",
    value: "0",
    description: "QR tickets currently available in your account.",
  },
  {
    title: "Completed events",
    value: "0",
    description: "Events you have previously attended.",
  },
];

export default function AccountPage() {
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
          View your bookings, access digital tickets, and manage your
          attendee information.
        </p>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
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
          Browse upcoming musical events and reserve your preferred ticket
          type through EventGo.
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