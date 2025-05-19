import type { Container } from '~/container';
import type { ProviderResolverStrategy, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { FactoryInjectionProvider } from '~/types/provider';

import { InjectorHelper } from '~/helpers';

/** Factory Provider Resolver Strategy. */
export class FactoryProviderResolverStrategy implements ProviderResolverStrategy {
  readonly #container: Container;

  /** @param container Container reference. */
  public constructor(container: Container) {
    this.#container = container;
  }

  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: FactoryInjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): TType {
    const dependencies: TDependencies = (provider.inject?.map((inject) => {
      const { token, optional } = InjectorHelper.normalizeInjectParameter(inject);

      return this.#container._resolveWithContext(token, optional, context);
    }) ?? []) as TDependencies;

    return provider.useFactory(...dependencies);
  }
}
