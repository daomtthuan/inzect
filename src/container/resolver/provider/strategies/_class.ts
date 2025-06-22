import type { Container } from '~/container';
import type { ProviderResolverStrategy, ResolutionContext } from '~/types/container';
import type { Class } from '~/types/core';
import type { NormalizedInjectParameter } from '~/types/injector';
import type { ClassInjectionProvider } from '~/types/provider';
import type { InjectionToken } from '~/types/token';

import { MetadataKey } from '~/constants';
import { InjectorHelper } from '~/helpers';

/** Class Provider Resolver Strategy. */
export class ClassProviderResolverStrategy implements ProviderResolverStrategy {
  readonly #container: Container;

  /** @param container Container reference. */
  public constructor(container: Container) {
    this.#container = container;
  }

  /** @inheritdoc */
  public resolve<TType>(
    _token: InjectionToken<TType>,
    provider: ClassInjectionProvider<TType>,
    context: ResolutionContext,
    isAsync: boolean,
  ): TType | Promise<TType> {
    const Instance = provider.useClass;
    const injects = this.#getInjectParameters(Instance);

    // Resolve synchronously
    if (!isAsync) {
      const args = injects.map(({ token, optional }) => this.#container.resolveWithContext(token, optional, context, false));
      return new Instance(...args);
    }

    // Resolve asynchronously
    return (async () => {
      const args = await Promise.all(injects.map(async ({ token, optional }) => this.#container.resolveWithContext(token, optional, context, true)));
      return new Instance(...args);
    })();
  }

  #getInjectParameters<TType>(constructor: Class<TType>): NormalizedInjectParameter<TType>[] {
    const metadata = constructor[Symbol.metadata]?.[MetadataKey.InjectConstructorParameter];
    if (!metadata || !Array.isArray(metadata)) {
      return [];
    }

    return metadata.map((inject) => InjectorHelper.normalizeInjectParameter(inject));
  }
}
