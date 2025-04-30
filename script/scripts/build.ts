import ChildProcess from 'child_process';
import FS from 'fs';
import Path from 'path';
import { ScriptBase } from './_base';

/** Build script. */
export class BuildScript extends ScriptBase {
  /** Run script. */
  public run(): void {
    this.#cleanBuildDir();
    this.#build();
    this.#createBuildPackageJson();
    this.#copyFiles();
  }

  #cleanBuildDir(): void {
    if (FS.existsSync(this.buildDirPath)) {
      FS.rmSync(this.buildDirPath, { recursive: true, force: true });
    }

    FS.mkdirSync(this.buildDirPath, { recursive: true });
  }

  #createBuildPackageJson(): void {
    const buildPackageJsonPath = Path.join(this.buildDirPath, 'package.json');

    FS.writeFileSync(
      buildPackageJsonPath,
      JSON.stringify(
        {
          name: this.packageJson.name,
          version: this.packageJson.version,
          author: this.packageJson.author,
          packageManager: this.packageJson.packageManager,
          type: this.packageJson.type,
          main: './index.js',
          exports: {
            '.': './index.js',
            './*': './*/index.js',
          },
          dependencies: this.packageJson.dependencies,
        },
        null,
        2,
      ),
    );
  }

  #build(): void {
    ChildProcess.execSync(`pnpm swc "./src" --config-file "./swc.config.json" --out-dir "${this.buildDirPath}" --strip-leading-paths`, {
      cwd: this.rootDir,
      stdio: 'inherit',
    });
  }

  #copyFiles(): void {
    ['README.md', 'LICENSE'].forEach((fileName) => {
      const sourcePath = Path.join(this.rootDir, fileName);
      const targetPath = Path.join(this.buildDirPath, fileName);

      FS.cpSync(sourcePath, targetPath);
    });
  }
}

export default BuildScript;
