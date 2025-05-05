import type {
  ILifecycleStrategy,
  InjectTokenOrOptions,
  LifecycleStrategyResolveInstanceOptions,
  LifecycleStrategyResolveInstanceReturn,
  LifecycleStrategyStoreInstanceOptions,
} from '~/types';

/** Singleton Lifecycle Strategy. */
export class SingletonLifecycleStrategy implements ILifecycleStrategy {
  /** @inheritdoc */
  public storeInstance<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyStoreInstanceOptions<TType, TDependencies, TInjects>,
  ): void {
    options.registration.instance = options.instance;
  }

  /** @inheritdoc */
  public resolveInstance<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyResolveInstanceOptions<TType, TDependencies, TInjects>,
  ): LifecycleStrategyResolveInstanceReturn<TType> {
    if ('instance' in options.registration) {
      return [true, options.registration.instance];
    }

    return [false];
  }
}
