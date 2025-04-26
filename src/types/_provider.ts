import type { Class } from 'type-fest';
import type { DependencyInjectionContainer } from './_container';

/**
 * Class Injection Provider.
 *
 * @template TType Type of instance.
 */
export interface ClassInjectionProvider<TType> {
  /** Provides a class. */
  useClass: Class<TType>;
}

/**
 * Value Injection Provider.
 *
 * @template TType Type of instance.
 */
export interface ValueInjectionProvider<TType> {
  /** Provides a value. */
  useValue: TType;
}

/**
 * Factory Injection Provider.
 *
 * @template TType Type of instance.
 */
export interface FactoryInjectionProvider<TType> {
  /**
   * Provides a factory.
   *
   * @param container Dependency Injection Container.
   *
   * @returns Instance to provide.
   */
  useFactory: (container: DependencyInjectionContainer) => TType;
}

/**
 * Injection Provider.
 *
 * @template TType Type of instance.
 */
export type InjectionProvider<TType> = ClassInjectionProvider<TType> | ValueInjectionProvider<TType> | FactoryInjectionProvider<TType>;
