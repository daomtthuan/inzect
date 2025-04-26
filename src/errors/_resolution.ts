import type { InjectionToken, ResolutionErrorOptions } from '~/types';

/**
 * Dependency Resolution Error.
 *
 * @template TType Type of instance.
 */
export class ResolutionError<Type = any> extends Error {
  readonly #token: InjectionToken<Type>;

  /** @param options Resolution Error Options. */
  public constructor({ message, token, cause }: ResolutionErrorOptions<Type>) {
    super(message, { cause });

    this.#token = token;
  }

  /** @returns Injection token. */
  public get token(): InjectionToken<Type> {
    return this.#token;
  }
}
