import type { ILifecycleResolverStrategy, LifecycleStrategyResolveInstanceReturn } from '~/types';

/** Transient Lifecycle Resolver Strategy. */
export class TransientLifecycleResolverStrategy implements ILifecycleResolverStrategy {
  /** @inheritdoc */
  public store(): void {
    // Do nothing
  }

  /** @inheritdoc */
  public resolve<TType>(): LifecycleStrategyResolveInstanceReturn<TType> {
    return {
      isResolved: false,
    };
  }
}
