import type { InjectionLifecycle } from './_lifecycle';
import type { ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from './_provider';
import type { ResolutionContext } from './_resolution';
import type { InjectionToken } from './_token';

/**
 * Register Options Base.
 *
 * @template TType Type of instance.
 * @template TProvider Injection Provider.
 */
export interface RegisterOptionsBase<TType, TProvider extends InjectionProvider<TType> = InjectionProvider<TType>> {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /** Injection Provider. */
  provider: TProvider;

  /**
   * Injection Lifecycle Scope.
   *
   * @default InjectionLifecycle.Singleton
   */
  scope?: InjectionLifecycle;
}

/**
 * Class Register Options.
 *
 * @template TType Type of instance.
 */
export interface ClassRegisterOptions<TType> extends RegisterOptionsBase<TType, ClassInjectionProvider<TType>> {}

/**
 * Value Register Options.
 *
 * @template TType Type of instance.
 */
export interface ValueRegisterOptions<TType> extends RegisterOptionsBase<TType, ValueInjectionProvider<TType>> {}

/**
 * Factory Register Options.
 *
 * @template TType Type of instance.
 */
export interface FactoryRegisterOptions<TType> extends RegisterOptionsBase<TType, FactoryInjectionProvider<TType>> {}

/**
 * Register Options.
 *
 * @template TType Type of instance.
 */
export type RegisterOptions<TType> = ClassRegisterOptions<TType> | ValueRegisterOptions<TType> | FactoryRegisterOptions<TType>;

/**
 * Resolve Options Base.
 *
 * @template TType Type of instance.
 */
interface ResolveOptionsBase<TType> {
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
  /**
   * `true` if the resolution is optional, `false` otherwise.
   *
   * @default false
   */
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
   * @param options Factory Register options.
   */
  register<TType>(options: FactoryRegisterOptions<TType>): void;

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
