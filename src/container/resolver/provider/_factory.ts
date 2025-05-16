import type { Container } from '~/container';
import type { ProviderResolverStrategy } from '~/types/container';
import type { Class } from '~/types/core';
import type { InjectParameter } from '~/types/injector';
import type { InjectionProvider } from '~/types/provider';

import { ArgumentError } from '~/errors';
import { ProviderHelper } from '~/helpers';
import { ClassProviderResolverStrategy, FactoryProviderResolverStrategy, ValueProviderResolverStrategy } from './strategies';

/** Provider Resolver Factory. */
export class ProviderResolverFactory {
  readonly #strategyInstances: WeakMap<Class<ProviderResolverStrategy>, ProviderResolverStrategy>;
  readonly #container: Container;

  /** @param container Container reference. */
  public constructor(container: Container) {
    this.#strategyInstances = new WeakMap();
    this.#container = container;
  }

  /**
   * Get Resolver Strategy.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param provider Provider.
   *
   * @returns Resolver Strategy.
   */
  public get<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
  ): ProviderResolverStrategy {
    const ProviderResolver = this.#getStrategyConstructor(provider);
    if (!this.#strategyInstances.has(ProviderResolver)) {
      this.#strategyInstances.set(ProviderResolver, new ProviderResolver(this.#container));
    }

    return this.#strategyInstances.get(ProviderResolver)!;
  }

  #getStrategyConstructor<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
  ): Class<ProviderResolverStrategy> {
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
