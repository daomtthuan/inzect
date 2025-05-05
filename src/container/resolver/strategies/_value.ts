import type { IResolverStrategy, ValueInjectionProvider } from '~/types';
import type { Container } from '../../_container';

/** Value Resolver Strategy. */
export class ValueResolverStrategy implements IResolverStrategy {
  /** @inheritdoc */
  public resolve<TType>(_container: Container, provider: ValueInjectionProvider<TType>): TType {
    return provider.useValue;
  }
}
