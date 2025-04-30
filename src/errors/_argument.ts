import type { ArgumentErrorOptions } from '~/types';

/** Dependency Argument Error. */
export class ArgumentError extends Error {
  readonly #argument: string;

  /** @param options Argument Error Options. */
  public constructor(options: ArgumentErrorOptions) {
    super(options.message, {
      cause: options.cause,
    });

    this.#argument = options.argument;
  }

  /** @returns Argument. */
  public get argument(): string {
    return this.#argument;
  }
}
