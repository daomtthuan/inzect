import type { ProviderResolverStrategy, ResolutionContext } from '~/types/container';
import type { ValueInjectionProvider } from '~/types/provider';
import type { InjectionToken } from '~/types/token';

/** Value Provider Resolver Strategy. */
export class ValueProviderResolverStrategy implements ProviderResolverStrategy {
  /** @inheritdoc */
  public resolve<TType>(
    _token: InjectionToken<TType>,
    provider: ValueInjectionProvider<TType>,
    _context: ResolutionContext,
    _isAsync: boolean,
  ): TType | Promise<TType> {
    return provider.useValue;
  }
}
