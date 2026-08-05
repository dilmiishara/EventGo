import { createClient } from "@/lib/supabase/server";

export type PublicEventListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  eventDate: string;
  venue: string;
  posterUrl: string | null;
  startingPrice: number | null;
  ticketsRemaining: number;
};

export type PublicEventDetails = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  venue: string;
  posterUrl: string | null;
  ticketTypes: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    quantityRemaining: number;
    quantityTotal: number;
  }[];
};

export type PublicEventFilters = {
  search?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
};

export async function getPublicEvents(
  filters: PublicEventFilters,
) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from("events")
    .select(`
      id,
      slug,
      title,
      category,
      event_date,
      venue,
      poster_url,
      ticket_types (
        price,
        quantity_remaining
      )
    `)
    .eq("status", "published")
    .gte("event_date", now)
    .order("event_date", {
      ascending: true,
    });

  const search = filters.search?.trim().slice(0, 80);
  const category = filters.category?.trim();

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (isValidDate(filters.fromDate)) {
    query = query.gte(
      "event_date",
      `${filters.fromDate}T00:00:00.000Z`,
    );
  }

  if (isValidDate(filters.toDate)) {
    query = query.lte(
      "event_date",
      `${filters.toDate}T23:59:59.999Z`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load public events:", error);

    return {
      events: [] as PublicEventListItem[],
      hasError: true,
    };
  }

  const events: PublicEventListItem[] = (data ?? []).map(
    (event) => {
      const ticketTypes = event.ticket_types ?? [];

      const prices = ticketTypes.map(
        (ticketType) => ticketType.price,
      );

      return {
        id: event.id,
        slug: event.slug,
        title: event.title,
        category: event.category,
        eventDate: event.event_date,
        venue: event.venue,
        posterUrl: event.poster_url,
        startingPrice:
          prices.length > 0 ? Math.min(...prices) : null,
        ticketsRemaining: ticketTypes.reduce(
          (total, ticketType) =>
            total + ticketType.quantity_remaining,
          0,
        ),
      };
    },
  );

  return {
    events,
    hasError: false,
  };
}

export async function getPublicEventCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("category")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString())
    .order("category", {
      ascending: true,
    });

  if (error) {
    console.error("Failed to load event categories:", error);
    return [];
  }

  return Array.from(
    new Set(
      (data ?? [])
        .map((event) => event.category.trim())
        .filter(Boolean),
    ),
  );
}

export async function getPublicEventBySlug(
  slug: string,
): Promise<PublicEventDetails | null> {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select(`
      id,
      slug,
      title,
      description,
      category,
      event_date,
      venue,
      poster_url,
      ticket_types (
        id,
        name,
        description,
        price,
        quantity_remaining,
        quantity_total
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to load public event:", error);
    return null;
  }

  if (!event) {
    return null;
  }

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    category: event.category,
    eventDate: event.event_date,
    venue: event.venue,
    posterUrl: event.poster_url,
    ticketTypes: (event.ticket_types ?? [])
      .map((ticketType) => ({
        id: ticketType.id,
        name: ticketType.name,
        description: ticketType.description,
        price: ticketType.price,
        quantityRemaining:
          ticketType.quantity_remaining,
        quantityTotal: ticketType.quantity_total,
      }))
      .sort(
        (firstTicket, secondTicket) =>
          firstTicket.price - secondTicket.price,
      ),
  };
}

function isValidDate(
  value: string | undefined,
): value is string {
  if (!value) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}