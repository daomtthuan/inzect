import type { InjectionToken, InjectOptions, Registration, RegistrationErrorOptions } from '~/types';

/**
 * Dependency Registration Error.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export class RegistrationError<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]> extends Error {
  readonly #token: InjectionToken<TType>;
  readonly #registration: Registration<TType, TDependencies, TInjects>;

  /** @param options Registration Error Options. */
  public constructor(options: RegistrationErrorOptions<TType, TDependencies, TInjects>) {
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
  public get registration(): Registration<TType, TDependencies, TInjects> {
    return this.#registration;
  }
}
