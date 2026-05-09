-- Run this in your Supabase SQL Editor

create table if not exists bouquets (
  id uuid primary key,
  name text not null default 'A bouquet for you',
  flowers jsonb not null default '[]',
  note text not null default '',
  recipient_name text not null default '',
  recipient_email text not null default '',
  sender_name text not null default 'Someone',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table bouquets enable row level security;

-- Allow anyone to read a bouquet by ID (for the reveal page)
create policy "Public read by id"
  on bouquets for select
  using (true);

-- Allow anyone to insert a bouquet (no auth required)
create policy "Public insert"
  on bouquets for insert
  with check (true);
