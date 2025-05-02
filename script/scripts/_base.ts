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
  #buildDirPath?: string;

  public abstract run(): void | Promise<void>;

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
      throw new Error(`File 'package.json' not found`, {
        cause: { packageJsonPath },
      });
    }

    return JSON.parse(FS.readFileSync(packageJsonPath, 'utf-8'));
  }

  #getBuildDirPath(packageJson: PackageJson): string {
    if (!packageJson.version) {
      throw new Error(`Package version not found`, {
        cause: { packageJson },
      });
    }

    return Path.join(this.#distDir, packageJson.version);
  }
}
