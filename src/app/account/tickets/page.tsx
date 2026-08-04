import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";

import {
  type AccountTicket,
  TicketCard,
} from "@/features/account/components/ticket-card";
import { requireUser } from "@/features/auth/lib/require-user";

export const metadata: Metadata = {
  title: "My Tickets | EventGo",
  description:
    "Access your EventGo digital tickets and QR codes.",
};

export default async function TicketsPage() {
  const { supabase, userId } = await requireUser();

  const {
    data: bookings,
    error: bookingsError,
  } = await supabase
    .from("bookings")
    .select("id, reference_code")
    .eq("user_id", userId);

  if (bookingsError) {
    console.error(
      "Failed to load ticket bookings:",
      bookingsError,
    );

    return <TicketsLoadError />;
  }

  const bookingRows = bookings ?? [];

  if (bookingRows.length === 0) {
    return (
      <div>
        <TicketsPageHeader />
        <EmptyTickets />
      </div>
    );
  }

  const bookingIds = bookingRows.map(
    (booking) => booking.id,
  );

  const bookingReferences = new Map(
    bookingRows.map((booking) => [
      booking.id,
      booking.reference_code,
    ]),
  );

  const {
    data: bookingItems,
    error: ticketsError,
  } = await supabase
    .from("booking_items")
    .select(`
      id,
      booking_id,
      issued_tickets:tickets (
        id,
        ticket_code,
        qr_token,
        status,
        checked_in_at,
        created_at
      ),
      ticket_type:ticket_types (
        name,
        event:events (
          title,
          event_date,
          venue
        )
      )
    `)
    .in("booking_id", bookingIds);

  if (ticketsError) {
    console.error(
      "Failed to load digital tickets:",
      ticketsError,
    );

    return <TicketsLoadError />;
  }

  const ticketRecords = (bookingItems ?? []).flatMap(
    (bookingItem) =>
      (bookingItem.issued_tickets ?? []).map((ticket) => ({
        ticket,
        bookingItem,
      })),
  );

  const tickets: AccountTicket[] = await Promise.all(
    ticketRecords.map(
      async ({ ticket, bookingItem }) => {
        const qrDataUrl = await generateQrCode(
          ticket.qr_token,
        );

        return {
          id: ticket.id,
          ticketCode: ticket.ticket_code,
          status: ticket.status,
          checkedInAt: ticket.checked_in_at,
          createdAt: ticket.created_at,
          qrDataUrl,
          bookingReference:
            bookingReferences.get(
              bookingItem.booking_id,
            ) ?? "Unavailable",
          ticketTypeName:
            bookingItem.ticket_type?.name ??
            "General admission",
          eventTitle:
            bookingItem.ticket_type?.event?.title ??
            "Event information unavailable",
          eventDate:
            bookingItem.ticket_type?.event?.event_date ??
            null,
          venue:
            bookingItem.ticket_type?.event?.venue ?? null,
        };
      },
    ),
  );

  tickets.sort((firstTicket, secondTicket) =>
    secondTicket.createdAt.localeCompare(
      firstTicket.createdAt,
    ),
  );

  return (
    <div>
      <TicketsPageHeader />

      {tickets.length === 0 ? (
        <EmptyTickets />
      ) : (
        <section className="mt-8 space-y-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
            />
          ))}
        </section>
      )}
    </div>
  );
}

async function generateQrCode(
  qrToken: string,
): Promise<string | null> {
  try {
    return await QRCode.toDataURL(qrToken, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return null;
  }
}

function TicketsPageHeader() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
        Digital access
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
        My tickets
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
        Access your EventGo digital tickets and present their QR
        codes when entering an event.
      </p>
    </div>
  );
}

function EmptyTickets() {
  return (
    <section className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        <TicketIcon />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-950">
        No digital tickets yet
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600">
        Your digital tickets and QR codes will appear here after
        tickets have been issued for a completed booking.
      </p>

      <Link
        href="/events"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
      >
        Browse Events
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

function TicketsLoadError() {
  return (
    <div>
      <TicketsPageHeader />

      <div
        role="alert"
        className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6"
      >
        <h2 className="font-bold text-red-900">
          We could not load your tickets
        </h2>

        <p className="mt-2 text-sm leading-7 text-red-700">
          Refresh the page and try again. Your ticket information
          has not been changed.
        </p>
      </div>
    </div>
  );
}

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6V7Z"
      />

      <path
        strokeLinecap="round"
        d="M13 8v1m0 3v1m0 3v1"
      />
    </svg>
  );
}