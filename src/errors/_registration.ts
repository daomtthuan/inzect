import type { InjectionToken, RegistrationErrorOptions } from '~/types';

/**
 * Dependency Registration Error.
 *
 * @template TType Type of instance.
 */
export class RegistrationError<Type = any> extends Error {
  readonly #token: InjectionToken<Type>;

  /** @param options Registration Error Options. */
  public constructor(options: RegistrationErrorOptions<Type>) {
    super(options.message, {
      cause: options.cause,
    });

    this.#token = options.token;
  }

  /** @returns Injection token. */
  public get token(): InjectionToken<Type> {
    return this.#token;
  }
}
