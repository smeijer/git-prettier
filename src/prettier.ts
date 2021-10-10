import path from 'path';
import fs from 'fs';
import { homedir } from 'os';

const root = process.cwd(); // git root, not the invoke path :)
const home = homedir();

const cosmiconfigPath = path.resolve(root, 'node_modules/cosmiconfig');
const prettierPath = path.resolve(root, 'node_modules/prettier');

const cosmiconfig = fs.existsSync(cosmiconfigPath)
  ? require(cosmiconfigPath)
  : null;
const prettier = fs.existsSync(prettierPath) ? require(prettierPath) : null;

export function format(options: {
  action: 'smudge' | 'clean';
  code: string;
  file: string;
}) {
  // return the code as-is, if the project isn't using prettier. We don't want
  // to smudge things, that the repo can't clean.
  if (!prettier) return options.code;

  const configDir = options.action === 'clean' ? root : home;
  const resolved = cosmiconfig.cosmiconfigSync('prettier').search(configDir);

  // If we are unable to resolve a config for a smudge, it means that the user
  // doesn't have a prettier config file in their home directory. If they don't
  // have personal preferences, we can just serve the file in the repo style
  if (options.action === 'smudge' && !resolved) return options.code;

  // fallback to an empty object, to serve as "prettier defaults"
  const config = resolved.config || {};

  if (!config.parser) {
    const info = prettier.getFileInfo.sync(options.file);
    config.parser = info.inferredParser;
  }

  return prettier.format(options.code, config);
}
