import Image from "next/image";

import { TicketStatusBadge } from "@/features/account/components/ticket-status-badge";
import type { Database } from "@/types/database";

type TicketStatus =
  Database["public"]["Enums"]["ticket_status"];

export type AccountTicket = {
  id: string;
  ticketCode: string;
  status: TicketStatus;
  checkedInAt: string | null;
  createdAt: string;
  qrDataUrl: string | null;
  bookingReference: string;
  ticketTypeName: string;
  eventTitle: string;
  eventDate: string | null;
  venue: string | null;
};

type TicketCardProps = {
  ticket: AccountTicket;
};

const eventDateFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const checkInFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function TicketCard({
  ticket,
}: TicketCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-lg">
      <div className="h-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />

      <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <TicketStatusBadge status={ticket.status} />

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              {ticket.ticketTypeName}
            </span>
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950">
            {ticket.eventTitle}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <TicketInformation
              label="Event date"
              value={
                ticket.eventDate
                  ? eventDateFormatter.format(
                      new Date(ticket.eventDate),
                    )
                  : "Date unavailable"
              }
            />

            <TicketInformation
              label="Venue"
              value={ticket.venue ?? "Venue unavailable"}
            />

            <TicketInformation
              label="Booking reference"
              value={ticket.bookingReference}
            />

            <TicketInformation
              label="Ticket code"
              value={ticket.ticketCode}
            />
          </div>

          {ticket.checkedInAt && (
            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-sm font-semibold text-blue-800">
                Checked in{" "}
                {checkInFormatter.format(
                  new Date(ticket.checkedInAt),
                )}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-gray-50 px-4 py-4">
            <p className="text-sm font-semibold text-gray-800">
              Keep your ticket secure
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Present this QR code at the event entrance. Do not
              share your ticket or QR code with another person.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-5">
          {ticket.qrDataUrl ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              <Image
                src={ticket.qrDataUrl}
                alt={`QR code for ticket ${ticket.ticketCode}`}
                width={180}
                height={180}
                unoptimized
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div className="flex h-[180px] w-[180px] items-center justify-center rounded-2xl bg-gray-200 px-5 text-center text-sm font-semibold text-gray-500">
              QR code unavailable
            </div>
          )}

          <p className="mt-4 break-all text-center font-mono text-xs font-semibold text-gray-600">
            {ticket.ticketCode}
          </p>
        </div>
      </div>
    </article>
  );
}

type TicketInformationProps = {
  label: string;
  value: string;
};

function TicketInformation({
  label,
  value,
}: TicketInformationProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-6 text-gray-800">
        {value}
      </p>
    </div>
  );
}