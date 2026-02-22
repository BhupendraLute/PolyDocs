-- Run this in your Supabase SQL Editor to prepare for PolyDocs Phase 3

CREATE TABLE builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repository_id BIGINT NOT NULL, -- Logical link to repositories(repo_id), could be made a strict foreign key
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'building', 'success', 'failed'
  commit_sha TEXT NOT NULL,
  author_name TEXT,
  commit_message TEXT,
  branch TEXT NOT NULL,
  logs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: In a production schema we might link this more strictly `REFERENCES repositories(repo_id)`
-- but for simplicity across users we leave it as identical BIGINT type.
