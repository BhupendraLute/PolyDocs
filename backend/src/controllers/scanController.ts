import { Request, Response } from 'express';
import { ScannerService } from '../services/scanner';

const scannerService = new ScannerService();

export const triggerScan = async (req: Request, res: Response) => {
  try {
    const result = await scannerService.scan();
    res.json(result);
  } catch (error) {
    console.error('Scan failed:', error);
    res.status(500).json({ error: 'Failed to scan repository' });
  }
};
