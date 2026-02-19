import { GitService } from './git';
import { ScanResult, GitFileChange } from '../types';

export class ScannerService {
  private gitService: GitService;

  constructor() {
    this.gitService = new GitService();
  }

  private isRelevantFile(path: string): boolean {
    const relevantExtensions = ['.ts', '.tsx', '.md', '.json', '.yml', '.yaml'];
    const ignoredPaths = ['node_modules', 'dist', '.git', 'package-lock.json'];

    // Check extension
    const hasRelevantExtension = relevantExtensions.some((ext) => path.endsWith(ext));

    // Check ignored paths
    const isIgnored = ignoredPaths.some((ignored) => path.includes(ignored));

    return hasRelevantExtension && !isIgnored;
  }

  async scan(): Promise<ScanResult> {
    const commitHash = await this.gitService.getCurrentCommit();
    const allChanges = await this.gitService.getStatus();

    const relevantChanges = allChanges.filter((change) => this.isRelevantFile(change.path));

    const stats = {
      total: relevantChanges.length,
      added: relevantChanges.filter((c) => c.status === 'A' || c.status === '?').length,
      modified: relevantChanges.filter((c) => c.status === 'M').length,
      deleted: relevantChanges.filter((c) => c.status === 'D').length,
    };

    return {
      commitHash,
      timestamp: new Date().toISOString(),
      files: relevantChanges,
      stats,
    };
  }
}
