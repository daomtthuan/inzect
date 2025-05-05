import type { Lifecycle } from '~/constants';
import type { InjectTokenOrOptions } from './_decorator';
import type { ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from './_provider';
import type { InjectionToken } from './_token';

/**
 * Register Options Base.
 *
 * @template TType Type of instance.
 * @template TProvider Injection Provider.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
type RegisterOptionsBase<
  TType,
  TProvider extends InjectionProvider<TType, TDependencies, TInjects>,
  TDependencies extends unknown[] = never,
  TInjects extends InjectTokenOrOptions<unknown>[] = never,
> = {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /** Injection Provider. */
  provider: TProvider;

  /**
   * Injection Lifecycle Scope.
   *
   * @default InjectionLifecycle.Transient
   */
  scope?: Lifecycle | undefined;
};

/**
 * Class Register Options.
 *
 * @template TType Type of instance.
 */
export type ClassRegisterOptions<TType> = RegisterOptionsBase<TType, ClassInjectionProvider<TType>>;

/**
 * Value Register Options.
 *
 * @template TType Type of instance.
 */
export type ValueRegisterOptions<TType> = RegisterOptionsBase<TType, ValueInjectionProvider<TType>>;

/**
 * Factory Register Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type FactoryRegisterOptions<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]> = RegisterOptionsBase<
  TType,
  FactoryInjectionProvider<TType, TDependencies, TInjects>,
  TDependencies,
  TInjects
>;

/**
 * Register Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type RegisterOptions<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]> =
  | ClassRegisterOptions<TType>
  | ValueRegisterOptions<TType>
  | FactoryRegisterOptions<TType, TDependencies, TInjects>;

/**
 * Resolve Options Base.
 *
 * @template TType Type of instance.
 */
type ResolveOptionsBase<TType> = {
  /** Injection Token. */
  token: InjectionToken<TType>;
};

/**
 * Required Resolve Options.
 *
 * @template TType Type of instance.
 */
export type RequiredResolveOptions<TType> = ResolveOptionsBase<TType> & {
  /**
   * `true` if the resolution is optional, `false` otherwise.
   *
   * @default false
   */
  optional?: false | undefined;
};

/**
 * Optional Resolve Options.
 *
 * @template TType Type of instance.
 */
export type OptionalResolveOptions<TType> = ResolveOptionsBase<TType> & {
  /** `true` if the resolution is optional, `false` otherwise. */
  optional: true;
};

/**
 * Resolve Options.
 *
 * @template TType Type of instance.
 */
export type ResolveOptions<TType> = RequiredResolveOptions<TType> | OptionalResolveOptions<TType>;

/** Dependency Injection Container Interface. */
export interface IDependencyInjectionContainer {
  /**
   * Register a dependency with {@link ClassInjectionProvider}
   *
   * @overload
   * @template TType Type of instance to register.
   * @param options Class Register Options.
   */
  register<TType>(options: ClassRegisterOptions<TType>): void;
  /**
   * Register a dependency with {@link ValueInjectionProvider}
   *
   * @overload
   * @template TType Type of instance to register.
   * @param options Value Register Options.
   */
  register<TType>(options: ValueRegisterOptions<TType>): void;
  /**
   * Register a dependency with {@link FactoryInjectionProvider}
   *
   * @overload
   * @template TType Type of instance to register.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param options Factory Register Options.
   */
  register<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjects>,
  ): void;

  /**
   * Unregister a dependency.
   *
   * @template TType Type of instance to unregister.
   * @param token Injection Token.
   */
  unregister<TType>(token: InjectionToken<TType>): void;

  /**
   * Check if the container has a registration for the token.
   *
   * @param token Injection Token.
   *
   * @returns `true` if the container has a registration for the token, `false` otherwise.
   */
  isRegistered<TType>(token: InjectionToken<TType>): boolean;

  /** Clear all registered dependencies. */
  clear(): void;

  /**
   * Resolve a dependency.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param token Injection Token.
   *
   * @returns Resolved instance.
   */
  resolve<TType>(token: InjectionToken<TType>): TType;
  /**
   * Resolve a dependency.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param options Resolve Options.
   *
   * @returns Resolved instance.
   */
  resolve<TType>(options: RequiredResolveOptions<TType>): TType;
  /**
   * Optional Resolves a dependency.\
   * Return `undefined` if the token is not registered.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param options Optional Resolve Options.
   *
   * @returns If the token is not registered, `undefined`, otherwise Resolved instance.
   */
  resolve<TType>(options: OptionalResolveOptions<TType>): TType | undefined;
}
