-- Run this in your Supabase SQL Editor to fix the missing Foreign Key relationship

-- 1. Make repo_id unique so it can be referenced by the builds table
ALTER TABLE repositories DROP CONSTRAINT IF EXISTS repositories_repo_id_key;
ALTER TABLE repositories ADD CONSTRAINT repositories_repo_id_key UNIQUE (repo_id);

-- 2. Add the explicit foreign key to the builds table so the Dashboard can join them
ALTER TABLE builds DROP CONSTRAINT IF EXISTS builds_repository_id_fkey;
ALTER TABLE builds ADD CONSTRAINT builds_repository_id_fkey FOREIGN KEY (repository_id) REFERENCES repositories(repo_id) ON DELETE CASCADE;

-- 3. Reload the schema cache in Supabase PostgREST (Optional, Supabase usually does this automatically but just in case)
NOTIFY pgrst, 'reload schema';
