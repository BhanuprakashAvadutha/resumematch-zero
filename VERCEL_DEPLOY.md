# Vercel Deployment Guide

To deploy ResuMatch Zero to Vercel, you must configure the following Environment Variables in your project settings.

## Required Environment Variables

Go to **Settings** -> **Environment Variables** in your Vercel Project Dashboard and add:

1.  **`NEXT_PUBLIC_SUPABASE_URL`**
    *   *Value*: Your Supabase Project URL (e.g., `https://your-project-id.supabase.co`)
    *   *Where to find*: Supabase Dashboard -> Project Settings -> API

2.  **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
    *   *Value*: Your Supabase Anon Public Key
    *   *Where to find*: Supabase Dashboard -> Project Settings -> API

3.  **`GEMINI_API_KEY`**
    *   *Value*: Your Google Gemini API Key
    *   *Where to find*: Google AI Studio -> Get API key

## Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `.` (default)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
