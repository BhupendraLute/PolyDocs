import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/builds
// Fetches the most recent documentation builds for the authenticated user's repositories
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // We join the builds table with the repositories table to only fetch builds
    // for repositories that belong to the current user.
    // Supabase JS allows joining through foreign keys.
    const { data: builds, error } = await supabase
      .from('builds')
      .select(
        `
        *,
        repositories!inner(
          repo_full_name,
          user_id
        )
      `
      )
      .eq('repositories.user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Database Error fetching builds:', error);
      throw error;
    }

    res.json({ builds });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch build history' });
  }
});

export default router;
