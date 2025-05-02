import type { _InjectionTokenMapKey } from '~/types';

/**
 * Resolution Map.
 *
 * @template TType Type of instance.
 * @internal
 */
export class _ResolutionMap<TType = any> extends WeakMap<_InjectionTokenMapKey<TType>, TType> {}
