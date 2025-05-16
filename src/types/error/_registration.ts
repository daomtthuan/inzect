import type { Registration } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';
import type { ErrorOptionsBase } from './_base';

/**
 * Registration Error Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type RegistrationErrorOptions<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> = ErrorOptionsBase<{
  /** Injection token. */
  token: InjectionToken<TType>;

  /** Registration. */
  registration: Registration<TType, TDependencies, TInjectParameters>;
}>;
