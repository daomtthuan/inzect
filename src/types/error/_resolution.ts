import type { InjectionToken } from '~/types/token';
import type { ErrorOptionsBase } from './_base';

/**
 * Resolution Error Options.
 *
 * @template TType Type of instance.
 */
export type ResolutionErrorOptions<TType> = ErrorOptionsBase<{
  /** Injection token. */
  token: InjectionToken<TType>;
}>;
