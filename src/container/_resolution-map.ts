import type { InjectionToken } from '~/types';

/**
 * Resolution Map.
 *
 * @template TType Type of instance.
 * @internal
 */
export class _ResolutionMap<TType = any> extends WeakMap<InjectionToken<TType>, TType> {}
