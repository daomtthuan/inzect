import type { InjectionToken, Registration } from '~/types';

/**
 * Internal Registration Map.
 *
 * @template TType Type of instance.
 * @internal
 */
export class _RegistrationMap<TType = any> extends WeakMap<InjectionToken<TType>, Registration<TType>[]> {}
