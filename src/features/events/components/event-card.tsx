import Link from "next/link";

import type { EventCardData } from "../types";

type EventCardProps = {
  event: EventCardData;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`relative flex h-56 items-end overflow-hidden bg-gradient-to-br ${event.accent} p-5`}
      >
        <div className="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/20" />

        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border border-white/20 bg-white/10" />

        <span className="relative rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {event.category}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-600">
              {event.date} · {event.time}
            </p>

            <h3 className="mt-2 line-clamp-2 text-xl font-bold tracking-tight text-gray-950">
              {event.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-500">{event.venue}</p>

        <div className="mt-6 flex items-end justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Starting from
            </p>

            <p className="mt-1 text-lg font-bold text-gray-950">
              LKR {event.startingPrice.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
          >
            View event
          </Link>
        </div>
      </div>
    </article>
  );
}