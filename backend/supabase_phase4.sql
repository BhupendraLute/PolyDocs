-- Run this in your Supabase SQL Editor to prepare for PolyDocs Phase 4

-- Add a column to store the generated Pull Request URL
ALTER TABLE builds ADD COLUMN IF NOT EXISTS pr_url TEXT;

-- Optional: You can also reload the schema cache
NOTIFY pgrst, 'reload schema';
