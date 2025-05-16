import type { ProviderResolverStrategy } from '~/types/container';
import type { ValueInjectionProvider } from '~/types/provider';

/** Value Provider Resolver Strategy. */
export class ValueProviderResolverStrategy implements ProviderResolverStrategy {
  /** @inheritdoc */
  public resolve<TType>(provider: ValueInjectionProvider<TType>): TType {
    return provider.useValue;
  }
}
