import type { InjectionTokenMapKey, InjectTokenOrOptions, Registration } from '~/types';

/**
 * Registration Map.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export class RegistrationMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TType = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TDependencies extends unknown[] = any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInjects extends InjectTokenOrOptions<unknown>[] = any[],
> extends WeakMap<InjectionTokenMapKey<TType>, Registration<TType, TDependencies, TInjects>[]> {}
