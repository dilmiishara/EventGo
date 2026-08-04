import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/logout-button";

const navigationLinks = [
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "How It Works",
    href: "/#how-it-works",
  },
];

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);
  const userInitial =
    user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="EventGo homepage"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition group-hover:scale-105">
            EG
          </span>

          <span className="text-xl font-bold tracking-tight text-gray-950">
            Event<span className="text-violet-600">Go</span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-4">
            {isAuthenticated ? (
              <>
                <Link
                    href="/account"
                    title={user?.email ?? "Open account"}
                    aria-label="Open my account"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
                    >
                    {userInitial}
                    </Link>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="ml-auto md:hidden">
          <MobileMenu
            isAuthenticated={isAuthenticated}
            userEmail={user?.email ?? null}
          />
        </div>
      </div>
    </header>
  );
}