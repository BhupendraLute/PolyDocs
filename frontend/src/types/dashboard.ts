export interface Repository {
  id: number;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
}

export interface Build {
  id: string;
  repository_id: number;
  commit_sha: string;
  commit_message: string | null;
  status: 'pending' | 'building' | 'success' | 'failed';
  created_at: string;
  pr_url?: string;
  repositories?: {
    repo_full_name: string;
  };
}

export interface DashboardContextType {
  repositories: Repository[];
  builds: Build[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  handleInstallApp: () => void;
}
