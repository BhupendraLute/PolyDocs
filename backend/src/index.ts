import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startWebhookForwarder } from './services/webhookForwarder';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import routes from './routes';
import githubAuth from './auth/github';
import githubWebhooks from './webhooks/github';
import { errorHandler } from './middleware/errorHandler';

app.use(cors());

// Custom JSON parser to keep raw body for webhook signature verification
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use('/api', routes);
app.use('/api/auth/github', githubAuth);
app.use('/api/webhooks/github', githubWebhooks);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
  const serverUrl = process.env.BACKEND_URL || `http://localhost:${port}`;
  console.log(`Backend server running on ${serverUrl}`);

  // Start Smee webhook forwarder if in development and a Smee URL is provided
  if (process.env.NODE_ENV !== 'production' && process.env.SMEE_URL) {
    startWebhookForwarder();
  }
});
