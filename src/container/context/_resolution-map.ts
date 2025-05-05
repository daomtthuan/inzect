import type { InjectionTokenMapKey } from '~/types';

/**
 * Resolution Map.
 *
 * @template TType Type of instance.
 */
export class ResolutionMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TType = any,
> extends WeakMap<InjectionTokenMapKey<TType>, TType> {}
