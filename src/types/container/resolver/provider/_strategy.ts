import type { ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionProvider } from '~/types/provider';

/** Provider Resolver Strategy. */
export interface ProviderResolverStrategy {
  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param provider Provider.
   * @param context Resolution context.
   *
   * @returns Instance.
   */
  resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): TType;
}
