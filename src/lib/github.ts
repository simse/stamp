import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';
import type { Diff } from './diff';

const exec = promisify(execCallback);

export const STAMP_START = '<!-- stamp start -->';
export const STAMP_END = '<!-- stamp end -->';

export const getPullRequestDesc = async (repo: string): Promise<string> => {
  const { stdout: ghOutput } = await exec("gh pr view --json body", {
    cwd: repo,
  })

  // check if there is a PR open
  if (ghOutput.includes('no pull requests found for branch')) {
    throw new Error(`no PR open for checked out branch: ${ghOutput}`)
  }

  //console.log(ghOutput);

  return JSON.parse(ghOutput)['body'];
};

export const updatePullRequest = async (repo: string, diff: Diff) => {
  const currentDesc = await getPullRequestDesc(repo);

  const scrubbedDesc = scrubStamp(currentDesc);
  const stampedDesc = scrubbedDesc + '\n' + createStamp(diff);

  const encodedDesc = Buffer.from(stampedDesc).toString('base64');

  // update PR description
  try {
    await exec(`echo '${encodedDesc}' | base64 --decode | gh pr edit --body-file -`, {
      cwd: repo,
    });
  } catch (e: unknown) {
    throw new Error('Github threw an error while updating the PR description: ' + e)
  }
};

export const getDiffFromPullRequest = async (repo: string) => {
  const desc = await getPullRequestDesc(repo);

  return getDiffFromStamp(desc);
};

export const getDiffFromStamp = (stamp: string): {
  patch: string;
  applyCmd: string;
} => {
  const diffRegex = /```diff\n([\s\S]*?)```(?![\s\S]*```diff)/;
  const bashCommandRegex = /```bash\n([\s\S]*?)```/;

  const diffMatch = stamp.match(diffRegex);
  const bashMatch = stamp.match(bashCommandRegex);

  if (diffMatch && diffMatch[1] && bashMatch && bashMatch[1]) {
    return {
      patch: diffMatch[1],
      applyCmd: bashMatch[1].trim()
    }
  }

  throw new Error("could not find patch in stamp")
};

export const createStamp = (diff: Diff) => {
  return [
    STAMP_START,
    '---',
    '<details>',
    '<summary>✨This PR is <strong>stamped</strong> with a patch✨</summary>',
    '<h3>Apply this patch with <code>npx @simse/stamp use</code>:</h3>',
    '',
    '```diff',
    diff.diff,
    '```',
    '',
    'or you can run this command:',
    '```bash',
    `echo '${diff.encodedDiff}' | base64 --decode | gunzip | git apply`,
    '```',
    'Stamps provide PR authors a way share additional code changes that should not be merged, but may help with testing.',
    '</details>',
    STAMP_END
  ].join('\n')
};

export const scrubStamp = (desc: string): string => {
  // find stamp range
  const stampStart = desc.indexOf(STAMP_START);
  const stampEnd = desc.indexOf(STAMP_END) + STAMP_END.length;

  if (stampStart === -1 || stampEnd === -1) return desc;

  const scrubbedDesc = desc.slice(0, stampStart) + desc.slice(stampEnd);

  return scrubbedDesc.trimEnd();
};
