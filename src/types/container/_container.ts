import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';
import type { ClassRegisterOptions, FactoryRegisterOptions, ValueRegisterOptions } from './registry';

/** Dependency Injection Container. */
export interface DependencyInjectionContainer {
  /**
   * Create a child container.
   *
   * @returns Child container.
   */
  createChild(): DependencyInjectionContainer;

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
   * @template TInjectParameters Inject parameter types.
   * @param options Factory Register Options.
   */
  register<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjectParameters>,
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
   * @param optional If `true`, returns `undefined` if the token is not registered.
   *
   * @returns Resolved instance.
   */
  resolve<TType>(token: InjectionToken<TType>, optional?: false): TType;
  /**
   * Optional Resolves a dependency.\
   * Return `undefined` if the token is not registered.
   *
   * @overload
   * @template TType Type of instance to resolve.
   * @param token Injection Token.
   * @param optional If `true`, returns `undefined` if the token is not registered.
   *
   * @returns If the token is not registered, `undefined`, otherwise Resolved instance.
   */
  resolve<TType>(token: InjectionToken<TType>, optional: true): TType | undefined;
}
