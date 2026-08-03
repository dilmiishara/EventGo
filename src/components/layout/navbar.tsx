import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          EventGo
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/events"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Events
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}