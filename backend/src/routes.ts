import { Router } from 'express';
import githubAuth from './auth/github';
import githubApp from './github/app';

const router = Router();

// Routes will be added here
router.use('/auth/github', githubAuth);
router.use('/github', githubApp);

export default router;
