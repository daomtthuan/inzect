import type { ClassInjectionProvider, FactoryInjectionProvider, Registration, ValueInjectionProvider } from '~/types';

import { _ProviderHelper } from './_provider';

/**
 * Helper for Registration.
 *
 * @internal
 */
export class _RegistrationHelper {
  /**
   * Check if the registration has provider is {@link ClassInjectionProvider}.
   *
   * @template TType Type of instance.
   * @param registration Registration.
   *
   * @returns True if the registration has provider is {@link ClassInjectionProvider}, false otherwise.
   */
  public static isClassRegistration<TType>(registration: Registration<TType>): registration is Registration<TType, ClassInjectionProvider<TType>> {
    return _ProviderHelper.isClassProvider(registration.provider);
  }

  /**
   * Check if the registration has provider is {@link ValueInjectionProvider}.
   *
   * @template TType Type of instance.
   * @param registration Registration.
   *
   * @returns True if the registration has provider is {@link ValueInjectionProvider}, false otherwise.
   */
  public static isValueRegistration<TType>(registration: Registration<TType>): registration is Registration<TType, ValueInjectionProvider<TType>> {
    return _ProviderHelper.isValueProvider(registration.provider);
  }

  /**
   * Check if the registration has provider is {@link FactoryInjectionProvider}.
   *
   * @template TType Type of instance.
   * @param registration Registration.
   *
   * @returns True if the registration has provider is {@link FactoryInjectionProvider}, false otherwise.
   */
  public static isFactoryRegistration<TType>(registration: Registration<TType>): registration is Registration<TType, FactoryInjectionProvider<TType>> {
    return _ProviderHelper.isFactoryProvider(registration.provider);
  }
}
