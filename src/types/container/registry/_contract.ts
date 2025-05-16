import type { InjectParameter } from '~/types/injector';
import type { ClassRegisterOptions, FactoryRegisterOptions, ValueRegisterOptions } from './options';

/**
 * Register Parameter.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type RegisterParameter<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> =
  | ClassRegisterOptions<TType>
  | ValueRegisterOptions<TType>
  | FactoryRegisterOptions<TType, TDependencies, TInjectParameters>;
