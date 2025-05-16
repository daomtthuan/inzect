import type { InjectParameter } from '~/types/injector';
import type { ClassInjectionProvider } from './_class';
import type { FactoryInjectionProvider } from './_factory';
import type { ValueInjectionProvider } from './_value';

/**
 * Injection Provider.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type InjectionProvider<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> =
  | ClassInjectionProvider<TType>
  | ValueInjectionProvider<TType>
  | FactoryInjectionProvider<TType, TDependencies, TInjectParameters>;
