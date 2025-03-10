# stamp 🔖

A Git tool that automatically embeds test patches directly in your PR descriptions using the GitHub CLI, making sharing and applying testing changes quick and seamless. ✨

## Usage 🚀
Create a patch and ✨**automatically**✨ embed it in your PR description:
```bash
npx @simse/stamp create
```

![Made with VHS](https://vhs.charm.sh/vhs-5SLBEaApGClhSWzhibblER.gif)

Apply a patch from a PR description:
```bash
npx @simse/stamp use
```

![Made with VHS](https://vhs.charm.sh/vhs-6sXQErJH4EFpIE0z595sZi.gif)

_Look ma, no hands! Or almost no hands..._

## Requirements 📋
- Github
- Github CLI (`gh`) installed and authenticated
- Git

## How it works ⚙️

Stamp uses GitHub CLI to:

1. Generate a patch from your changes
2. Automatically embed the patch in your PR description
3. Allow others to apply those changes with a single command
