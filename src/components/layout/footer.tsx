import Link from "next/link";

const footerLinks = {
  explore: [
    { label: "Browse Events", href: "/events" },
    { label: "Music Festivals", href: "/events?category=festival" },
    { label: "Live Concerts", href: "/events?category=concert" },
  ],
  account: [
    { label: "Create Account", href: "/register" },
    { label: "Login", href: "/login" },
    { label: "My Tickets", href: "/account/tickets" },
  ],
  organizers: [
    { label: "Organizer Dashboard", href: "/organizer" },
    { label: "Create an Event", href: "/organizer/events/new" },
    { label: "Sales Overview", href: "/organizer/dashboard" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex text-2xl font-bold tracking-tight"
            >
              EventGo
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              Discover exciting musical events, book tickets securely, and
              access digital QR tickets from one simple platform.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure online ticket booking
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={footerLinks.explore}
          />

          <FooterColumn
            title="Account"
            links={footerLinks.account}
          />

          <FooterColumn
            title="Organizers"
            links={footerLinks.organizers}
          />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} EventGo. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterColumn({
  title,
  links,
}: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-300">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}