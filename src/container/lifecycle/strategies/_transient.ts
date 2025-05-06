import type { ILifecycleStrategy, LifecycleStrategyResolveInstanceReturn } from '~/types';

/** Transient Lifecycle Strategy. */
export class TransientLifecycleStrategy implements ILifecycleStrategy {
  /** @inheritdoc */
  public store(): void {
    // Do nothing
  }

  /** @inheritdoc */
  public resolve<TType>(): LifecycleStrategyResolveInstanceReturn<TType> {
    return [false];
  }
}
