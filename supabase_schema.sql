-- Create the scans table
create table if not exists public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.scans enable row level security;

-- Policy: Users can only see their own scans
create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own scans
create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own scans
create policy "Users can delete their own scans"
  on public.scans for delete
  using (auth.uid() = user_id);
