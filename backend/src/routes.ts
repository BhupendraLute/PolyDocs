import { Router } from 'express';
import { triggerScan } from './controllers/scanController';
import { getDocs } from './controllers/docsController';

const router = Router();

router.post('/scan', triggerScan);
router.get('/docs', getDocs);

export default router;
