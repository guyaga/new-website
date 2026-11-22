-- Deep survey responses for the 10 Days, 10 Skills course.
-- Internal-only. Submitted via the submit-survey Edge Function (service role).

CREATE TABLE IF NOT EXISTS course_survey_responses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id           int REFERENCES course_members(id) ON DELETE SET NULL,
  name                text NOT NULL,
  email               text NOT NULL,

  -- Question 1: NPS (0-10)
  nps                 int CHECK (nps BETWEEN 0 AND 10),

  -- Question 2: Overall rating (1-5)
  overall_rating      int CHECK (overall_rating BETWEEN 1 AND 5),

  -- Question 3: Top 3 most useful skills (array of day numbers 1-10)
  top_useful_days     int[] DEFAULT '{}',

  -- Question 4: Skill that needs more depth (single day number 1-10)
  needs_depth_day     int CHECK (needs_depth_day BETWEEN 1 AND 10),

  -- Question 5: What did you build?
  what_built          text,

  -- Question 6: Time saved per week (bucket)
  weekly_time_saved   text CHECK (weekly_time_saved IN ('lt1','1to3','3to10','10plus')),

  -- Question 7: Topic for advanced course
  next_topic          text,

  -- Question 8: Anything else
  additional_comments text,

  lang                text NOT NULL DEFAULT 'he' CHECK (lang IN ('he','en')),
  source              text DEFAULT 'admin-link',
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON course_survey_responses(email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created ON course_survey_responses(created_at DESC);

-- RLS: locked down. Service role inserts; admin reads.
ALTER TABLE course_survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin full access on survey responses"
  ON course_survey_responses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
