import type { InjectParameter } from '~/types/injector';
import type { FactoryInjectionProvider } from '~/types/provider';
import type { RegisterOptionsBase } from './_base';

/**
 * Factory Register Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type FactoryRegisterOptions<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> = RegisterOptionsBase<
  TType,
  FactoryInjectionProvider<TType, TDependencies, TInjectParameters>,
  TDependencies,
  TInjectParameters
>;
