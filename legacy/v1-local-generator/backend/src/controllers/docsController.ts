import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getDocs = async (req: Request, res: Response) => {
  try {
    const { commitHash } = req.query;

    let query = supabase.from('documents').select('*').order('created_at', { ascending: false });

    if (commitHash) {
      query = query.eq('commit_hash', commitHash);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch docs:', error);
    res.status(500).json({ error: 'Failed to fetch documentation' });
  }
};
