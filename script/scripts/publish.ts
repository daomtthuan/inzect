import ChildProcess from 'child_process';
import { Lifecycle } from '~/constants';
import { Inject, Scope } from '~/decorators';
import { ScriptBase } from './_base';
import { BuildScript } from './build';

/** Pack script. */
@Scope(Lifecycle.Singleton)
export class PackScript extends ScriptBase {
  @Inject(BuildScript)
  readonly #buildScript!: BuildScript;

  /** @inheritdoc */
  public run(): void {
    this.#buildScript.run();
    this.#publish();
  }

  #publish(): void {
    console.log('> Publishing...');
    ChildProcess.execSync(`pnpm publish`, {
      cwd: this.buildDirPath,
      stdio: 'inherit',
    });
  }
}

export default PackScript;
