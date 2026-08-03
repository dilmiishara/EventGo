-- ============================================================
-- EventGo initial database schema
-- ============================================================

-- ------------------------------------------------------------
-- 1. ENUM TYPES
-- ------------------------------------------------------------

create type public.user_role as enum (
  'attendee',
  'organizer'
);

create type public.event_status as enum (
  'draft',
  'published',
  'cancelled'
);

create type public.booking_status as enum (
  'pending',
  'paid',
  'failed',
  'cancelled',
  'expired',
  'refunded'
);

create type public.ticket_status as enum (
  'valid',
  'used',
  'cancelled',
  'refunded'
);

create type public.payment_status as enum (
  'pending',
  'paid',
  'failed',
  'refunded'
);

-- ------------------------------------------------------------
-- 2. PROFILES
-- Authentication credentials remain inside auth.users.
-- This table stores EventGo application profile information.
-- ------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,

  role public.user_role not null default 'attendee',

  avatar_url text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. EVENTS
-- ------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),

  organizer_id uuid not null
    references public.profiles(id)
    on delete restrict,

  title text not null
    check (char_length(title) between 3 and 150),

  slug text not null unique
    check (
      slug = lower(slug)
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  description text not null
    check (char_length(description) >= 20),

  category text not null
    check (char_length(category) between 2 and 60),

  venue text not null
    check (char_length(venue) between 2 and 200),

  event_date timestamptz not null,

  poster_url text,

  status public.event_status not null default 'draft',

  published_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. TICKET TYPES
-- Examples: General, VIP, Early Bird
-- ------------------------------------------------------------

create table public.ticket_types (
  id uuid primary key default gen_random_uuid(),

  event_id uuid not null
    references public.events(id)
    on delete cascade,

  name text not null
    check (char_length(name) between 2 and 80),

  description text,

  price numeric(12, 2) not null
    check (price >= 0),

  quantity_total integer not null
    check (quantity_total > 0),

  quantity_remaining integer not null
    check (quantity_remaining >= 0),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint ticket_types_remaining_quantity_check
    check (quantity_remaining <= quantity_total),

  constraint ticket_types_event_name_unique
    unique (event_id, name)
);

-- ------------------------------------------------------------
-- 5. BOOKINGS
-- One booking can contain one or more booking items.
-- ------------------------------------------------------------

create table public.bookings (
  id uuid primary key default gen_random_uuid(),

  reference_code text not null unique
    default (
      'EG-' ||
      upper(
        substr(
          replace(gen_random_uuid()::text, '-', ''),
          1,
          12
        )
      )
    ),

  user_id uuid not null
    references public.profiles(id)
    on delete restrict,

  status public.booking_status not null default 'pending',

  subtotal numeric(12, 2) not null
    check (subtotal >= 0),

  service_fee numeric(12, 2) not null default 0
    check (service_fee >= 0),

  total_amount numeric(12, 2)
    generated always as (subtotal + service_fee) stored,

  currency text not null default 'LKR'
    check (
      char_length(currency) = 3
      and currency = upper(currency)
    ),

  stripe_checkout_session_id text unique,

  idempotency_key text unique,

  paid_at timestamptz,

  expires_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. BOOKING ITEMS
-- Stores the selected ticket types and purchase-time prices.
-- ------------------------------------------------------------

create table public.booking_items (
  id uuid primary key default gen_random_uuid(),

  booking_id uuid not null
    references public.bookings(id)
    on delete cascade,

  ticket_type_id uuid not null
    references public.ticket_types(id)
    on delete restrict,

  quantity integer not null
    check (quantity > 0),

  unit_price numeric(12, 2) not null
    check (unit_price >= 0),

  line_total numeric(12, 2)
    generated always as (unit_price * quantity) stored,

  created_at timestamptz not null default now(),

  constraint booking_items_ticket_type_unique
    unique (booking_id, ticket_type_id)
);

-- ------------------------------------------------------------
-- 7. INDIVIDUAL DIGITAL TICKETS
-- One row represents one issued attendee ticket.
-- ------------------------------------------------------------

create table public.tickets (
  id uuid primary key default gen_random_uuid(),

  booking_item_id uuid not null
    references public.booking_items(id)
    on delete cascade,

  ticket_code text not null unique
    default (
      'TKT-' ||
      upper(
        substr(
          replace(gen_random_uuid()::text, '-', ''),
          1,
          12
        )
      )
    ),

  qr_token uuid not null unique default gen_random_uuid(),

  status public.ticket_status not null default 'valid',

  checked_in_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. PAYMENTS
-- Stripe-specific identifiers are stored here.
-- ------------------------------------------------------------

create table public.payments (
  id uuid primary key default gen_random_uuid(),

  booking_id uuid not null unique
    references public.bookings(id)
    on delete restrict,

  provider text not null default 'stripe'
    check (provider = 'stripe'),

  provider_checkout_session_id text unique,

  provider_payment_intent_id text unique,

  amount numeric(12, 2) not null
    check (amount >= 0),

  currency text not null default 'LKR'
    check (
      char_length(currency) = 3
      and currency = upper(currency)
    ),

  status public.payment_status not null default 'pending',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 9. WEBHOOK EVENTS
-- Stores processed Stripe event IDs to prevent duplicate handling.
-- ------------------------------------------------------------

create table public.webhook_events (
  id text primary key,

  provider text not null default 'stripe'
    check (provider = 'stripe'),

  event_type text not null,

  processing_status text not null default 'received'
    check (
      processing_status in (
        'received',
        'processed',
        'failed'
      )
    ),

  payload jsonb not null default '{}'::jsonb,

  processing_error text,

  received_at timestamptz not null default now(),

  processed_at timestamptz
);

-- ------------------------------------------------------------
-- 10. UPDATED_AT FUNCTION
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- 11. UPDATED_AT TRIGGERS
-- ------------------------------------------------------------

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create trigger ticket_types_set_updated_at
before update on public.ticket_types
for each row
execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

create trigger tickets_set_updated_at
before update on public.tickets
for each row
execute function public.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 12. AUTOMATIC PROFILE CREATION
-- Every new Supabase Auth user receives an attendee profile.
-- The organizer role is not taken from editable signup metadata.
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name
  )
  values (
    new.id,
    nullif(
      trim(new.raw_user_meta_data ->> 'full_name'),
      ''
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 13. INDEXES
-- ------------------------------------------------------------

create index events_organizer_id_idx
  on public.events(organizer_id);

create index events_status_date_idx
  on public.events(status, event_date);

create index events_category_idx
  on public.events(category);

create index ticket_types_event_id_idx
  on public.ticket_types(event_id);

create index bookings_user_created_at_idx
  on public.bookings(user_id, created_at desc);

create index bookings_status_idx
  on public.bookings(status);

create index booking_items_booking_id_idx
  on public.booking_items(booking_id);

create index booking_items_ticket_type_id_idx
  on public.booking_items(ticket_type_id);

create index tickets_booking_item_id_idx
  on public.tickets(booking_item_id);

create index tickets_status_idx
  on public.tickets(status);

create index payments_status_idx
  on public.payments(status);

create index webhook_events_status_idx
  on public.webhook_events(processing_status);

-- ------------------------------------------------------------
-- 14. ENABLE ROW LEVEL SECURITY
-- Policies will be added in the next migration.
-- With RLS enabled and no policies, API access is denied by default.
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.ticket_types enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;
alter table public.tickets enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;