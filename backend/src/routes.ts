import { Router } from 'express';
import githubAuth from './auth/github';
import githubApp from './github/app';
import buildsRoutes from './routes/builds';
import docsRoutes from './routes/docs';

const router = Router();

// Routes will be added here
router.use('/auth/github', githubAuth);
router.use('/github', githubApp);
router.use('/builds', buildsRoutes);
router.use('/docs', docsRoutes);

export default router;
