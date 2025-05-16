/**
 * Error Options Base.
 *
 * @template TOptions Options type.
 */
export type ErrorOptionsBase<TOptions extends object = never> = {
  /** Error cause. */
  cause?: object;

  /** Error message. */
  message: string;
} & TOptions;
