create table contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table contact_leads enable row level security;

-- Grant permissions
grant insert on contact_leads to anon;
grant all on contact_leads to authenticated;

-- Anon can insert (contact form submissions)
create policy "allow_anon_insert" on contact_leads
  for insert to anon
  with check (true);

-- Authenticated has full access (admin panel)
create policy "allow_auth_all" on contact_leads
  for all to authenticated
  using (true)
  with check (true);
