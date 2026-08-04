import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type AccountDashboardStats = {
  upcomingBookings: number;
  digitalTickets: number;
  completedEvents: number;
  hasError: boolean;
};

const emptyStats: AccountDashboardStats = {
  upcomingBookings: 0,
  digitalTickets: 0,
  completedEvents: 0,
  hasError: false,
};

export async function getAccountDashboardStats(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<AccountDashboardStats> {
  const { data: paidBookings, error: bookingsError } =
    await supabase
      .from("bookings")
      .select(`
        id,
        booking_items (
          id,
          ticket_type:ticket_types (
            event:events (
              id,
              event_date
            )
          )
        )
      `)
      .eq("user_id", userId)
      .eq("status", "paid");

  if (bookingsError) {
    console.error(
      "Failed to load account dashboard bookings:",
      bookingsError,
    );

    return {
      ...emptyStats,
      hasError: true,
    };
  }

  const bookings = paidBookings ?? [];
  const currentTime = Date.now();

  const bookingItemIds: string[] = [];
  const completedEventIds = new Set<string>();

  let upcomingBookings = 0;

  for (const booking of bookings) {
    let bookingHasUpcomingEvent = false;

    for (const bookingItem of booking.booking_items ?? []) {
      bookingItemIds.push(bookingItem.id);

      const event = bookingItem.ticket_type?.event;

      if (!event) {
        continue;
      }

      const eventTime = new Date(event.event_date).getTime();

      if (Number.isNaN(eventTime)) {
        continue;
      }

      if (eventTime >= currentTime) {
        bookingHasUpcomingEvent = true;
      } else {
        completedEventIds.add(event.id);
      }
    }

    if (bookingHasUpcomingEvent) {
      upcomingBookings += 1;
    }
  }

  if (bookingItemIds.length === 0) {
    return {
      upcomingBookings,
      digitalTickets: 0,
      completedEvents: completedEventIds.size,
      hasError: false,
    };
  }

  const {
    count: digitalTicketCount,
    error: ticketsError,
  } = await supabase
    .from("tickets")
    .select("id", {
      count: "exact",
      head: true,
    })
    .in("booking_item_id", bookingItemIds)
    .eq("status", "valid");

  if (ticketsError) {
    console.error(
      "Failed to count account dashboard tickets:",
      ticketsError,
    );
  }

  return {
    upcomingBookings,
    digitalTickets: digitalTicketCount ?? 0,
    completedEvents: completedEventIds.size,
    hasError: Boolean(ticketsError),
  };
}