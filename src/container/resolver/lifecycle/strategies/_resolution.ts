import type { ILifecycleResolverStrategy, InjectTokenOrOptions, LifecycleResolverOptions, LifecycleResolverResolveReturn } from '~/types';

/** Resolution Lifecycle Resolver Strategy. */
export class ResolutionLifecycleResolverStrategy implements ILifecycleResolverStrategy {
  /** @inheritdoc */
  public store<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    instance: TType,
    options: LifecycleResolverOptions<TType, TDependencies, TInjects>,
  ): void {
    options.context.setInstance(options.token, instance);
  }

  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleResolverOptions<TType, TDependencies, TInjects>,
  ): LifecycleResolverResolveReturn<TType> {
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
