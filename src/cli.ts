#!/usr/bin/env node

import { Clerc } from "clerc";
import { notFoundPlugin } from "@clerc/plugin-not-found";
import { helpPlugin } from "@clerc/plugin-help";

import { version } from '../package.json';

import { captureCommand } from './cmd/capture';
import { useCommand } from './cmd/use';

Clerc.create(
  "stamp",
  "A Git tool that embeds test patches directly in PR descriptions for quick sharing and application.",
  version || process.env.npm_package_version || 'unknown'
)
  .use(notFoundPlugin())
  .use(helpPlugin())
  .command("create", "Creates a patch from current changes and adds it to the PR description")
  .on("create", async (_ctx) => {
    await captureCommand({
      cwd: process.cwd(),
    })
  })
  .command("use", "Applies a patch found in the current PR's description to your working directory")
  .on("use", async (_ctx) => {
    await useCommand({
      cwd: process.cwd()
    })
  })
  .parse();
