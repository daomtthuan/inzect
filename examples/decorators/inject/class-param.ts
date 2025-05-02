import { Inject } from 'inzect';
import { Logger } from '~examples/modules/logger';

@Inject([Logger])
export class App {
  readonly #logger: Logger;

  public constructor(logger: Logger) {
    this.#logger = logger;
  }

  run(): void {
    this.#logger.log('Hello world!');
  }
}
