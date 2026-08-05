import type { Metadata } from "next";
import Link from "next/link";

import { PublicEventCard } from "@/features/events/components/public-event-card";
import {
  getPublicEventCategories,
  getPublicEvents,
} from "@/features/events/queries/get-public-events";

export const metadata: Metadata = {
  title: "Events | EventGo",
  description:
    "Discover upcoming musical events and ticket options.",
};

type EventsPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    from?: string | string[];
    to?: string | string[];
  }>;
};

export default async function EventsPage({
  searchParams,
}: EventsPageProps) {
  const params = await searchParams;

  const search = getSingleValue(params.search);
  const category = getSingleValue(params.category);
  const fromDate = getSingleValue(params.from);
  const toDate = getSingleValue(params.to);

  const [{ events, hasError }, categories] =
    await Promise.all([
      getPublicEvents({
        search,
        category,
        fromDate,
        toDate,
      }),
      getPublicEventCategories(),
    ]);

  const hasFilters = Boolean(
    search || category || fromDate || toDate,
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            Live experiences
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Discover your next unforgettable event
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-300">
            Explore upcoming musical events, compare ticket
            options, and find an experience that matches you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form
          method="GET"
          className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
        >
          <div>
            <label
              htmlFor="search"
              className="text-sm font-semibold text-gray-700"
            >
              Search
            </label>

            <input
              id="search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Search by event title"
              className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              defaultValue={category}
              className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="">All categories</option>

              {categories.map((eventCategory) => (
                <option
                  key={eventCategory}
                  value={eventCategory}
                >
                  {eventCategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="from"
              className="text-sm font-semibold text-gray-700"
            >
              From
            </label>

            <input
              id="from"
              name="from"
              type="date"
              defaultValue={fromDate}
              className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div>
            <label
              htmlFor="to"
              className="text-sm font-semibold text-gray-700"
            >
              To
            </label>

            <input
              id="to"
              name="to"
              type="date"
              defaultValue={toDate}
              className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="h-12 flex-1 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Apply
            </button>

            {hasFilters && (
              <Link
                href="/events"
                className="flex h-12 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {hasError ? (
          <div
            role="alert"
            className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6"
          >
            <h2 className="font-bold text-red-900">
              Events could not be loaded
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Refresh the page and try again.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-950">
              No upcoming events found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600">
              No published events currently match your selected
              filters.
            </p>

            {hasFilters && (
              <Link
                href="/events"
                className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
              >
                View all events
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-violet-700">
                  Upcoming events
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                  {events.length}{" "}
                  {events.length === 1 ? "event" : "events"} found
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <PublicEventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function getSingleValue(
  value: string | string[] | undefined,
) {
  return typeof value === "string" ? value : "";
}