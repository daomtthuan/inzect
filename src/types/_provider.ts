import type { Class } from 'type-fest';
import type { InjectTokenOrOptions } from './_decorator';

/**
 * Class Injection Provider.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionProvider<TType> = {
  /** Provide a class. */
  useClass: Class<TType>;
};

/**
 * Value Injection Provider.
 *
 * @template TType Type of instance.
 */
export type ValueInjectionProvider<TType> = {
  /** Provide a value. */
  useValue: TType;
};

/**
 * Factory Injection Provider.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type FactoryInjectionProvider<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]> = {
  /** Inject dependencies. */
  inject?: TInjects;

  /**
   * Provide a factory.
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
export type InjectionProvider<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]> =
  | ClassInjectionProvider<TType>
  | ValueInjectionProvider<TType>
  | FactoryInjectionProvider<TType, TDependencies, TInjects>;
