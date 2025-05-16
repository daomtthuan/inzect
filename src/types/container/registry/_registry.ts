import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';
import type { Registration } from './_registration';

/** Dependency Injection Registry. */
export interface DependencyInjectionRegistry {
  /**
   * Set registration.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param registration Registration.
   */
  set<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
  ): void;

  /**
   * Set registrations for the token.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject types.
   * @param token Injection token.
   * @param registrations Registrations.
   */
  setAll<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registrations: Registration<TType, TDependencies, TInjectParameters>[],
  ): void;

  /**
   * Get registration.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   *
   * @returns Registrations.
   */
  get<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters> | undefined;

  /**
   * Get all registrations for the token.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject types.
   * @param token Injection token.
   *
   * @returns Registrations.
   */
  getAll<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters>[];

  /**
   * Check if the registry has a registration for the token.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns `true` if the registry has a registration for the token, `false` otherwise.
   */
  has<TType>(token: InjectionToken<TType>): boolean;

  /**
   * Delete registration.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   */
  delete<TType>(token: InjectionToken<TType>): void;

  /** Clear the registry. */
  clear(): void;
}
