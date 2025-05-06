import type { ILifecycleResolverStrategy, InjectTokenOrOptions, LifecycleResolverOptions, LifecycleResolverResolveReturn } from '~/types';

/** Singleton Lifecycle Resolver Strategy. */
export class SingletonLifecycleResolverStrategy implements ILifecycleResolverStrategy {
  /** @inheritdoc */
  public store<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    instance: TType,
    options: LifecycleResolverOptions<TType, TDependencies, TInjects>,
  ): void {
    options.registration.instance = instance;
  }

  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleResolverOptions<TType, TDependencies, TInjects>,
  ): LifecycleResolverResolveReturn<TType> {
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
