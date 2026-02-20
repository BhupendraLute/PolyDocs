import { Router } from 'express';
<<<<<<< HEAD

const router = Router();

// Routes will be added here
=======
import { triggerScan } from './controllers/scanController';
import { getDocs } from './controllers/docsController';

const router = Router();

router.post('/scan', triggerScan);
router.get('/docs', getDocs);
>>>>>>> main

export default router;
