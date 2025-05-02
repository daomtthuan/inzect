import type { ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from '~/types';

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
   * @param provider Provider.
   *
   * @returns True if the provider is {@link ClassInjectionProvider}, false otherwise.
   */
  public static isClassProvider<TType>(provider: InjectionProvider<TType>): provider is ClassInjectionProvider<TType> {
    return 'useClass' in provider && typeof provider.useClass === 'function';
  }

  /**
   * Check if the provider is {@link ValueInjectionProvider}.
   *
   * @template TType Type of instance.
   * @param provider Provider.
   *
   * @returns True if the provider is {@link ValueInjectionProvider}, false otherwise.
   */
  public static isValueProvider<TType>(provider: InjectionProvider<TType>): provider is ValueInjectionProvider<TType> {
    return 'useValue' in provider;
  }

  /**
   * Check if the provider is {@link FactoryInjectionProvider}.
   *
   * @template TType Type of instance.
   * @param provider Provider.
   *
   * @returns True if the provider is {@link FactoryInjectionProvider}, false otherwise.
   */
  public static isFactoryProvider<TType>(provider: InjectionProvider<TType>): provider is FactoryInjectionProvider<TType> {
    return 'useFactory' in provider && typeof provider.useFactory === 'function';
  }
}
