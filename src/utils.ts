import { inspect } from 'util';
import path from 'path';

export function print(msg: any = ''): void {
  process.stderr.write(
    typeof msg === 'string'
      ? msg + '\n'
      : inspect(msg, { breakLength: 80, colors: true }),
  );
}

export type InitArgs = {
  command: 'init';
  root: string;
  extensions: string[];
  file?: never;
};
export type FilterArgs = {
  command: 'clean' | 'smudge';
  root: string;
  extensions?: never;
  file: string;
};
export type Argv = InitArgs | FilterArgs;

export function argv(): Argv {
  const [node, self, command, file = ''] = process.argv;
  const root = process.cwd();

  switch (command as Argv['command']) {
    case 'init': {
      return {
        root,
        command: 'init',
        extensions: file
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => (x[0] === '*' ? x : '*.' + x)),
      };
    }

    case 'clean': {
      return { root, command: 'clean', file: path.resolve(root, file) };
    }

    case 'smudge': {
      return { root, command: 'smudge', file: path.resolve(root, file) };
    }

    default: {
      throw new Error(
        'Unknown command, please provide init, clean, or smudge options',
      );
    }
  }
}

export async function streamToString(
  stream: NodeJS.ReadStream,
): Promise<string> {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf-8');
}
