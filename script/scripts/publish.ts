import ChildProcess from 'child_process';
import { Inject, Lifecycle, Scope } from 'inzect';
import { ScriptBase } from './_base';
import { BuildScript } from './build';
import { LintScript } from './lint';

/** Pack script. */
@Scope(Lifecycle.Singleton)
export class PackScript extends ScriptBase {
  @Inject(LintScript)
  readonly #lintScript!: LintScript;

  @Inject(BuildScript)
  readonly #buildScript!: BuildScript;

  /** @inheritdoc */
  public run(): void {
    this.#lintScript.run();
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
