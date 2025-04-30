import type { Registration } from './_registration';
import type { InjectionToken } from './_token';

/** Dependency Injection Registry Interface. */
export interface IDependencyInjectionRegistry {
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
