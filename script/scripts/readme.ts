import FS from 'fs';
import Path from 'path';
import { Lifecycle } from '~/constants';
import { Scope } from '~/decorators';
import { ScriptBase } from './_base';

/** Readme script. */
@Scope(Lifecycle.Singleton)
export class ReadmeScript extends ScriptBase {
  readonly #templatePath = Path.join(this.rootDir, './script/templates/readme-template.md');
  readonly #readmePath = Path.join(this.rootDir, './README.md');
  readonly #examplePlaceholderRegex = /([ ]*?)__\[EXAMPLE\]\((.+?)\)__/g;

  /** @inheritdoc */
  public run(): void {
    this.#build();
  }

  #build(): void {
    console.log('> Building README...');

    let template = FS.readFileSync(this.#templatePath, 'utf-8');

    const exampleMatch = template.matchAll(this.#examplePlaceholderRegex);
    exampleMatch.forEach(([match, space, file]) => {
      if (!file) {
        return;
      }

      const filePath = Path.join(this.rootDir, file);
      const fileContent = FS.readFileSync(filePath, 'utf-8')
        .trim()
        .split('\n')
        .map((line) => {
          const addedSpace = `${space}${line}`;
          return !addedSpace.trim() ? '' : addedSpace;
        })
        .join('\n');
      template = template.replace(match, fileContent);
    });

    FS.writeFileSync(this.#readmePath, template);
  }
}

export default ReadmeScript;
