import type { LifecycleResolveResult, LifecycleResolverStrategy } from '~/types/container';

/** Transient Lifecycle Resolver Strategy. */
export class TransientLifecycleResolverStrategy implements LifecycleResolverStrategy {
  /** @inheritdoc */
  public resolve<TType>(): LifecycleResolveResult<TType> {
    return {
      isResolved: false,
    };
  }

  /** @inheritdoc */
  public store(): void {
    // Do nothing
  }
}
