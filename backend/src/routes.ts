import { Router } from 'express';
import { triggerScan } from './controllers/scanController';

const router = Router();

router.post('/scan', triggerScan);

export default router;
