import type { Registration } from './_registration';
import type { InjectionToken } from './_token';

/**
 * Error Options Base.
 *
 * @internal
 */
type _ErrorOptionsBase = {
  /** Error cause. */
  cause?: object;

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

  /** Registration. */
  registration: Registration<TType>;
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

/**
 * Argument Error Options.
 *
 * @template TArgument Argument type.
 */
export type ArgumentErrorOptions<TArgument> = _ErrorOptionsBase & {
  /** Argument. */
  argument: TArgument;
};
