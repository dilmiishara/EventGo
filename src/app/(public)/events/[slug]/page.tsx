import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicEventBySlug } from "@/features/events/queries/get-public-events";

type EventDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
});

const priceFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-white"
          >
            ← Back to events
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-violet-500/15 px-3 py-1.5 text-xs font-semibold text-violet-200 ring-1 ring-violet-400/30">
                {event.category}
              </span>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                {event.title}
              </h1>

              <div className="mt-7 space-y-3 text-gray-300">
                <p>
                  <strong className="text-white">Date:</strong>{" "}
                  {dateFormatter.format(
                    new Date(event.eventDate),
                  )}
                </p>

                <p>
                  <strong className="text-white">Venue:</strong>{" "}
                  {event.venue}
                </p>
              </div>

              <a
                href="#tickets"
                className="mt-8 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                View ticket options
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-500 shadow-2xl">
              {event.posterUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.posterUrl}
                    alt={`${event.title} event poster`}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                </>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center p-10 text-center text-3xl font-bold text-white">
                  {event.title}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
            About the event
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-950">
            Event details
          </h2>

          <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600">
            {event.description}
          </p>
        </section>

        <aside
          id="tickets"
          className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-950">
            Ticket options
          </h2>

          {event.ticketTypes.length === 0 ? (
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Ticket options have not been published yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {event.ticketTypes.map((ticketType) => {
                const soldOut =
                  ticketType.quantityRemaining === 0;

                return (
                  <article
                    key={ticketType.id}
                    className="rounded-2xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-950">
                          {ticketType.name}
                        </h3>

                        {ticketType.description && (
                          <p className="mt-1 text-sm leading-6 text-gray-500">
                            {ticketType.description}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 font-bold text-violet-700">
                        {ticketType.price === 0
                          ? "Free"
                          : priceFormatter.format(
                              ticketType.price,
                            )}
                      </p>
                    </div>

                    <p
                      className={`mt-4 text-xs font-semibold ${
                        soldOut
                          ? "text-red-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {soldOut
                        ? "Sold out"
                        : `${ticketType.quantityRemaining} tickets remaining`}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}