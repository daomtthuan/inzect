import type {
  ILifecycleStrategy,
  InjectTokenOrOptions,
  LifecycleStrategyResolveInstanceOptions,
  LifecycleStrategyResolveInstanceReturn,
  LifecycleStrategyStoreInstanceOptions,
} from '~/types';

/** Resolution Lifecycle Strategy. */
export class ResolutionLifecycleStrategy implements ILifecycleStrategy {
  /** @inheritdoc */
  public storeInstance<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyStoreInstanceOptions<TType, TDependencies, TInjects>,
  ): void {
    options.context.setInstance(options.token, options.instance);
  }

  /** @inheritdoc */
  public resolveInstance<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyResolveInstanceOptions<TType, TDependencies, TInjects>,
  ): LifecycleStrategyResolveInstanceReturn<TType> {
    if (options.context.hasInstance(options.token)) {
      return [true, options.context.getInstance(options.token)];
    }

    return [false];
  }
}
