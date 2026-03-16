CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  excerpt TEXT,
  body TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (status, date DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_posts_public_read ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY blog_posts_service ON blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY blog_posts_auth_all ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
