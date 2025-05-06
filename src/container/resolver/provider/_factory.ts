import type { Class } from 'type-fest';
import type { InjectionProvider, InjectTokenOrOptions, IProviderResolverStrategy } from '~/types';

import { ArgumentError } from '~/errors';
import { ProviderHelper } from '~/helpers';
import { ClassProviderResolverStrategy } from './strategies/_class';
import { FactoryProviderResolverStrategy } from './strategies/_factory';
import { ValueProviderResolverStrategy } from './strategies/_value';

/** Provider Resolver Strategy Factory. */
export class ProviderResolverStrategyFactory {
  static readonly #strategyInstances: WeakMap<Class<IProviderResolverStrategy>, IProviderResolverStrategy> = new WeakMap();

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
  ): IProviderResolverStrategy {
    const strategyConstructor = ProviderResolverStrategyFactory.#getStrategyConstructor(provider);
    if (!ProviderResolverStrategyFactory.#strategyInstances.has(strategyConstructor)) {
      ProviderResolverStrategyFactory.#strategyInstances.set(strategyConstructor, new strategyConstructor());
    }

    return ProviderResolverStrategyFactory.#strategyInstances.get(strategyConstructor)!;
  }

  static #getStrategyConstructor<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): Class<IProviderResolverStrategy> {
    if (ProviderHelper.isClassProvider(provider)) {
      return ClassProviderResolverStrategy;
    }

    if (ProviderHelper.isValueProvider(provider)) {
      return ValueProviderResolverStrategy;
    }

    if (ProviderHelper.isFactoryProvider(provider)) {
      return FactoryProviderResolverStrategy;
    }

    throw new ArgumentError({
      argument: provider,
      message: 'Invalid provider',
    });
  }
}
