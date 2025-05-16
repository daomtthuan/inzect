import type { ErrorOptionsBase } from './_base';

/**
 * Argument Error Options.
 *
 * @template TArgument Argument type.
 */
export type ArgumentErrorOptions<TArgument> = ErrorOptionsBase<{
  /** Argument. */
  argument: TArgument;
}>;
