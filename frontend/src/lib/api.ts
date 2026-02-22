import type { ScanResult } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  triggerScan: async (compile: boolean = false): Promise<ScanResult> => {
    const response = await fetch(`${API_BASE_URL}/scan?compile=${compile}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Scan failed: ${response.statusText}`);
    }

    return response.json();
  },
  getDocs: async (repoId: string | number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/docs/${repoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch docs');
    return response.json();
  },
};
