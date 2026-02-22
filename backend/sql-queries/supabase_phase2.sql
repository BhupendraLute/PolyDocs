-- Run this in your Supabase SQL Editor to prepare for PolyDocs Phase 2

CREATE TABLE repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  installation_id BIGINT NOT NULL,
  repo_id BIGINT NOT NULL,
  repo_full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, repo_id)
);

-- Note: We are not enforcing RLS (Row Level Security) yet for simplicity in early phases.
