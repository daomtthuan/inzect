import type { _InjectionTokenMapKey, Registration } from '~/types';

/**
 * Registration Map.
 *
 * @template TType Type of instance.
 * @internal
 */
export class _RegistrationMap<TType = any> extends WeakMap<_InjectionTokenMapKey<TType>, Registration<TType>[]> {}
