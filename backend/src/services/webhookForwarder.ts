import SmeeClient from 'smee-client';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Initializes the webhook forwarder for local development.
 * This listens to your public smee.io URL and proxies requests to your local Express server.
 */
export function startWebhookForwarder() {
  const smeeUrl = 'https://smee.io/M5THTqKjY8hYhA'; // You can replace this with env var if needed, or leave hardcoded for dev. Let's make it configurable:
  // Using an env var is better. Assuming GITHUB_WEBHOOK_URL or hardcode for now.
  // Actually, wait, it's better if it's configurable but falling back to some default.
  // We'll require the user to set their SMEE url.

  // Wait, the user didn't set a SMEE URL in .env, they just pasted it into GitHub.
  // Let's read from env or expect a generic one. We'll add SMEE_URL to env.
  const sourceUrl = process.env.SMEE_URL || 'https://smee.io/your_unique_smee_id';
  const targetUrl = `http://localhost:${process.env.PORT || 3001}/api/webhooks/github`;

  console.log(`\n[Smee Client] Starting webhook proxy from ${sourceUrl} to ${targetUrl}`);

  const smee = new SmeeClient({
    source: sourceUrl,
    target: targetUrl,
    logger: console,
  });

  const events = smee.start();

  // Return the stop function if we need to close it later
  return events;
}
