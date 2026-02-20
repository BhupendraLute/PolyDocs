import path from 'path';
import fs from 'fs-extra';
import { GitFileChange } from '../types';
import { LingoService } from '../lib/lingo';

export class CompilerService {
  private lingoService: LingoService;
  private docsRoot: string;

  constructor() {
    this.lingoService = new LingoService();
    // Assuming backend is running from backend/ directory
    // We go up one level to reach the monorepo root
    const monorepoRoot = path.resolve(process.cwd(), '..');
    this.docsRoot = path.join(monorepoRoot, 'docs');
  }

  async compile(files: GitFileChange[], commitHash: string): Promise<string[]> {
    const generatedDocs: string[] = [];
    const commitDocsPath = path.join(this.docsRoot, commitHash, 'en');

    // We assume the process is running in 'backend/', so we need to go up one level
    const monorepoRoot = path.resolve(process.cwd(), '..');

    // Ensure the target directory exists
    await fs.ensureDir(commitDocsPath);

    for (const file of files) {
      if (file.status === 'D') {
        // Handle deletions if necessary (e.g., mark doc as deprecated or delete it)
        continue;
      }

      // We only process 'A' (Added) and 'M' (Modified) for now
      // And we should probably filter for source files again or rely on the scanner's filter
      // For now, we trust the input files are relevant.

      try {
        // file.path is relative to monorepo root (e.g., "backend/src/index.ts")
        const sourceFilePath = path.join(monorepoRoot, file.path);

        // Check if file exists before reading (it might have been deleted but status is weird, or we are in a state where file is missing)
        if (!(await fs.pathExists(sourceFilePath))) {
          console.warn(`Source file not found: ${sourceFilePath}`);
          continue;
        }

        const fileContent = await fs.readFile(sourceFilePath, 'utf-8');
        const documentation = await this.lingoService.generate(file.path, fileContent);

        // Construct the output path. We mirror the source structure.
        // e.g. backend/src/index.ts -> docs/<hash>/en/backend/src/index.md
        const relativePath = file.path;
        const relativeDir = path.dirname(relativePath);
        const fileName = path.basename(relativePath, path.extname(relativePath)) + '.md';

        const targetDir = path.join(commitDocsPath, relativeDir);
        const targetFile = path.join(targetDir, fileName);

        await fs.ensureDir(targetDir);
        await fs.writeFile(targetFile, documentation);

        generatedDocs.push(targetFile);
      } catch (error) {
        console.error(`Failed to generate docs for ${file.path}:`, error);
      }
    }

    return generatedDocs;
  }
}
