import ChildProcess from 'child_process';
import { ScriptBase } from './_base';
import { BuildScript } from './build';

/** Pack script. */
export class PackScript extends ScriptBase {
  readonly #buildScript = new BuildScript();

  /** Run script. */
  public run(): void {
    this.#buildScript.run();
    this.#publish();
  }

  #publish(): void {
    ChildProcess.execSync(`pnpm publish`, {
      cwd: this.buildDirPath,
      stdio: 'inherit',
    });
  }
}

export default PackScript;
