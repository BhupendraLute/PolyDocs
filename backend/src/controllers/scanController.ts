import { Request, Response } from 'express';
import { ScannerService } from '../services/scanner';
import { CompilerService } from '../services/compiler';

const scannerService = new ScannerService();
const compilerService = new CompilerService();

export const triggerScan = async (req: Request, res: Response) => {
  try {
    const { compile } = req.query;
    const result = await scannerService.scan();

    if (compile === 'true') {
      await compilerService.compile(result.files, result.commitHash);
    }

    res.json({
      ...result,
      compiled: compile === 'true',
    });
  } catch (error) {
    console.error('Scan failed:', error);
    res.status(500).json({ error: 'Failed to scan repository' });
  }
};
