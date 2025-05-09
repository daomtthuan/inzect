import type { Class } from 'type-fest';
import type { ClassInjectionProvider, InjectConstructorParameterOptions, IProviderResolverStrategy } from '~/types';
import type { Container } from '../../../_container';

import { MetadataKey } from '~/constants';

/** Class Provider Resolver Strategy. */
export class ClassProviderResolverStrategy implements IProviderResolverStrategy {
  /** @inheritdoc */
  public resolve<TType>(container: Container, provider: ClassInjectionProvider<TType>): TType {
    return this.#constructInstance(container, provider.useClass);
  }

  #constructInstance<TType>(container: Container, constructor: Class<TType>): TType {
    const args = this.#getInjectConstructorParameterOptions(constructor).map((options) => container.resolveInstance(options));
    return new constructor(...args);
  }

  #getInjectConstructorParameterOptions<TType>(constructor: Class<TType>): InjectConstructorParameterOptions<TType> {
    const options = constructor[Symbol.metadata]?.[MetadataKey.InjectConstructorParameterOptions];
    if (!options || !Array.isArray(options)) {
      return [];
    }

    return options;
  }
}
