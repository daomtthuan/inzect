import type { Class } from 'type-fest';
import type { InjectionProvider, InjectTokenOrOptions, IResolverStrategy } from '~/types';

import { ArgumentError } from '~/errors';
import { ProviderHelper } from '~/helpers';
import { ClassResolverStrategy } from './strategies/_class';
import { FactoryResolverStrategy } from './strategies/_factory';
import { ValueResolverStrategy } from './strategies/_value';

/** Resolver Strategy Factory. */
export class ResolverStrategyFactory {
  static readonly #strategyInstances: WeakMap<Class<IResolverStrategy>, IResolverStrategy> = new WeakMap();

  /**
   * Get Resolver Strategy.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param provider Provider.
   *
   * @returns Resolver Strategy.
   */
  public static get<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): IResolverStrategy {
    const strategyConstructor = ResolverStrategyFactory.#getStrategyConstructor(provider);
    if (!ResolverStrategyFactory.#strategyInstances.has(strategyConstructor)) {
      ResolverStrategyFactory.#strategyInstances.set(strategyConstructor, new strategyConstructor());
    }

    return ResolverStrategyFactory.#strategyInstances.get(strategyConstructor)!;
  }

  static #getStrategyConstructor<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): Class<IResolverStrategy> {
    if (ProviderHelper.isClassProvider(provider)) {
      return ClassResolverStrategy;
    }

    if (ProviderHelper.isValueProvider(provider)) {
      return ValueResolverStrategy;
    }

    if (ProviderHelper.isFactoryProvider(provider)) {
      return FactoryResolverStrategy;
    }

    throw new ArgumentError({
      argument: provider,
      message: 'Invalid provider',
    });
  }
}
