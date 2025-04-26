import type { InjectionToken } from './_token';

/** Error Options Base. */
export interface ErrorOptionsBase extends ErrorOptions {
  /** Error message. */
  message: string;
}

/**
 * Resolution Error Options.
 *
 * @template TType Type of instance.
 */
export interface ResolutionErrorOptions<TType> extends ErrorOptionsBase {
  /** Injection token. */
  token: InjectionToken<TType>;
}
