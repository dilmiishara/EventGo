import Link from "next/link";

export function CtaSection() {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-white shadow-2xl sm:px-10 lg:px-16 lg:py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
              Your next experience awaits
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Find the music, book your ticket, and enjoy the moment
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              Explore upcoming musical events and receive secure digital
              tickets directly through your EventGo account.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-violet-100"
              >
                Explore Events
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
              For organizers
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Bring your event to a wider audience
            </h3>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              Create events, manage ticket types, monitor sales, and provide
              attendees with secure QR-based digital tickets.
            </p>

            <Link
              href="/organizer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-white"
            >
              Organizer portal
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}