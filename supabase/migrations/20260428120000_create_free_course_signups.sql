create table free_course_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  role text,
  marketing_consent boolean not null default false,
  source text not null default 'thebigbomb',
  created_at timestamptz default now()
);

-- If table already existed with NOT NULL phone/role, run these:
-- alter table free_course_signups alter column phone drop not null;
-- alter table free_course_signups alter column role drop not null;

create unique index free_course_signups_email_idx on free_course_signups (lower(email));

alter table free_course_signups enable row level security;

grant insert on free_course_signups to anon;
grant all on free_course_signups to authenticated;

create policy "allow_anon_insert" on free_course_signups
  for insert to anon
  with check (marketing_consent = true);

create policy "allow_auth_all" on free_course_signups
  for all to authenticated
  using (true)
  with check (true);
