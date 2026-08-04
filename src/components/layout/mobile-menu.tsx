"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

type MobileMenuProps = {
  isAuthenticated: boolean;
  userEmail: string | null;
};

export function MobileMenu({
  isAuthenticated,
  userEmail,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Open navigation menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-950 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 md:hidden"
      >
        <MenuIcon />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[150] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-gray-950/70 backdrop-blur-md"
          />

          <aside
            id="mobile-navigation"
            className="absolute right-0 top-0 z-10 flex max-h-[92dvh] w-[min(88vw,380px)] flex-col overflow-hidden rounded-bl-3xl border-b border-l border-violet-400/20 bg-[#111827] text-white shadow-2xl"
            style={{
                backgroundColor: "#111827",
            }}
            >
            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 bg-[#172033] px-5">
                <Link
                    href="/"
                    onClick={closeMenu}
                    className="inline-flex items-center gap-3"
                    aria-label="EventGo homepage"
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                    EG
                    </span>

                    <span className="text-xl font-bold tracking-tight text-white">
                    Event<span className="text-violet-400">Go</span>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={closeMenu}
                    aria-label="Close navigation menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-gray-200 transition hover:bg-white/20 hover:text-white"
                >
                    <CloseIcon />
                </button>
                </div>

            <nav className="flex flex-col overflow-y-auto bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#080d19] px-5 py-6">
              <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Navigation
              </p>

              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 text-base font-semibold text-white shadow-sm transition hover:border-violet-400/40 hover:bg-violet-500/20"
                    >
                      {link.label}

                      <span
                        aria-hidden="true"
                        className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-violet-300"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-white/10 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {userEmail && (
                      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white">
                            {userEmail.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                              Signed in as
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-white">
                              {userEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <LogoutButton fullWidth />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-fuchsia-400"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M4 12h16M4 17h16"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}