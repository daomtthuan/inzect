import type { InjectionLifecycle } from './_lifecycle';
import type { ClassInjectionProvider, FactoryInjectionProvider, ValueInjectionProvider } from './_provider';
import type { InjectionToken } from './_token';

/**
 * Register Options Base.
 *
 * @template TType Type of instance.
 */
export interface RegisterOptionsBase<TType> {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /** Injection Lifecycle Scope. */
  scope?: InjectionLifecycle;
}

/**
 * Class Register Options.
 *
 * @template TType Type of instance.
 */
export interface ClassRegisterOptions<TType> extends RegisterOptionsBase<TType>, ClassInjectionProvider<TType> {}

/**
 * Value Register Options.
 *
 * @template TType Type of instance.
 */
export interface ValueRegisterOptions<TType> extends RegisterOptionsBase<TType>, ValueInjectionProvider<TType> {}

/**
 * Factory Injection Provider.
 *
 * @template TType Type of instance.
 */
export interface FactoryRegisterOptions<TType> extends RegisterOptionsBase<TType>, FactoryInjectionProvider<TType> {}

/**
 * Register Options.
 *
 * @template TType Type of instance.
 */
export type RegisterOptions<TType> = ClassRegisterOptions<TType> | ValueRegisterOptions<TType> | FactoryRegisterOptions<TType>;

/**
 * Registration.
 *
 * @template TType Type of instance.
 */
export interface Registration<TType> {
  /** Register Options. */
  options: RegisterOptions<TType>;

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
