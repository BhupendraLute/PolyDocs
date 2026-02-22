-- Run this in your Supabase SQL Editor to prepare for PolyDocs Phase 1

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  access_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We are not enforcing RLS (Row Level Security) yet for simplicity in early phases.
