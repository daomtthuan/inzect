import type { PackageJson } from 'type-fest';

import FS from 'fs';
import Path from 'path';
import Process from 'process';

/** Script base. */
export abstract class ScriptBase {
  readonly #rootDir = Process.cwd();
  readonly #distDir = Path.join(this.#rootDir, 'dist');
  readonly #packageJsonPath = Path.join(this.#rootDir, 'package.json');
  #packageJson?: PackageJson;

  /**
   * Run script.
   *
   * @param args Script arguments.
   */
  public abstract run(...args: string[]): void | Promise<void>;

  /** @returns Root directory path. */
  protected get rootDir(): string {
    return this.#rootDir;
  }

  /** @returns Dist directory path. */
  protected get distDir(): string {
    return this.#distDir;
  }

  /** @returns Package.json path. */
  protected get packageJsonPath(): string {
    return this.#packageJsonPath;
  }

  /** @returns Package.json. */
  protected get packageJson(): PackageJson {
    this.#packageJson ??= this.#getPackageJson(this.#packageJsonPath);
    return this.#packageJson;
  }

  #getPackageJson(packageJsonPath: string): PackageJson {
    if (!FS.existsSync(packageJsonPath)) {
      throw new Error(`File 'package.json' not found`, {
        cause: { packageJsonPath },
      });
    }

    return JSON.parse(FS.readFileSync(packageJsonPath, 'utf-8'));
  }
}
