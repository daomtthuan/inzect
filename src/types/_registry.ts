import type { InjectionLifecycle } from './_lifecycle';
import type { InjectionProvider } from './_provider';
import type { InjectionToken } from './_token';

/**
 * Registration.
 *
 * @template TType Type of instance.
 */
export interface Registration<TType> {
  /** Injection Provider. */
  provider: InjectionProvider<TType>;

  /** Injection Lifecycle Scope. */
  scope: InjectionLifecycle;

  /** Resolved Instance. */
  instance?: TType;
}

/** Dependency Injection Registry. */
export interface DependencyInjectionRegistry {
  /**
   * Set registration.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   * @param registration Registration.
   */
  set<TType>(token: InjectionToken<TType>, registration: Registration<TType>): void;

  /**
   * Get registration.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns Registrations.
   */
  get<TType>(token: InjectionToken<TType>): Registration<TType> | null;

  /**
   * Check if the registry has a registration for the token.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns True if the registry has a registration for the token, false otherwise.
   */
  has<TType>(token: InjectionToken<TType>): boolean;

  /** Clear the registry. */
  clear(): void;
}
