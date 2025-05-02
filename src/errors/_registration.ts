import type { InjectionToken, Registration, RegistrationErrorOptions } from '~/types';

/**
 * Dependency Registration Error.
 *
 * @template TType Type of instance.
 */
export class RegistrationError<TType = any> extends Error {
  readonly #token: InjectionToken<TType>;
  readonly #registration: Registration<TType>;

  /** @param options Registration Error Options. */
  public constructor(options: RegistrationErrorOptions<TType>) {
    super(options.message, {
      cause: {
        ...options.cause,
        token: options.token,
        registration: options.registration,
      },
    });

    this.#token = options.token;
    this.#registration = options.registration;
  }

  /** @returns Injection token. */
  public get token(): InjectionToken<TType> {
    return this.#token;
  }

  /** @returns Registration. */
  public get registration(): Registration<TType> {
    return this.#registration;
  }
}
