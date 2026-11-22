-- Add an optional "improvement" field to testimonials so members can
-- give private feedback alongside their testimonial. Internal-only.

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS improvement text;
