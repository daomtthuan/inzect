import type { ILifecycleStrategy, LifecycleStrategyResolveInstanceReturn } from '~/types';

/** Transient Lifecycle Strategy. */
export class TransientLifecycleStrategy implements ILifecycleStrategy {
  /** @inheritdoc */
  public storeInstance(): void {
    // Do nothing
  }

  /** @inheritdoc */
  public resolveInstance<TType>(): LifecycleStrategyResolveInstanceReturn<TType> {
    return [false];
  }
}
