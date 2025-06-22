import type { Container } from '~/container';
import type { ProviderResolverStrategy, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { FactoryInjectionProvider } from '~/types/provider';
import type { InjectionToken } from '~/types/token';

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
    _token: InjectionToken<TType>,
    provider: FactoryInjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    isAsync: boolean,
  ): TType | Promise<TType> {
    // Resolve synchronously
    if (!isAsync) {
      const dependencies = this.#resolveDependencies(provider, context);
      return provider.useFactory(...dependencies);
    }

    // Resolve asynchronously
    return (async () => {
      const dependencies = await this.#resolveDependenciesAsync(provider, context);
      return Promise.resolve(provider.useFactory(...dependencies));
    })();
  }

  #resolveDependencies<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: FactoryInjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): TDependencies {
    const dependencies =
      provider.inject?.map((inject) => {
        const { token, optional } = InjectorHelper.normalizeInjectParameter(inject);
        return this.#container.resolveWithContext(token, optional, context, false);
      }) ?? [];

    return dependencies as TDependencies;
  }

  async #resolveDependenciesAsync<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: FactoryInjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): Promise<TDependencies> {
    const dependencies = await Promise.all(
      provider.inject?.map(async (inject) => {
        const { token, optional } = InjectorHelper.normalizeInjectParameter(inject);
        return this.#container.resolveWithContext(token, optional, context, true);
      }) ?? [],
    );

    return dependencies as TDependencies;
  }
}
