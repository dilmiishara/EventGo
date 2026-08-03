import Link from "next/link";

import { FeaturedTicketPreview } from "@/features/home/components/featured-ticket-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            Live music starts here
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Discover and book{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              unforgettable
            </span>{" "}
            musical events
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            Browse upcoming concerts, choose your preferred ticket type, pay
            securely, and receive your digital QR ticket through EventGo.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-gray-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-100"
            >
              Browse Events
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7">
            <HeroBenefit
              title="Secure payments"
              description="Powered by Stripe"
            />

            <HeroBenefit
              title="Instant access"
              description="Digital QR tickets"
            />

            <HeroBenefit
              title="Easy booking"
              description="Simple ticket selection"
            />
          </div>
        </div>

        <div className="hidden lg:block">
          <FeaturedTicketPreview />
        </div>

        <div className="mt-2 lg:hidden">
          <FeaturedTicketPreview />
        </div>
      </div>
    </section>
  );
}

type HeroBenefitProps = {
  title: string;
  description: string;
};

function HeroBenefit({
  title,
  description,
}: HeroBenefitProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>

      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}