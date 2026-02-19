import simpleGit, { SimpleGit, StatusResult } from 'simple-git';
import { GitFileChange } from '../types';
import path from 'path';

export class GitService {
  private git: SimpleGit;

  constructor(repoPath: string = process.cwd()) {
    // Navigate up to the root of the monorepo from backend/
    // Assuming backend is started from backend/ directory or root
    // For safety, we can attempt to find the git root or just use the provided path
    this.git = simpleGit(repoPath);
  }

  async getCurrentCommit(): Promise<string> {
    const log = await this.git.log(['-1']);
    return log.latest?.hash || '';
  }

  async getStatus(): Promise<GitFileChange[]> {
    const status: StatusResult = await this.git.status();

    // Map simple-git status to our GitFileChange interface
    const changes: GitFileChange[] = [];

    status.created.forEach((f) => changes.push({ path: f, status: 'A' }));
    status.modified.forEach((f) => changes.push({ path: f, status: 'M' }));
    status.deleted.forEach((f) => changes.push({ path: f, status: 'D' }));
    status.renamed.forEach((f) => changes.push({ path: f.to, status: 'R' }));
    status.not_added.forEach((f) => changes.push({ path: f, status: '?' }));

    return changes;
  }

  async getDiffFromCommit(commitHash: string): Promise<GitFileChange[]> {
    // Logic to get changed files since a specific commit
    // For now, we'll focus on the current workspace status vs HEAD
    return this.getStatus();
  }
}
