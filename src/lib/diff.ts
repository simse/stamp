import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';
import { gzip } from 'node-gzip';

const exec = promisify(execCallback);

export type Diff = {
  diff: string;
  encodedDiff: string;
};

export const generateDiff = async (repo: string): Promise<Diff> => {
  const diff = await getGitDiff(repo);

  if (diff === '') {
    throw new Error('repo is clean, diff is empty');
  }

  const encodedDiff = await compressDiff(diff);

  return {
    diff,
    encodedDiff
  };
};

export const getGitDiff = async (repo: string): Promise<string> => {
  const { stdout: diff } = await exec(`git -C ${repo} --no-pager diff --minimal`);

  return diff;
};

export const compressDiff = async (diff: string): Promise<string> => {
  const compressedDiff = await gzip(diff);

  return compressedDiff.toString('base64');
};

export const applyDiff = async (repo: string, applyCmd: string) => {
  await exec(applyCmd, {
    cwd: repo,
  });
};
