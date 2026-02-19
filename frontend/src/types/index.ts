export interface GitFileChange {
  path: string;
  status: 'A' | 'M' | 'D' | 'R' | 'C' | 'U' | '?';
}

export interface ScanResult {
  commitHash: string;
  timestamp: string;
  files: GitFileChange[];
  stats: {
    total: number;
    added: number;
    modified: number;
    deleted: number;
  };
  compiled?: boolean;
}
