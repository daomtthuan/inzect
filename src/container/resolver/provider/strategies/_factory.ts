import type { FactoryInjectionProvider, InjectTokenOrOptions, IProviderResolverStrategy } from '~/types';
import type { Container } from '../../../_container';

/** Factory Provider Resolver Strategy. */
export class FactoryProviderResolverStrategy implements IProviderResolverStrategy {
  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    container: Container,
    provider: FactoryInjectionProvider<TType, TDependencies, TInjects>,
  ): TType {
    const dependencies = (provider.inject?.map((inject) => container.resolveInstance(inject)) ?? []) as TDependencies;
    return provider.useFactory(...dependencies);
  }
}
