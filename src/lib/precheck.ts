import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';

const exec = promisify(execCallback);

export const checkRequirements = async () => {
  // check tools
  await checkCommandInstalled("git", "you need git to create and apply patches");
  await checkCommandInstalled("gh", "install the github CLI with: brew install gh");
  await checkGhAuth();
}

export const checkCommandInstalled = async (cmd: string, errorText: string) => {
  try {
    await exec(`which ${cmd}`)
  } catch (_: unknown) {
    throw new Error(`${cmd} not found: ${errorText}`)
  }
}

export const checkGhAuth = async () => {
  try {
    await exec("gh auth status");
  } catch (_: unknown) {
    throw new Error("you must authenticate the Github CLI with: gh auth login")
  }
}
