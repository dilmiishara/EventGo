-- ============================================================
-- EventGo Row Level Security policies
-- ============================================================

-- ------------------------------------------------------------
-- 1. HELPER FUNCTION
-- Safely checks whether the current authenticated user
-- has the organizer role.
-- ------------------------------------------------------------

create or replace function public.is_organizer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'organizer'
  );
$$;

revoke all on function public.is_organizer() from public;
grant execute on function public.is_organizer() to authenticated;

-- ------------------------------------------------------------
-- 2. TABLE PRIVILEGES
-- RLS controls which rows are accessible.
-- These grants control which operations are available.
-- ------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select
on table public.profiles,
         public.events,
         public.ticket_types
to anon, authenticated;

grant select
on table public.bookings,
         public.booking_items,
         public.tickets,
         public.payments
to authenticated;

grant insert, update, delete
on table public.events,
         public.ticket_types
to authenticated;

-- Users may edit only normal profile fields.
-- They cannot promote themselves to organizer.
revoke update on table public.profiles from authenticated;

grant update (
  full_name,
  avatar_url
)
on table public.profiles
to authenticated;

-- No browser/API access is granted for webhook_events.
-- It will later be accessed only by trusted server-side code.

-- ------------------------------------------------------------
-- 3. PROFILES POLICIES
-- ------------------------------------------------------------

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

create policy "Public can view organizer profiles"
on public.profiles
for select
to anon, authenticated
using (
  role = 'organizer'
);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);

-- ------------------------------------------------------------
-- 4. EVENTS POLICIES
-- Public users can see published events.
-- Organizers can also see and manage their own events.
-- ------------------------------------------------------------

create policy "Public can view published events"
on public.events
for select
to anon, authenticated
using (
  status = 'published'
);

create policy "Organizers can view their own events"
on public.events
for select
to authenticated
using (
  organizer_id = auth.uid()
  and public.is_organizer()
);

create policy "Organizers can create their own events"
on public.events
for insert
to authenticated
with check (
  organizer_id = auth.uid()
  and public.is_organizer()
);

create policy "Organizers can update their own events"
on public.events
for update
to authenticated
using (
  organizer_id = auth.uid()
  and public.is_organizer()
)
with check (
  organizer_id = auth.uid()
  and public.is_organizer()
);

create policy "Organizers can delete their own events"
on public.events
for delete
to authenticated
using (
  organizer_id = auth.uid()
  and public.is_organizer()
);

-- ------------------------------------------------------------
-- 5. TICKET TYPES POLICIES
-- ------------------------------------------------------------

create policy "Public can view ticket types for published events"
on public.ticket_types
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = ticket_types.event_id
      and events.status = 'published'
  )
);

create policy "Organizers can view ticket types for their events"
on public.ticket_types
for select
to authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = ticket_types.event_id
      and events.organizer_id = auth.uid()
      and public.is_organizer()
  )
);

create policy "Organizers can create ticket types for their events"
on public.ticket_types
for insert
to authenticated
with check (
  exists (
    select 1
    from public.events
    where events.id = ticket_types.event_id
      and events.organizer_id = auth.uid()
      and public.is_organizer()
  )
);

create policy "Organizers can update ticket types for their events"
on public.ticket_types
for update
to authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = ticket_types.event_id
      and events.organizer_id = auth.uid()
      and public.is_organizer()
  )
)
with check (
  exists (
    select 1
    from public.events
    where events.id = ticket_types.event_id
      and events.organizer_id = auth.uid()
      and public.is_organizer()
  )
);

create policy "Organizers can delete ticket types for their events"
on public.ticket_types
for delete
to authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = ticket_types.event_id
      and events.organizer_id = auth.uid()
      and public.is_organizer()
  )
);

-- ------------------------------------------------------------
-- 6. BOOKINGS POLICIES
-- Attendees can read their own bookings.
-- Booking creation and payment updates will later happen
-- through trusted server-side operations.
-- ------------------------------------------------------------

create policy "Users can view their own bookings"
on public.bookings
for select
to authenticated
using (
  user_id = auth.uid()
);

-- ------------------------------------------------------------
-- 7. BOOKING ITEMS POLICIES
-- ------------------------------------------------------------

create policy "Users can view their own booking items"
on public.booking_items
for select
to authenticated
using (
  exists (
    select 1
    from public.bookings
    where bookings.id = booking_items.booking_id
      and bookings.user_id = auth.uid()
  )
);

-- ------------------------------------------------------------
-- 8. DIGITAL TICKETS POLICIES
-- ------------------------------------------------------------

create policy "Users can view their own tickets"
on public.tickets
for select
to authenticated
using (
  exists (
    select 1
    from public.booking_items
    join public.bookings
      on bookings.id = booking_items.booking_id
    where booking_items.id = tickets.booking_item_id
      and bookings.user_id = auth.uid()
  )
);

-- ------------------------------------------------------------
-- 9. PAYMENTS POLICIES
-- ------------------------------------------------------------

create policy "Users can view payments for their own bookings"
on public.payments
for select
to authenticated
using (
  exists (
    select 1
    from public.bookings
    where bookings.id = payments.booking_id
      and bookings.user_id = auth.uid()
  )
);

-- ------------------------------------------------------------
-- 10. WEBHOOK EVENTS
-- No client-facing policy is intentionally created.
-- Stripe webhook processing will use trusted server code.
-- ------------------------------------------------------------