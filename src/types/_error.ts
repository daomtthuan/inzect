import type { InjectionToken } from './_token';

/**
 * Error Options Base.
 *
 * @internal
 */
type _ErrorOptionsBase = ErrorOptions & {
  /** Error message. */
  message: string;
};

/**
 * Registration Error Options.
 *
 * @template TType Type of instance.
 */
export type RegistrationErrorOptions<TType> = _ErrorOptionsBase & {
  /** Injection token. */
  token: InjectionToken<TType>;
};

/**
 * Resolution Error Options.
 *
 * @template TType Type of instance.
 */
export type ResolutionErrorOptions<TType> = _ErrorOptionsBase & {
  /** Injection token. */
  token: InjectionToken<TType>;
};

/** Argument Error Options. */
export type ArgumentErrorOptions = _ErrorOptionsBase & {
  /** Argument name. */
  argument: string;
};
