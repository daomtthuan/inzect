import type { InjectOptions } from './_decorator';
import type { InjectionToken } from './_token';
import type { _ClassType } from './_type';

/**
 * Class Injection Provider.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionProvider<TType> = {
  /** Provides a class. */
  useClass: _ClassType<TType>;
};

/**
 * Value Injection Provider.
 *
 * @template TType Type of instance.
 */
export type ValueInjectionProvider<TType> = {
  /** Provides a value. */
  useValue: TType;
};

/**
 * Factory Injection Provider.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type FactoryInjectionProvider<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]> = {
  /** Injects dependencies. */
  inject?: TInjects;

  /**
   * Provides a factory.
   *
   * @param container Dependency Injection Container.
   *
   * @returns Instance to provide.
   */
  useFactory: (...dependencies: TDependencies) => TType;
};

/**
 * Injection Provider.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type InjectionProvider<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]> =
  | ClassInjectionProvider<TType>
  | ValueInjectionProvider<TType>
  | FactoryInjectionProvider<TType, TDependencies, TInjects>;
