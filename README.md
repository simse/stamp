# stamp

A Git tool that embeds test patches directly in PR descriptions for quick sharing and application.

## Usage
Create and embed patch with:
```bash
npx @simse/stamp create
```

Apply patch from PR with:
```bash
npx @simse/stamp use
```

## Requirements
- Github
- Github CLI
- Git

## Wait what?
While PRs themselves are patches, sometimes you need extra code tweaks just for testing. `stamp` embeds these temporary modifications directly in PR descriptions. Create with `npx @simse/stamp create` and reviewers apply with `npx @simse/stamp use` - no separate branches or gists needed.
