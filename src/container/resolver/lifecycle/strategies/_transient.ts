import type { ILifecycleResolverStrategy, LifecycleResolverResolveReturn } from '~/types';

/** Transient Lifecycle Resolver Strategy. */
export class TransientLifecycleResolverStrategy implements ILifecycleResolverStrategy {
  /** @inheritdoc */
  public store(): void {
    // Do nothing
  }

  /** @inheritdoc */
  public resolve<TType>(): LifecycleResolverResolveReturn<TType> {
    return {
      isResolved: false,
    };
  }
}
