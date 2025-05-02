import type { InjectOptions } from './_decorator';
import type { InjectionLifecycle } from './_lifecycle';
import type { ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from './_provider';
import type { IResolutionContext } from './_resolution';
import type { InjectionToken } from './_token';

/**
 * Register Options Base.
 *
 * @template TType Type of instance.
 * @template TProvider Injection Provider.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 * @internal
 */
type _RegisterOptionsBase<
  TType,
  TProvider extends InjectionProvider<TType, TDependencies, TInjects>,
  TDependencies extends unknown[] = never,
  TInjects extends InjectOptions<unknown>[] = never,
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
  scope?: InjectionLifecycle | undefined;
};

/**
 * Class Register Options.
 *
 * @template TType Type of instance.
 */
export type ClassRegisterOptions<TType> = _RegisterOptionsBase<TType, ClassInjectionProvider<TType>>;

/**
 * Value Register Options.
 *
 * @template TType Type of instance.
 */
export type ValueRegisterOptions<TType> = _RegisterOptionsBase<TType, ValueInjectionProvider<TType>>;

/**
 * Factory Register Options.
 *
 * @template TType Type of instance.
 */
export type FactoryRegisterOptions<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]> = _RegisterOptionsBase<
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
export type RegisterOptions<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]> =
  | ClassRegisterOptions<TType>
  | ValueRegisterOptions<TType>
  | FactoryRegisterOptions<TType, TDependencies, TInjects>;

/**
 * Resolve Options Base.
 *
 * @template TType Type of instance.
 * @internal
 */
type _ResolveOptionsBase<TType> = {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /**
   * Resolution context.\
   * If not provided, the internal resolution context will be used.
   */
  context?: IResolutionContext | undefined;
};

/**
 * Required Resolve Options.
 *
 * @template TType Type of instance.
 */
export type RequiredResolveOptions<TType> = _ResolveOptionsBase<TType> & {
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
export type OptionalResolveOptions<TType> = _ResolveOptionsBase<TType> & {
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
   * Registers a dependency with {@link ClassInjectionProvider}
   *
   * @overload
   * @template TType Type of instance to register.
   * @param options Class Register options.
   */
  register<TType>(options: ClassRegisterOptions<TType>): void;
  /**
   * Registers a dependency with {@link ValueInjectionProvider}
   *
   * @overload
   * @template TType Type of instance to register.
   * @param options Value Register options.
   */
  register<TType>(options: ValueRegisterOptions<TType>): void;
  /**
   * Registers a dependency with {@link FactoryInjectionProvider}
   *
   * @overload
   * @template TType Type of instance to register.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param options Factory Register options.
   */
  register<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjects>,
  ): void;

  /**
   * Resolves a dependency.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param token Injection Token.
   *
   * @returns Resolved instance.
   */
  resolve<TType>(token: InjectionToken<TType>): TType;
  /**
   * Resolves a dependency.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param options Resolve options.
   *
   * @returns Resolved instance.
   */
  resolve<TType>(options: RequiredResolveOptions<TType>): TType;
  /**
   * Optional Resolves a dependency.\
   * Returns `undefined` if the token is not registered.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param options Optional Resolve options.
   *
   * @returns If the token is not registered, `undefined`, otherwise Resolved instance.
   */
  resolve<TType>(options: OptionalResolveOptions<TType>): TType | undefined;

  /** Clears all registered dependencies. */
  clear(): void;
}
