import type { Class } from 'type-fest';
import type { ILifecycleStrategy } from '~/types';

import { Lifecycle } from '~/constants';
import { ArgumentError } from '~/errors';
import { ResolutionLifecycleStrategy } from './strategies/_resolution';
import { SingletonLifecycleStrategy } from './strategies/_singleton';
import { TransientLifecycleStrategy } from './strategies/_transient';

/** Lifecycle Strategy Factory. */
export class LifecycleStrategyFactory {
  static readonly #strategyInstances: WeakMap<Class<ILifecycleStrategy>, ILifecycleStrategy> = new WeakMap();

  /**
   * Get Lifecycle Strategy.
   *
   * @param scope Lifecycle Scope.
   *
   * @returns Lifecycle Strategy.
   */
  public static get(scope: Lifecycle): ILifecycleStrategy {
    const strategyConstructor = LifecycleStrategyFactory.#getStrategyConstructor(scope);
    if (!LifecycleStrategyFactory.#strategyInstances.has(strategyConstructor)) {
      LifecycleStrategyFactory.#strategyInstances.set(strategyConstructor, new strategyConstructor());
    }

    return LifecycleStrategyFactory.#strategyInstances.get(strategyConstructor)!;
  }

  static #getStrategyConstructor(scope: Lifecycle): Class<ILifecycleStrategy> {
    switch (scope) {
      case Lifecycle.Singleton: {
        return SingletonLifecycleStrategy;
      }

      case Lifecycle.Transient: {
        return TransientLifecycleStrategy;
      }

      case Lifecycle.Resolution: {
        return ResolutionLifecycleStrategy;
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
