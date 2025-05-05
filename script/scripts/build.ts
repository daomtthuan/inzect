import ChildProcess from 'child_process';
import FS from 'fs';
import Path from 'path';
import { Lifecycle } from '~/constants';
import { Inject, Scope } from '~/decorators';
import { ScriptBase } from './_base';
import ReadmeScript from './readme';

/** Build script. */
@Scope(Lifecycle.Singleton)
export class BuildScript extends ScriptBase {
  @Inject(ReadmeScript)
  readonly #readmeScript!: ReadmeScript;

  /** @inheritdoc */
  public run(): void {
    this.#lint();

    this.#cleanBuildDir();

    this.#build();
    this.#createBuildPackageJson();
    this.#readmeScript.run();

    this.#copyFiles();
  }

  #lint(): void {
    console.log('> Linting...');
    ChildProcess.execSync(`tsc --noEmit && eslint ./src --max-warnings 0`, {
      cwd: this.rootDir,
      stdio: 'inherit',
    });
  }

  #cleanBuildDir(): void {
    console.log('> Cleaning build directory...');
    if (FS.existsSync(this.buildDirPath)) {
      FS.rmSync(this.buildDirPath, { recursive: true, force: true });
    }

    FS.mkdirSync(this.buildDirPath, { recursive: true });
  }

  #createBuildPackageJson(): void {
    console.log('> Creating build package.json...');
    const buildPackageJsonPath = Path.join(this.buildDirPath, 'package.json');

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
    ChildProcess.execSync(`pnpm swc "./src" --config-file "./swc.config.json" --out-dir "${this.buildDirPath}" --strip-leading-paths`, {
      cwd: this.rootDir,
      stdio: 'inherit',
    });
  }

  #copyFiles(): void {
    console.log('> Copying files...');
    ['README.md', 'LICENSE'].forEach((fileName) => {
      const sourcePath = Path.join(this.rootDir, fileName);
      const targetPath = Path.join(this.buildDirPath, fileName);

      FS.cpSync(sourcePath, targetPath);
    });
  }
}

export default BuildScript;
