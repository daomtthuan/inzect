import ChildProcess from 'child_process';
import { Lifecycle } from '~/constants';
import { Scope } from '~/decorators';
import { ScriptBase } from './_base';

/** Lint script. */
@Scope(Lifecycle.Singleton)
export class LintScript extends ScriptBase {
  /** @inheritdoc */
  public run(): void {
    this.#lint();
  }

  #lint(): void {
    console.log('> Linting...');
    ChildProcess.execSync(`tsc --noEmit && eslint ./src --max-warnings 0`, {
      cwd: this.rootDir,
      stdio: 'inherit',
    });
  }
}

export default LintScript;
