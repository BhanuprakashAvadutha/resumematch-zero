-- ============================================================
-- RESUMATCH ZERO - Enterprise Database Schema v1.0
-- Date: 2026-01-25
-- Description: Production-ready schema with RLS and automation
-- ============================================================

-- ============================================================
-- STEP 1: CLEANUP - Drop existing objects
-- ============================================================
DROP TABLE IF EXISTS public.scans CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- ============================================================
-- STEP 2: PROFILES TABLE (User Data Hub)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 10 NOT NULL,
  tier TEXT DEFAULT 'free' NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================
-- STEP 3: AUTOMATION - Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Fire on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STEP 4: SCANS TABLE (The Data Fortress)
-- ============================================================
CREATE TABLE public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Resume Metadata
  resume_filename TEXT,
  resume_size_bytes INTEGER,
  
  -- Job Data
  job_description_snippet TEXT, -- First 100 chars
  
  -- Analysis Results
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  processing_method TEXT DEFAULT 'logic-engine-v1' NOT NULL,
  
  -- Keywords (Stored as JSONB for flexibility)
  missing_keywords JSONB DEFAULT '[]'::jsonb,
  matched_keywords JSONB DEFAULT '[]'::jsonb,
  
  -- Feedback
  feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for faster user lookups and ordering
CREATE INDEX idx_scans_user_id ON public.scans(user_id);
CREATE INDEX idx_scans_created_at ON public.scans(created_at DESC);

-- ============================================================
-- STEP 5: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SCANS POLICIES
-- Users can view their own scans
CREATE POLICY "Users can view own scans"
  ON public.scans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own scans
CREATE POLICY "Users can insert own scans"
  ON public.scans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own scans
CREATE POLICY "Users can delete own scans"
  ON public.scans
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.scans TO authenticated;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- Schema created successfully!
-- Tables: profiles, scans
-- Trigger: on_auth_user_created (auto-creates profile)
-- RLS: Enabled on both tables with user-specific policies
