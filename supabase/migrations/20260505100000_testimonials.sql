-- Testimonials table for course members.
-- Anonymous users CANNOT directly insert/select. All inserts go through the
-- submit-testimonial Edge Function (service role) which validates membership.
-- Authenticated users (admin) have full read/write.

CREATE TABLE IF NOT EXISTS testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id     int REFERENCES course_members(id) ON DELETE SET NULL,
  name          text NOT NULL,
  email         text NOT NULL,
  role          text,
  company       text,
  testimonial   text NOT NULL,
  rating        int CHECK (rating BETWEEN 1 AND 5),
  linkedin_url  text,
  avatar_url    text,
  lang          text NOT NULL DEFAULT 'he' CHECK (lang IN ('he','en')),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  featured      boolean NOT NULL DEFAULT false,
  source        text DEFAULT 'admin-link',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_email  ON testimonials(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);

-- RLS: locked down. Service role (Edge Function) inserts; admin (authenticated) reads/updates.
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admin) — full access
CREATE POLICY "admin full access on testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No anon policies — anonymous clients cannot insert/select.
-- All public submissions go through the submit-testimonial Edge Function
-- which uses the service role key and bypasses RLS.
