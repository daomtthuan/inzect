import type { Container } from '~/container';
import type { ProviderResolverStrategy, ResolutionContext } from '~/types/container';
import type { Class } from '~/types/core';
import type { NormalizedInjectParameter } from '~/types/injector';
import type { ClassInjectionProvider } from '~/types/provider';

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
  public resolve<TType>(provider: ClassInjectionProvider<TType>, context: ResolutionContext): TType {
    const Instance = provider.useClass;
    const injects = this.#getInjectParameters(Instance);

    const args = injects.map(({ token, optional }) => this.#container.resolve(token, optional, context));
    return new Instance(...args);
  }

  #getInjectParameters<TType>(constructor: Class<TType>): NormalizedInjectParameter<TType>[] {
    const metadata = constructor[Symbol.metadata]?.[MetadataKey.InjectConstructorParameter];
    if (!metadata || !Array.isArray(metadata)) {
      return [];
    }

    return metadata.map((inject) => InjectorHelper.normalizeInjectParameter(inject));
  }
}
