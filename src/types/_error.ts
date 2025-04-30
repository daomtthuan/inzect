import type { InjectionToken } from './_token';

/** Error Options Base. */
export interface ErrorOptionsBase extends ErrorOptions {
  /** Error message. */
  message: string;
}

/**
 * Registration Error Options.
 *
 * @template TType Type of instance.
 */
export interface RegistrationErrorOptions<TType> extends ErrorOptionsBase {
  /** Injection token. */
  token: InjectionToken<TType>;
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

/** Argument Error Options. */
export interface ArgumentErrorOptions extends ErrorOptionsBase {
  /** Argument name. */
  argument: string;
}
