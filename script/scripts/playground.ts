import ChildProcess from 'child_process';
import { Lifecycle } from '~/constants';
import { Scope } from '~/decorators';
import { ScriptBase } from './_base';

/** Playground script. */
@Scope(Lifecycle.Singleton)
export class PlaygroundScript extends ScriptBase {
  /** @inheritdoc */
  public run(name: string): void {
    console.log('> Running playground...');
    ChildProcess.execSync(`pnpm tsx ./script/playground/${name}.ts`, {
      cwd: this.rootDir,
      stdio: 'inherit',
    });
  }
}

export default PlaygroundScript;
