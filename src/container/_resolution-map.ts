import type { _InjectionTokenMapKey } from '~/types';

/**
 * Resolution Map.
 *
 * @template TType Type of instance.
 * @internal
 */
export class _ResolutionMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TType = any,
> extends WeakMap<_InjectionTokenMapKey<TType>, TType> {}
