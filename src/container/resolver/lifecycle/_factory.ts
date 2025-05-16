import type { Class } from 'type-fest';
import type { LifecycleResolverStrategy } from '~/types/container';

import { Lifecycle } from '~/constants';
import { ArgumentError } from '~/errors';
import { ResolutionLifecycleResolverStrategy, SingletonLifecycleResolverStrategy, TransientLifecycleResolverStrategy } from './strategies';

/** Lifecycle Resolver Factory. */
export class LifecycleResolverFactory {
  readonly #strategyInstances: WeakMap<Class<LifecycleResolverStrategy>, LifecycleResolverStrategy>;

  public constructor() {
    this.#strategyInstances = new WeakMap();
  }

  /**
   * Get Lifecycle Strategy.
   *
   * @param scope Lifecycle Scope.
   *
   * @returns Lifecycle Strategy.
   */
  public get(scope: Lifecycle): LifecycleResolverStrategy {
    const LifecycleResolver = this.#getStrategyConstructor(scope);
    if (!this.#strategyInstances.has(LifecycleResolver)) {
      this.#strategyInstances.set(LifecycleResolver, new LifecycleResolver());
    }

    return this.#strategyInstances.get(LifecycleResolver)!;
  }

  #getStrategyConstructor(scope: Lifecycle): Class<LifecycleResolverStrategy> {
    switch (scope) {
      case Lifecycle.Singleton: {
        return SingletonLifecycleResolverStrategy;
      }

      case Lifecycle.Transient: {
        return TransientLifecycleResolverStrategy;
      }

      case Lifecycle.Resolution: {
        return ResolutionLifecycleResolverStrategy;
      }

      default: {
        throw new ArgumentError({
          argument: scope,
          message: 'Invalid scope',
        });
      }
    }
  }
}
