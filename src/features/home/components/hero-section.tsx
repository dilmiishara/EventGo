import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-gray-950 text-white">
      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-300">
            Live music starts here
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover and book unforgettable musical events
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Browse upcoming concerts, choose your preferred ticket type and
            receive your digital ticket securely through EventGo.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
            >
              Browse Events
            </Link>

            <Link
              href="/register"
              className="rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}