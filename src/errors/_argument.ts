import type { ArgumentErrorOptions } from '~/types';

/**
 * Dependency Argument Error.
 *
 * @template TArgument Argument type.
 */
export class ArgumentError<TArgument> extends Error {
  readonly #argument: TArgument;

  /** @param options Argument Error Options. */
  public constructor(options: ArgumentErrorOptions<TArgument>) {
    super(options.message, {
      cause: {
        ...options.cause,
        token: options.argument,
      },
    });

    this.#argument = options.argument;
  }

  /** @returns Argument. */
  public get argument(): TArgument {
    return this.#argument;
  }
}
