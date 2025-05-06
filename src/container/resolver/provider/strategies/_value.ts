import type { IProviderResolverStrategy, ValueInjectionProvider } from '~/types';
import type { Container } from '../../../_container';

/** Value Provider Resolver Strategy. */
export class ValueProviderResolverStrategy implements IProviderResolverStrategy {
  /** @inheritdoc */
  public resolve<TType>(_container: Container, provider: ValueInjectionProvider<TType>): TType {
    return provider.useValue;
  }
}
