import type { InjectParameter } from '~/types/injector';
import type { ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from '~/types/provider';

/** Helper for Provider. */
export class ProviderHelper {
  /**
   * Check if the provider is {@link ClassInjectionProvider}.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param provider Provider.
   *
   * @returns `true` if the provider is {@link ClassInjectionProvider}, `false` otherwise.
   */
  public static isClassProvider<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
  ): provider is ClassInjectionProvider<TType> {
    return 'useClass' in provider && typeof provider.useClass === 'function';
  }

  /**
   * Check if the provider is {@link ValueInjectionProvider}.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param provider Provider.
   *
   * @returns `true` if the provider is {@link ValueInjectionProvider}, `false` otherwise.
   */
  public static isValueProvider<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
  ): provider is ValueInjectionProvider<TType> {
    return 'useValue' in provider;
  }

  /**
   * Check if the provider is {@link FactoryInjectionProvider}.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param provider Provider.
   *
   * @returns `true` if the provider is {@link FactoryInjectionProvider}, `false` otherwise.
   */
  public static isFactoryProvider<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
  ): provider is FactoryInjectionProvider<TType, TDependencies, TInjectParameters> {
    return 'useFactory' in provider && typeof provider.useFactory === 'function';
  }
}
