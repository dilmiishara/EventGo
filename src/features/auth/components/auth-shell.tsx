import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

const benefits = [
  "Discover upcoming musical events",
  "Book tickets through secure checkout",
  "Access digital QR tickets instantly",
];

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-gray-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute inset-0">
            <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <Link
            href="/"
            className="relative inline-flex w-fit items-center gap-3"
            aria-label="Return to EventGo homepage"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold shadow-lg shadow-violet-500/20">
              EG
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Event<span className="text-violet-300">Go</span>
            </span>
          </Link>

          <div className="relative max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              Your music journey starts here
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Discover events and keep every ticket in one place
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-gray-300">
              Create your EventGo account to book musical events securely and
              access your digital tickets whenever you need them.
            </p>

            <ul className="mt-9 space-y-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm font-medium text-gray-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">
                    ✓
                  </span>

                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-sm text-gray-500">
            Secure musical event ticket booking
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
              aria-label="Return to EventGo homepage"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
                EG
              </span>

              <span className="text-xl font-bold tracking-tight text-gray-950">
                Event<span className="text-violet-600">Go</span>
              </span>
            </Link>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}