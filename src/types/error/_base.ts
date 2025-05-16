import type { EmptyObject } from 'type-fest';

/**
 * Error Options Base.
 *
 * @template TOptions Options type.
 */
export type ErrorOptionsBase<TOptions extends object = EmptyObject> = {
  /** Error cause. */
  cause?: object;

  /** Error message. */
  message: string;
} & TOptions;
