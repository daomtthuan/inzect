import ChildProcess from 'child_process';
import { Inject, Scope } from '~/decorators';
import { Lifecycle } from '~/types';
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
    this.#pack();
  }

  #pack(): void {
    ChildProcess.execSync(`pnpm pack --pack-destination "${this.distDir}"`, {
      cwd: this.buildDirPath,
      stdio: 'inherit',
    });
  }
}

export default PackScript;
