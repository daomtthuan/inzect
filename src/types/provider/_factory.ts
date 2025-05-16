import type { InjectParameter } from '~/types/injector';

/**
 * Factory Injection Provider.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type FactoryInjectionProvider<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> = {
  /** Inject dependencies. */
  inject?: TInjectParameters;

  /**
   * Provide a factory.
   *
   * @param container Dependency Injection Container.
   *
   * @returns Instance to provide.
   */
  useFactory: (...dependencies: TDependencies) => TType;
};
