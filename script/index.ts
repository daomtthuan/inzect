import type { Class } from 'type-fest';

import Process from 'process';
import { ScriptBase } from './scripts/_base';

/** Entry Script. */
export class Script extends ScriptBase {
  /** Run script. */
  public async run(): Promise<void> {
    const [_, __, scriptName] = Process.argv;
    const script: Class<ScriptBase> = (await import(`./scripts/${scriptName}`)).default;
    if (!script) {
      throw new Error(`Script "${scriptName}" not found!`, {
        cause: { argv: Process.argv },
      });
    }

    await Promise.resolve(new script().run());
  }
}

new Script().run();
