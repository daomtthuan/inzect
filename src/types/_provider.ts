import type { IDependencyInjectionContainer } from './_container';
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
 */
export type FactoryInjectionProvider<TType> = {
  /**
   * Provides a factory.
   *
   * @param container Dependency Injection Container.
   *
   * @returns Instance to provide.
   */
  useFactory: (container: IDependencyInjectionContainer) => TType;
};

/**
 * Injection Provider.
 *
 * @template TType Type of instance.
 */
export type InjectionProvider<TType> = ClassInjectionProvider<TType> | ValueInjectionProvider<TType> | FactoryInjectionProvider<TType>;
