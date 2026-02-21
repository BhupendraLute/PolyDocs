import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { supabase } from '../lib/supabase';

const router = Router();

// Middleware to strictly verify the payload using GitHub's Webhook Secret
const verifyGitHubSignature = (req: any, res: Response, next: NextFunction) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing GITHUB_WEBHOOK_SECRET in environment variables');
    return res.status(500).json({ error: 'Webhook secret not configured on server' });
  }

  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  if (!req.rawBody) {
    return res.status(500).json({ error: 'Internal error: req.rawBody is missing' });
  }

  // Calculate HMAC using the raw body and the secret
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = `sha256=${hmac.update(req.rawBody).digest('hex')}`;

  // Use crypto.timingSafeEqual to prevent timing attacks
  try {
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (
      signatureBuffer.length !== digestBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, digestBuffer)
    ) {
      console.warn('Webhook signature mismatch!');
      return res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid signature format' });
  }

  next();
};

// Webhook payload endpoint
// POST /api/webhooks/github
router.post('/', verifyGitHubSignature, async (req: Request, res: Response) => {
  const eventName = req.headers['x-github-event'] as string;
  const payload = req.body;

  // We only care about push events for initiating documentation builds
  if (eventName === 'push') {
    const repositoryId = payload.repository.id;
    const branch = payload.ref.replace('refs/heads/', '');
    const defaultBranch = payload.repository.default_branch;
    const commitSha = payload.after; // Head commit after the push
    const headCommit = payload.head_commit;

    console.log(`Received push event for repo: ${payload.repository.full_name}, branch: ${branch}`);

    // Optionally filtering to only build on the default branch
    if (branch === defaultBranch && headCommit) {
      try {
        console.log(`Creating new build record for commit ${commitSha}`);

        // Insert into our builds table
        const { error: dbError } = await supabase.from('builds').insert({
          repository_id: repositoryId,
          status: 'pending',
          commit_sha: commitSha,
          author_name: headCommit.author.name,
          commit_message: headCommit.message,
          branch: branch,
        });

        if (dbError) throw dbError;

        // Phase 4: Here we would trigger the actual compiler worker process.
        console.log(`Build successfully queued in database for repo ${repositoryId}.`);
      } catch (err: any) {
        console.error('Failed to insert build record:', err.message);
        return res.status(500).json({ error: 'Failed to process webhook' });
      }
    } else {
      console.log(`Ignored push on non-default branch: ${branch}`);
    }
  }

  // Always respond 200 to GitHub if the signature was valid, even if we ignored the event
  res.status(200).send('Webhook processed');
});

export default router;
