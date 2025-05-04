import FS from 'fs';
import Path from 'path';
import { Scope } from '~/decorators';
import { Lifecycle } from '~/types';
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
          if (!addedSpace.trim()) {
            return '';
          }

          return addedSpace;
        })
        .join('\n');
      template = template.replace(match, fileContent);
    });

    FS.writeFileSync(this.#readmePath, template);
  }
}

export default ReadmeScript;
