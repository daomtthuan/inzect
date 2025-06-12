import ChildProcess from 'child_process';
import { Lifecycle, Scope } from 'inzect';
import { ScriptBase } from './_base';

/** Test script. */
@Scope(Lifecycle.Singleton)
export class TestScript extends ScriptBase {
  /** @inheritdoc */
  public run(): void {
    ChildProcess.spawnSync(`pnpm vitest`, {
      cwd: this.rootDir,
      stdio: 'inherit',
      shell: true,
    });
  }
}

export default TestScript;
