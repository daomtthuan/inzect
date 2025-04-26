import type { PackageJson } from 'type-fest';

import FS from 'fs';
import Path from 'path';
import Process from 'process';

/** Script base. */
export abstract class ScriptBase {
  readonly #rootPath = Process.cwd();
  readonly #packageJsonPath = Path.join(this.#rootPath, 'package.json');
  #packageJson?: PackageJson;
  #buildDirPath?: string;

  public abstract run(): void | Promise<void>;

  /** @returns Root path. */
  protected get rootPath(): string {
    return this.#rootPath;
  }

  /** @returns Package.json path. */
  protected get packageJsonPath(): string {
    return this.#packageJsonPath;
  }

  /** @returns Package.json. */
  protected get packageJson(): PackageJson {
    if (!this.#packageJson) {
      this.#packageJson = this.#getPackageJson(this.#packageJsonPath);
    }

    return this.#packageJson;
  }

  /** @returns Build directory path. */
  protected get buildDirPath(): string {
    if (!this.#buildDirPath) {
      this.#buildDirPath = this.#getBuildDirPath(this.packageJson);
    }

    return this.#buildDirPath;
  }

  #getPackageJson(packageJsonPath: string): PackageJson {
    if (!FS.existsSync(packageJsonPath)) {
      throw new Error(`File 'package.json' not found`);
    }

    return JSON.parse(FS.readFileSync(packageJsonPath, 'utf-8'));
  }

  #getBuildDirPath({ version }: PackageJson): string {
    if (!version) {
      throw new Error(`Package version not found`);
    }

    return Path.join(this.#rootPath, 'dist', version);
  }
}
