import { Router } from 'express';
import githubAuth from './auth/github';
import githubApp from './github/app';
import buildsRoutes from './routes/builds';

const router = Router();

// Routes will be added here
router.use('/auth/github', githubAuth);
router.use('/github', githubApp);
router.use('/builds', buildsRoutes);

export default router;
