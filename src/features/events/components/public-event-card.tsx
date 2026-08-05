import Link from "next/link";

import type { PublicEventListItem } from "@/features/events/queries/get-public-events";

type PublicEventCardProps = {
  event: PublicEventListItem;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const priceFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function PublicEventCard({
  event,
}: PublicEventCardProps) {
  const isSoldOut = event.ticketsRemaining === 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-500">
        {event.posterUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.posterUrl}
              alt={`${event.title} event poster`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <span className="text-3xl font-bold text-white/90">
              {event.title}
            </span>
          </div>
        )}

        <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-gray-950/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          {event.category}
        </span>

        {isSoldOut && (
          <span className="absolute right-5 top-5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold text-violet-700">
          {dateFormatter.format(new Date(event.eventDate))}
        </p>

        <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">
          {event.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {event.venue}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Starting from
            </p>

            <p className="mt-1 text-lg font-bold text-gray-950">
              {event.startingPrice === null
                ? "Unavailable"
                : event.startingPrice === 0
                  ? "Free"
                  : priceFormatter.format(
                      event.startingPrice,
                    )}
            </p>
          </div>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
          >
            View event
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}