import type { Class } from 'type-fest';
import type { ILifecycleResolverStrategy } from '~/types';

import { Lifecycle } from '~/constants';
import { ArgumentError } from '~/errors';
import { ResolutionLifecycleResolverStrategy } from './strategies/_resolution';
import { SingletonLifecycleResolverStrategy } from './strategies/_singleton';
import { TransientLifecycleResolverStrategy } from './strategies/_transient';

/** Lifecycle Resolver Strategy Factory. */
export class LifecycleResolverStrategyFactory {
  static readonly #strategyInstances: WeakMap<Class<ILifecycleResolverStrategy>, ILifecycleResolverStrategy> = new WeakMap();

  /**
   * Get Lifecycle Strategy.
   *
   * @param scope Lifecycle Scope.
   *
   * @returns Lifecycle Strategy.
   */
  public static get(scope: Lifecycle): ILifecycleResolverStrategy {
    const strategyConstructor = LifecycleResolverStrategyFactory.#getStrategyConstructor(scope);
    if (!LifecycleResolverStrategyFactory.#strategyInstances.has(strategyConstructor)) {
      LifecycleResolverStrategyFactory.#strategyInstances.set(strategyConstructor, new strategyConstructor());
    }

    return LifecycleResolverStrategyFactory.#strategyInstances.get(strategyConstructor)!;
  }

  static #getStrategyConstructor(scope: Lifecycle): Class<ILifecycleResolverStrategy> {
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
