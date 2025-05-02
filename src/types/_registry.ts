import type { InjectOptions } from './_decorator';
import type { Registration } from './_registration';
import type { InjectionToken } from './_token';

/** Dependency Injection Registry Interface. */
export interface IDependencyInjectionRegistry {
  /**
   * Set registration.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param token Injection token.
   * @param registration Registration.
   */
  set<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
  ): void;

  /**
   * Get registration.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param token Injection token.
   *
   * @returns Registrations.
   */
  get<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjects> | null;

  /**
   * Check if the registry has a registration for the token.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns `true` if the registry has a registration for the token, `false` otherwise.
   */
  has<TType>(token: InjectionToken<TType>): boolean;

  /** Clear the registry. */
  clear(): void;
}
