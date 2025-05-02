import type { InjectionToken, ResolutionErrorOptions } from '~/types';

/**
 * Dependency Resolution Error.
 *
 * @template TType Type of instance.
 */
export class ResolutionError<TType> extends Error {
  readonly #token: InjectionToken<TType>;

  /** @param options Resolution Error Options. */
  public constructor(options: ResolutionErrorOptions<TType>) {
    super(options.message, {
      cause: {
        ...options.cause,
        token: options.token,
      },
    });

    this.#token = options.token;
  }

  /** @returns Injection token. */
  public get token(): InjectionToken<TType> {
    return this.#token;
  }
}
