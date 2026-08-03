import Link from "next/link";

import { EventCard } from "@/features/events/components/event-card";
import type { EventCardData } from "@/features/events/types";

const featuredEvents: EventCardData[] = [
  {
    id: "colombo-music-festival",
    title: "Colombo Music Festival 2026",
    category: "Music Festival",
    venue: "Lotus Tower Grounds, Colombo",
    date: "August 22, 2026",
    time: "6:00 PM",
    startingPrice: 3500,
    accent: "from-violet-600 via-purple-600 to-fuchsia-500",
  },
  {
    id: "acoustic-night",
    title: "Acoustic Night Under the Stars",
    category: "Acoustic",
    venue: "Viharamahadevi Open Air Theatre",
    date: "September 5, 2026",
    time: "7:00 PM",
    startingPrice: 2000,
    accent: "from-cyan-500 via-blue-600 to-indigo-700",
  },
  {
    id: "electronic-wave",
    title: "Electronic Wave Live Experience",
    category: "Electronic",
    venue: "Port City Colombo",
    date: "September 19, 2026",
    time: "8:00 PM",
    startingPrice: 4500,
    accent: "from-orange-500 via-rose-500 to-pink-600",
  },
];

export function FeaturedEventsSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Upcoming experiences
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Featured musical events
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Explore some of the most exciting upcoming concerts and live
              musical experiences available through EventGo.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit items-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            View all events
          </Link>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}