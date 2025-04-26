import ChildProcess from 'child_process';
import { ScriptBase } from './_base';
import { BuildScript } from './build';

/** Pack script. */
export class PackScript extends ScriptBase {
  readonly #buildScript = new BuildScript();

  /** Run script. */
  public run(): void {
    this.#buildScript.run();
    this.#pack();
  }

  #pack(): void {
    ChildProcess.execSync(`pnpm pack`, {
      cwd: this.buildDirPath,
      stdio: 'inherit',
    });
  }
}

export default PackScript;
