import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";

type AccountShellProps = {
  children: ReactNode;
  fullName: string;
  email: string;
  role: string;
};

const accountLinks = [
  {
    label: "Overview",
    href: "/account",
    icon: "⌂",
  },
  {
    label: "My Bookings",
    href: "/account/bookings",
    icon: "▣",
  },
  {
    label: "My Tickets",
    href: "/account/tickets",
    icon: "◫",
  },
];

export function AccountShell({
  children,
  fullName,
  email,
  role,
}: AccountShellProps) {
  const initial =
    fullName.trim().charAt(0).toUpperCase() ||
    email.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="EventGo homepage"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
              EG
            </span>

            <span className="text-xl font-bold tracking-tight text-gray-950">
              Event<span className="text-violet-600">Go</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/events"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 sm:inline-flex"
            >
              Browse Events
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8 lg:py-10">
        <aside className="h-fit overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-gray-950">
                  {fullName}
                </p>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {email}
                </p>
              </div>
            </div>

            <span className="mt-4 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold capitalize text-violet-700">
              {role}
            </span>
          </div>

          <nav
            aria-label="Account navigation"
            className="p-3"
          >
            <ul className="space-y-1">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-700"
                    >
                      {link.icon}
                    </span>

                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}