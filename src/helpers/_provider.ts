import type { _InjectTokenOrOptions, ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from '~/types';

/**
 * Helper for Provider.
 *
 * @internal
 */
export class _ProviderHelper {
  /**
   * Check if the provider is {@link ClassInjectionProvider}.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param provider Provider.
   *
   * @returns `true` if the provider is {@link ClassInjectionProvider}, `false` otherwise.
   */
  public static isClassProvider<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): provider is ClassInjectionProvider<TType> {
    return 'useClass' in provider && typeof provider.useClass === 'function';
  }

  /**
   * Check if the provider is {@link ValueInjectionProvider}.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param provider Provider.
   *
   * @returns `true` if the provider is {@link ValueInjectionProvider}, `false` otherwise.
   */
  public static isValueProvider<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): provider is ValueInjectionProvider<TType> {
    return 'useValue' in provider;
  }

  /**
   * Check if the provider is {@link FactoryInjectionProvider}.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param provider Provider.
   *
   * @returns `true` if the provider is {@link FactoryInjectionProvider}, `false` otherwise.
   */
  public static isFactoryProvider<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): provider is FactoryInjectionProvider<TType, TDependencies, TInjects> {
    return 'useFactory' in provider && typeof provider.useFactory === 'function';
  }
}
