import type {
  ILifecycleResolverStrategy,
  InjectTokenOrOptions,
  LifecycleStrategyResolveInstanceOptions,
  LifecycleStrategyResolveInstanceReturn,
  LifecycleStrategyStoreInstanceOptions,
} from '~/types';

/** Resolution Lifecycle Resolver Strategy. */
export class ResolutionLifecycleResolverStrategy implements ILifecycleResolverStrategy {
  /** @inheritdoc */
  public store<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyStoreInstanceOptions<TType, TDependencies, TInjects>,
  ): void {
    options.context.setInstance(options.token, options.instance);
  }

  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyResolveInstanceOptions<TType, TDependencies, TInjects>,
  ): LifecycleStrategyResolveInstanceReturn<TType> {
    if (options.context.hasInstance(options.token)) {
      const instance = options.context.getInstance(options.token);

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
