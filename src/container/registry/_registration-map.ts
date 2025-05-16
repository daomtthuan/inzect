/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Registration } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { TokenMapKey } from '~/types/map';

/**
 * Registration Map.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export class RegistrationMap<
  TType = any,
  TDependencies extends unknown[] = any[],
  TInjectParameters extends InjectParameter<unknown>[] = any[],
> extends WeakMap<TokenMapKey<TType>, Registration<TType, TDependencies, TInjectParameters>[]> {}
