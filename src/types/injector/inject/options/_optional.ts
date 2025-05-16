import type { InjectOptionsBase } from './_base';

/**
 * Optional Inject Options.
 *
 * @template TType Type of instance.
 */
export type OptionalInjectOptions<TType> = InjectOptionsBase<
  TType,
  {
    /** If set to `true`, inject `undefined` if token is not registered. */
    optional: true;
  }
>;
