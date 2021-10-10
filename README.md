# git-prettier

Run prettier during git clean and smudge stages.

## Introduction

Prettier is an AST transformation tool, and should not be part of your pre-commit hooks. The whole idea of prettier is that we should no longer care about formatting. By moving the code transformation from pre-commit to git clean and smudge filters, we allow developers to see and edit the code in their preferred style, while it exists in the repo in the preferred style of the maintainers.

In other words, the code style that you see in your editor, no longer needs to match the code style from the repo.

## Setup - for maintainers

Installation is done via 3 steps. The package needs to be installed, you need to enable it for specific file extensions, and you want the githook to be installed for your contributors.

Let's get started:

**First**, install the package as a dev dependency.

```bash
npm i -D git-prettier
```
**Next**, enable git-prettier for specific file extensions. Add as many as you'd like, simply separate the extensions with a `,`.

```bash
git-prettier init js,ts,tsx
```

**Last**, add a `postinstall` hook so that contributors use the same filters. In package.json:

```json
{
  "scripts": {
    "postinstall": "git-prettier"
  }
}
```

Note that the postinstall hook does not require extensions to be defined. The extensions are used to create or modify your `.gitattributes` file. That file should be committed to your repository.

## Usage - for contributors

Simply create a prettier config file according to their spec, in your home directory.

Files will be formatted using your personal config file during checkout, and using the repo config file on commit.

## Gotchas

  - **Eslint/Prettier integration**

      The connection between eslint and prettier should be removed. By integrating prettier in eslint, we force the contributor to use a coding style that they don't necessarily prefer. Eslint reports prettier/prettier errors, that are no errors. (didn't we use prettier so that it does not matter what style the developer uses?) The transformations are _always_ auto-fixable, and using git-prettier we're confident that it will be done before code lands. Keep eslint to catch errors and things that prettier can't handle. But leave as much formatting as possible to prettier.

  - **My style is not applied**

      Right after installation, it might happen that the currently checked out files are not transformed to match your personal prettier config. To correct this try switching branches, or delete the file and use a `git reset` to revert it.
    