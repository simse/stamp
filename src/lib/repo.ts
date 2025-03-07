import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';

const exec = promisify(execCallback);

export const isRepoDirty = async (repo: string): Promise<boolean> => {
  try {
    await exec("git diff-index --quiet HEAD --", {
      cwd: repo
    })
  } catch (_: unknown) {
    return true
  }

  return false
};
