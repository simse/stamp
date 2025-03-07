import ora from 'ora';

import { checkRequirements } from '../lib/precheck';
import { generateDiff } from '../lib/diff';
import { updatePullRequest } from '../lib/github';

export type ICaptureCmdArgs = {
  cwd: string;
}

export const captureCommand = async (args: ICaptureCmdArgs) => {
  console.log("stamp - PR patch helper");

  await checkRequirements().catch((err: Error) => {
    console.log(err.message);

    process.exit(1);
  });

  // create diff
  const genDiffSpinner = ora({ text: 'creating git patch...' }).start();

  const diff = await generateDiff(args.cwd).catch((err: Error) => {
    genDiffSpinner.fail(err.message);

    process.exit(1);
  });

  genDiffSpinner.succeed(" created git patch successfully!");

  // update pull request
  const updatePrSpinner = ora({ text: 'updating PR description...' }).start();
  await updatePullRequest(args.cwd, diff).catch((err: Error) => {
    updatePrSpinner.fail(err.message);

    process.exit(1);
  });

  updatePrSpinner.succeed(" updated PR successfully");
}
