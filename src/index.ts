#!/usr/bin/env node
import fs from 'fs/promises';

import { argv, FilterArgs, InitArgs, print, streamToString } from './utils';
import { format } from './prettier';

const filter = `
[filter "git-prettier"]
  clean = git-prettier clean %f
  smudge = git-prettier smudge %f
`;

async function init(args: InitArgs) {
  const [gitConfig, gitAttributes] = await Promise.all([
    fs.readFile('.git/config', { encoding: 'utf-8' }),
    fs.readFile('.gitattributes', { encoding: 'utf-8' }).catch(() => ''),
  ]);

  let changed = false;

  if (!gitConfig.includes(`[filter "git-prettier"]`)) {
    changed = true;
    await fs.writeFile('.git/config', gitConfig + filter);
    print('✓ git-prettier added to .git/config');
  }

  if (args.extensions.length) {
    const filters = args.extensions.map(
      (ext) => `${ext.padEnd(10, ' ')} filter=git-prettier`,
    );

    const newGitAttributes =
      gitAttributes
        .split('\n')
        .filter((line) => !/\s*filter\s*=\s*git-prettier\s*/.test(line)) // remove current
        .concat(...filters) // add new
        .join('\n')
        .trim() + '\n';

    if (newGitAttributes.trim() !== gitAttributes.trim()) {
      changed = true;
      await fs.writeFile('.gitattributes', newGitAttributes);
      print('✓ git-prettier added to .gitattributes');
    }
  }

  if (!changed) {
    print('✓ git-prettier is already active');
  }
}

async function clean({ file }: FilterArgs) {
  const code = await streamToString(process.stdin);
  const formatted = format({ action: 'clean', code, file });
  process.stdout.write(formatted);
}

async function smudge({ file }: FilterArgs) {
  const code = await streamToString(process.stdin);
  const formatted = format({ action: 'smudge', code, file });
  process.stdout.write(formatted);
}

async function main() {
  const args = argv();

  switch (args.command) {
    case 'clean':
      return clean(args);
    case 'smudge':
      return smudge(args);
    case 'init':
      return init(args);
  }
}

main().catch((err) => {
  print('git-prettier: ' + err.message);
  print(err.stack);
});
