import ChildProcess from 'child_process';
import FS from 'fs';
import { Inject, Lifecycle, Scope } from 'inzect';
import Path from 'path';
import { ScriptBase } from './_base';
import ReadmeScript from './readme';

/** Build script. */
@Scope(Lifecycle.Singleton)
export class BuildScript extends ScriptBase {
  @Inject(ReadmeScript)
  readonly #readmeScript!: ReadmeScript;

  /** @inheritdoc */
  public run(): void {
    this.#cleanBuildDir();

    this.#build();
    this.#createBuildPackageJson();
    this.#readmeScript.run();

    this.#copyFiles();
  }

  #cleanBuildDir(): void {
    console.log('> Cleaning build directory...');
    if (FS.existsSync(this.distDir)) {
      FS.rmSync(this.distDir, { recursive: true, force: true });
    }

    FS.mkdirSync(this.distDir, { recursive: true });
  }

  #createBuildPackageJson(): void {
    console.log('> Creating build package.json...');
    const buildPackageJsonPath = Path.join(this.distDir, 'package.json');

    FS.writeFileSync(
      buildPackageJsonPath,
      JSON.stringify(
        {
          name: this.packageJson.name,
          version: this.packageJson.version,
          license: this.packageJson.license,
          description: this.packageJson.description,
          author: this.packageJson.author,
          homepage: this.packageJson.homepage,
          repository: this.packageJson.repository,
          bugs: this.packageJson.bugs,
          type: this.packageJson.type,
          main: './index.js',
          exports: {
            '.': './index.js',
            './*': './*/index.js',
          },
          dependencies: this.packageJson.dependencies,
          keywords: this.packageJson.keywords,
        },
        null,
        2,
      ),
    );
  }

  #build(): void {
    console.log('> Building...');
    ChildProcess.execSync(`pnpm swc "./src" --config-file "./swc.config.json" --out-dir "${this.distDir}" --strip-leading-paths`, {
      cwd: this.rootDir,
      stdio: 'inherit',
    });
  }

  #copyFiles(): void {
    console.log('> Copying files...');
    ['README.md', 'LICENSE'].forEach((fileName) => {
      const sourcePath = Path.join(this.rootDir, fileName);
      const targetPath = Path.join(this.distDir, fileName);

      FS.cpSync(sourcePath, targetPath);
    });
  }
}

export default BuildScript;
