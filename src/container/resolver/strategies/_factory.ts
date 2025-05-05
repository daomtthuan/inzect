import type { FactoryInjectionProvider, InjectTokenOrOptions, IResolverStrategy } from '~/types';
import type { Container } from '../../_container';

/** Factory Resolver Strategy. */
export class FactoryResolverStrategy implements IResolverStrategy {
  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    container: Container,
    provider: FactoryInjectionProvider<TType, TDependencies, TInjects>,
  ): TType {
    const dependencies = (provider.inject?.map((inject) => container.resolveInstance(inject)) ?? []) as TDependencies;
    return provider.useFactory(...dependencies);
  }
}
