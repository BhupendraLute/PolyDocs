import { Router, Request, Response } from 'express';
import { App } from '@octokit/app';
import { Octokit } from '@octokit/rest';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

// Retrieve GitHub App instance (singleton pattern)
export const getGitHubApp = () => {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error('GITHUB_APP_ID or GITHUB_PRIVATE_KEY is not defined in .env');
  }

  // Ensure the private key is properly formatted with newlines for PEM format.
  // Sometimes .env strips newlines or passes literal \n strings.
  let formattedKey = privateKey;
  if (formattedKey.includes('\\n')) {
    formattedKey = formattedKey.replace(/\\n/g, '\n');
  }

  return new App({
    appId: appId,
    privateKey: formattedKey,
    Octokit: Octokit as any, // Inject REST client so getInstallationOctokit works correctly
  });
};

// GET /api/github/install-url
// Returns the dynamic URL where the user can install the GitHub App
router.get('/install-url', requireAuth, (req: AuthRequest, res: Response) => {
  const appName = process.env.GITHUB_APP_NAME;
  if (!appName) {
    return res.status(500).json({ error: 'GITHUB_APP_NAME is not defined in .env' });
  }

  // GitHub apps are installed per-user or per-org via this standard URL
  const installUrl = `https://github.com/apps/${appName}/installations/new`;
  res.json({ url: installUrl });
});

// GET /api/github/installations
// Fetches the repositories that the current user has granted this App access to
router.get('/installations', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 1. Get user's OAuth access token from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('access_token')
      .eq('id', userId)
      .single();

    if (userError || !userData?.access_token) {
      return res.status(401).json({ error: 'User GitHub token not found. Please log in again.' });
    }

    // 2. Use user's OAuth token to check app installations
    // The user to server API for GitHub Apps: Get app installations accessible to the user access token
    const userOctokit = new Octokit({ auth: userData.access_token });

    // Fetch installations for the user
    const { data: installationsData } =
      await userOctokit.apps.listInstallationsForAuthenticatedUser();

    const repositories: any[] = [];

    // 3. For each installation, fetch the accessible repositories and sync to DB
    for (const installation of installationsData.installations) {
      const { data: reposData } = await userOctokit.apps.listInstallationReposForAuthenticatedUser({
        installation_id: installation.id,
      });

      for (const repo of reposData.repositories) {
        repositories.push({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          installation_id: installation.id,
        });

        // Sync to Supabase `repositories` mapping table
        await supabase.from('repositories').upsert(
          {
            user_id: userId,
            installation_id: installation.id,
            repo_full_name: repo.full_name,
            repo_id: repo.id,
          },
          { onConflict: 'repo_id, user_id' }
        ); // Assuming unique constraint
      }
    }

    res.json({ repositories });
  } catch (error: any) {
    console.error('Error fetching installations:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch GitHub App installations' });
  }
});

export default router;
