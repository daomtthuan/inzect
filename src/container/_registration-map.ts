import type { InjectionToken, Registration } from '~/types';

/**
 * Registration Map.
 *
 * @template TType Type of instance.
 * @internal
 */
export class _RegistrationMap<TType = any> extends WeakMap<InjectionToken<TType>, Registration<TType>[]> {}
