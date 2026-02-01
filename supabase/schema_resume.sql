// =============================================================
// RESUMATCH ZERO - Resume Builder Schema v1.0
// Date: 2026-02-01
// Description: Tables for resume builder feature with RLS
// =============================================================

-- ============================================================
-- RESUMES TABLE (Core Resume Data)
-- ============================================================
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Resume metadata
  title TEXT DEFAULT 'Untitled Resume' NOT NULL,
  
  -- Header section
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  links JSONB DEFAULT '[]'::jsonb, -- Array of { label, url }
  
  -- Summary section
  summary TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_resumes_updated_at ON public.resumes(updated_at DESC);

-- ============================================================
-- RESUME_SKILLS TABLE
-- ============================================================
CREATE TABLE public.resume_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- e.g., "Technical Skills", "Languages"
  items TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of skill strings
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_resume_skills_resume_id ON public.resume_skills(resume_id);

-- ============================================================
-- RESUME_EXPERIENCES TABLE
-- ============================================================
CREATE TABLE public.resume_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date TEXT, -- Format: "Jan 2023" or "2023"
  end_date TEXT,   -- Format: "Present" or "Dec 2024"
  bullets TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_resume_experiences_resume_id ON public.resume_experiences(resume_id);

-- ============================================================
-- RESUME_EDUCATION TABLE
-- ============================================================
CREATE TABLE public.resume_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  date_range TEXT, -- e.g., "2019 - 2023"
  gpa TEXT,
  notes TEXT, -- Honors, distinctions
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_resume_education_resume_id ON public.resume_education(resume_id);

-- ============================================================
-- RESUME_PROJECTS TABLE
-- ============================================================
CREATE TABLE public.resume_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_range TEXT,
  bullets TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_resume_projects_resume_id ON public.resume_projects(resume_id);

-- ============================================================
-- RESUME_CERTIFICATIONS TABLE
-- ============================================================
CREATE TABLE public.resume_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_resume_certifications_resume_id ON public.resume_certifications(resume_id);

-- ============================================================
-- RESUME_AWARDS TABLE
-- ============================================================
CREATE TABLE public.resume_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_resume_awards_resume_id ON public.resume_awards(resume_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_awards ENABLE ROW LEVEL SECURITY;

-- RESUMES POLICIES
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- CHILD TABLE POLICIES (via resume ownership)
-- Skills
CREATE POLICY "Users can manage own resume skills"
  ON public.resume_skills FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE id = resume_skills.resume_id AND user_id = auth.uid()
  ));

-- Experiences
CREATE POLICY "Users can manage own resume experiences"
  ON public.resume_experiences FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE id = resume_experiences.resume_id AND user_id = auth.uid()
  ));

-- Education
CREATE POLICY "Users can manage own resume education"
  ON public.resume_education FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE id = resume_education.resume_id AND user_id = auth.uid()
  ));

-- Projects
CREATE POLICY "Users can manage own resume projects"
  ON public.resume_projects FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE id = resume_projects.resume_id AND user_id = auth.uid()
  ));

-- Certifications
CREATE POLICY "Users can manage own resume certifications"
  ON public.resume_certifications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE id = resume_certifications.resume_id AND user_id = auth.uid()
  ));

-- Awards
CREATE POLICY "Users can manage own resume awards"
  ON public.resume_awards FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE id = resume_awards.resume_id AND user_id = auth.uid()
  ));

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_experiences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_education TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_certifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_awards TO authenticated;

-- ============================================================
-- AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_resume_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resume_timestamp();
