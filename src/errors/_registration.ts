import type { Registration } from '~/types/container';
import type { RegistrationErrorOptions } from '~/types/error';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

/**
 * Dependency Registration Error.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export class RegistrationError<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> extends Error {
  readonly #token: InjectionToken<TType>;
  readonly #registration: Registration<TType, TDependencies, TInjectParameters>;

  /** @param options Registration Error Options. */
  public constructor(options: RegistrationErrorOptions<TType, TDependencies, TInjectParameters>) {
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
  public get registration(): Registration<TType, TDependencies, TInjectParameters> {
    return this.#registration;
  }
}
