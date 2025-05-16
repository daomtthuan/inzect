import type { InjectOptionsBase } from './_base';

/**
 * Required Inject Options.
 *
 * @template TType Type of instance.
 */
export type RequiredInjectOptions<TType> = InjectOptionsBase<
  TType,
  {
    /**
     * If set to `true`, inject `undefined` if token is not registered.
     *
     * @default false
     */
    optional?: false | undefined;
  }
>;
