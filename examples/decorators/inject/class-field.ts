import { Inject } from 'inzect';
import { Logger } from '~examples/modules/logger';

export class App {
  @Inject(Logger)
  readonly #logger!: Logger;

  run(): void {
    this.#logger.log('Hello world!');
  }
}
