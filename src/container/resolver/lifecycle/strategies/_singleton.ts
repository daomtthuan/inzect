import type {
  ILifecycleResolverStrategy,
  InjectTokenOrOptions,
  LifecycleStrategyResolveInstanceOptions,
  LifecycleStrategyResolveInstanceReturn,
  LifecycleStrategyStoreInstanceOptions,
} from '~/types';

/** Singleton Lifecycle Resolver Strategy. */
export class SingletonLifecycleResolverStrategy implements ILifecycleResolverStrategy {
  /** @inheritdoc */
  public store<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyStoreInstanceOptions<TType, TDependencies, TInjects>,
  ): void {
    options.registration.instance = options.instance;
  }

  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyResolveInstanceOptions<TType, TDependencies, TInjects>,
  ): LifecycleStrategyResolveInstanceReturn<TType> {
    if ('instance' in options.registration) {
      const instance = options.registration.instance;

      return {
        isResolved: true,
        instance,
      };
    }

    return {
      isResolved: false,
    };
  }
}
