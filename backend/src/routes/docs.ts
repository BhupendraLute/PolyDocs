import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/docs/:repositoryId
// Returns the documentation generated for a specific GitHub repository, ordered by latest.
router.get('/:repositoryId', requireAuth, async (req, res) => {
  const { repositoryId } = req.params;

  try {
    const { data: docs, error } = await supabase
      .from('documents')
      .select('*')
      .eq('repository_id', repositoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching docs:', error);
      return res.status(500).json({ error: 'Failed to fetch documentation' });
    }

    return res.json({ documents: docs });
  } catch (error) {
    console.error('Error in GET /api/docs/:repositoryId:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
