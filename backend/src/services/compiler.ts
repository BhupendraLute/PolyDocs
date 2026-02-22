import { getGitHubApp } from '../github/app';
import { supabase } from '../lib/supabase';
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import { LingoDotDevEngine } from '@lingo.dev/_sdk';

/**
 * Executes the heavy documentation compilation job asynchronously.
 * Orchestrates GitHub file fetching, Lingo API generation, and Pull Request creation.
 *
 * @param buildId The UUID of the build record in Supabase
 * @param installationId The GitHub App Installation ID to act on behalf of
 * @param repositoryFullName The full name of the repository (e.g. "user/repo")
 * @param branch The branch that triggered this build
 */
export async function runCompilerJob(
  buildId: string,
  installationId: number,
  repositoryFullName: string,
  branch: string
) {
  try {
    console.log(`[Compiler Job] Starting job for build ${buildId} on ${repositoryFullName}`);

    // 1. Mark build as running
    await supabase.from('builds').update({ status: 'building' }).eq('id', buildId);

    const app = getGitHubApp();

    // 2. Fetch Installation Access Token
    // We injected Octokit into the App, so this returns a full REST client at runtime.
    const octokit = (await app.getInstallationOctokit(installationId)) as Octokit;

    const [owner, repo] = repositoryFullName.split('/');

    // --- PHASE 4 IMPLEMENTATION ---

    console.log(`[Compiler Job] Fetching files for ${owner}/${repo} on branch ${branch}...`);

    // 3. Get the latest commit SHA of the base branch
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const baseCommitSha = refData.object.sha;

    // 4. Get the tree of the base commit
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: baseCommitSha,
      recursive: '1',
    });

    // 5. Filter for code files (e.g., .ts, .js, .md) and exclude node_modules
    const codeFiles = treeData.tree
      .filter((file: any) => {
        if (file.type !== 'blob' || !file.path) return false;
        if (file.path.includes('node_modules') || file.path.includes('dist')) return false;
        return file.path.endsWith('.ts') || file.path.endsWith('.js') || file.path.endsWith('.md');
      })
      .slice(0, 10); // Limit to top 10 files to keep Lingo prompt small

    let aggregatedCode = '';

    for (const file of codeFiles) {
      if (!file.sha) continue;
      const { data: blobData } = await octokit.git.getBlob({
        owner,
        repo,
        file_sha: file.sha,
      });
      const fileContent = Buffer.from(blobData.content, 'base64').toString('utf-8');
      aggregatedCode += `\n\n--- ${file.path} ---\n\`\`\`\n${fileContent}\n\`\`\`\n`;
    }

    console.log(`[Compiler Job] Aggregated ${codeFiles.length} files. Requesting Gemini API...`);

    // 6. Call Gemini API for initial English Documentation Generation
    const prompt = `
You are an expert technical writer. Based on the following codebase files, write a comprehensive and beautiful README/Documentation markdown file. Keep it professional.

Codebase context:
${aggregatedCode}

Output ONLY the markdown content, no conversational filler.
    `;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        timeout: 60000, // allow 60 seconds for generation
      }
    );

    const generatedDoc = geminiResponse.data.candidates[0].content.parts[0].text;

    console.log(
      `[Compiler Job] Generated ${generatedDoc.length} characters of documentation. Running Lingo CLI localization...`
    );

    // --- PHASE 5: RUN LINGO DOT DEV ENGINE NATIVELY ---
    console.log(`[Compiler Job] Initializing LingoDotDevEngine for local translations...`);

    if (!process.env.LINGO_API_KEY) {
      throw new Error('LINGO_API_KEY is not configured in the environment.');
    }

    const lingoEngine = new LingoDotDevEngine({
      apiKey: process.env.LINGO_API_KEY,
    });

    const targetLocales = ['es', 'fr', 'ja'] as any;
    console.log(`[Compiler Job] Translating documentation into: ${targetLocales.join(', ')}...`);

    // Natively translate the markdown string to all target locales in parallel
    const localizedMdStrings = await lingoEngine.batchLocalizeText(generatedDoc, {
      sourceLocale: 'en',
      targetLocales: targetLocales,
    });

    console.log(`[Compiler Job] Lingo localization complete! Constructing GitHub payload...`);

    // 1. Build base English Blob
    const { data: baseBlob } = await octokit.git.createBlob({
      owner,
      repo,
      content: generatedDoc,
      encoding: 'utf-8',
    });

    const treeNodes = [
      {
        path: 'POLYDOCS.md',
        mode: '100644' as const,
        type: 'blob' as const,
        sha: baseBlob.sha,
      },
    ];

    // 2. Build translated Blobs
    for (let i = 0; i < targetLocales.length; i++) {
      const locale = targetLocales[i];
      const translatedMd = localizedMdStrings[i];

      const { data: localeBlob } = await octokit.git.createBlob({
        owner,
        repo,
        content: translatedMd,
        encoding: 'utf-8',
      });

      treeNodes.push({
        path: `POLYDOCS.${locale}.md`,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: localeBlob.sha,
      });
    }

    // 3. Create a new tree containing ALL docs
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseCommitSha,
      tree: treeNodes,
    });

    // 8. Create a commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: 'docs: auto-generate POLYDOCS.md via PolyDocs webhook',
      tree: newTree.sha,
      parents: [baseCommitSha],
    });

    // 9. Create a new branch reference
    const newBranchName = `polydocs-update-${Date.now()}`;

    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: newCommit.sha,
    });

    console.log(`[Compiler Job] Opening Pull Request from ${newBranchName}...`);

    // 11. Create Pull Request
    const { data: pullRequest } = await octokit.pulls.create({
      owner,
      repo,
      title: 'Automated Documentation Update (PolyDocs)',
      body: 'This PR was automatically generated by PolyDocs in response to your recent pushes. It contains localized translations of the `POLYDOCS.md` file.',
      head: newBranchName,
      base: branch,
    });

    // 12. Mark build as success
    await supabase
      .from('builds')
      .update({
        status: 'success',
        pr_url: pullRequest.html_url,
        logs: 'Documentation generated and localized PR created successfully.',
      })
      .eq('id', buildId);

    console.log(`[Compiler Job] Finished successfully. PR: ${pullRequest.html_url}`);
  } catch (error: any) {
    console.error(`[Compiler Job] Failed for build ${buildId}:`, error);

    // Mark build as failed
    await supabase
      .from('builds')
      .update({
        status: 'failed',
        logs: error.message || 'An unknown error occurred during compilation.',
      })
      .eq('id', buildId);
  }
}
