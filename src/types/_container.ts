import type { InjectionLifecycle } from './_lifecycle';
import type { InjectionProvider } from './_provider';
import type { ResolutionContext } from './_resolution';
import type { InjectionToken } from './_token';

/**
 * Register Options.
 *
 * @template TType Type of instance.
 */
export interface RegisterOptions<TType> {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /** Injection Provider. */
  provider: InjectionProvider<TType>;

  /**
   * Injection Lifecycle Scope.
   *
   * @default InjectionLifecycle.Singleton
   */
  scope?: InjectionLifecycle;
}

/**
 * Resolve Options Base.
 *
 * @template TType Type of instance.
 */
export interface ResolveOptionsBase<TType> {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /**
   * Resolution context.\
   * If not provided, the internal resolution context will be used.
   */
  context?: ResolutionContext;
}

/**
 * Default Resolve Options.
 *
 * @template TType Type of instance.
 */
export interface DefaultResolveOptions<TType> extends ResolveOptionsBase<TType> {
  /** `true` if the resolution is optional, `false` otherwise. */
  optional?: false;
}

/**
 * Optional Resolve Options.
 *
 * @template TType Type of instance.
 */
export interface OptionalResolveOptions<TType> extends ResolveOptionsBase<TType> {
  /** `true` if the resolution is optional, `false` otherwise. */
  optional: true;
}

/**
 * Resolve Options.
 *
 * @template TType Type of instance.
 */
export type ResolveOptions<TType> = DefaultResolveOptions<TType> | OptionalResolveOptions<TType>;

/** Dependency Injection Container. */
export interface DependencyInjectionContainer {
  /**
   * Registers a dependency.
   *
   * @template TType Type of instance to register.
   * @param options Register options.
   */
  register<TType>(options: RegisterOptions<TType>): void;

  /**
   * Resolves a dependency.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param options Resolve options.
   *
   * @returns Resolved instance.
   */
  resolve<TType>(options: DefaultResolveOptions<TType>): TType;

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
}
