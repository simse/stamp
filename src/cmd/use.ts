import { oraPromise } from 'ora';
import { confirm } from '@inquirer/prompts';

import { checkRequirements } from "../lib/precheck";
import { getDiffFromPullRequest } from '../lib/github';
import { applyDiff, colorizeGitDiff } from '../lib/diff';
import { isRepoDirty } from '../lib/repo';

export type IUseCmdArgs = {
  cwd: string;
}

export const useCommand = async (args: IUseCmdArgs) => {
  console.log("stamp - PR patch helper");

  checkRequirements().catch((err: Error) => {
    console.log(err.message);

    process.exit(1);
  });

  // check if repo is dirty
  const repoDirty = await isRepoDirty(args.cwd);
  if (repoDirty) {
    console.error("can't apply patch because there are uncommitted changes on this branch")
    console.log("reset branch with: git reset --hard HEAD")

    process.exit(1)
  }

  const diff = await oraPromise(getDiffFromPullRequest(args.cwd), {
    successText: ' got stamp from PR',
    failText: ' could not get stamp from PR, is there one attached?',
    text: ' getting stamp from PR...',
  })

  console.log()
  colorizeGitDiff(diff.patch);

  const shouldApply = await confirm({ message: 'Do you want to apply this patch?' });

  if (!shouldApply) {
    console.log("not applying patch, bye!")
    return;
  }

  await oraPromise(applyDiff(args.cwd, diff.applyCmd), {
    successText: ' applied patch from PR',
    failText: ' could not apply patch',
    text: ' applying patch from PR...'
  });
};
