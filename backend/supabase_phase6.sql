-- Run this in your Supabase SQL Editor to prepare for PolyDocs Phase 6
DROP TABLE IF EXISTS documents CASCADE;

CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repository_id BIGINT NOT NULL, 
  build_id UUID NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
  commit_hash TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  locale TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We store the raw Markdown content natively to skip GitHub cloning overhead during Dashboard reads.

-- Optional: You can reload the schema cache
NOTIFY pgrst, 'reload schema';
