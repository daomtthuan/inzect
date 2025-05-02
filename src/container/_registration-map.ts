import type { _InjectionTokenMapKey, InjectOptions, Registration } from '~/types';

/**
 * Registration Map.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 * @internal
 */
export class _RegistrationMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TType = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TDependencies extends unknown[] = any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInjects extends InjectOptions<unknown>[] = InjectOptions<any>[],
> extends WeakMap<_InjectionTokenMapKey<TType>, Registration<TType, TDependencies, TInjects>[]> {}
