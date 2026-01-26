# USER_FLOW

## Overview
The ResuMatch Zero application now enforces an **authenticated flow** for accessing the ATS scanner. Users must first **sign up** or **sign in** before they can reach the protected `/scanner` page.

## Flow Steps
1. **Landing Page (`/`)**
   - Displays hero section with **Get Started** (links to `/signup`) and **Sign In** (links to `/login`).
   - No scanner functionality is exposed here.
2. **Sign Up (`/signup`)**
   - New users provide email and password.
   - On successful sign‑up, Supabase creates the account and sends a magic‑link verification email.
   - The UI redirects the user to **Login** (`/login`).
3. **Sign In (`/login`)**
   - Existing users enter credentials.
   - On successful authentication, Supabase returns a session and the user is **redirected to `/scanner`**.
4. **Protected Scanner (`/scanner`)**
   - Middleware (`src/middleware.ts`) checks for a valid Supabase session.
   - If the user is **not authenticated**, they are redirected back to **Login** with a `next` query parameter preserving the original destination.
   - Authenticated users see the original `ScannerSection` component (resume upload, analysis, etc.).
5. **Logout (optional)**
   - Not yet implemented in the UI, but can be added by calling `supabase.auth.signOut()` and redirecting to `/`.

## Technical Details
- **Supabase Client**: `@/utils/supabase/client.ts` (browser) and `@/utils/supabase/server.ts` (server) are used for auth operations.
- **Middleware**: `src/middleware.ts` protects the `/scanner` route using `createServerClient` and redirects unauthenticated requests.
- **Redirect Logic**: After login, `router.push('/scanner')` is used. The middleware also forwards a `next` query param when redirecting to `/login` so the UI can return the user to the originally requested page after successful sign‑in.

---

*This document serves as a reference for developers and QA to understand the required authentication flow and the protected scanner access.*
