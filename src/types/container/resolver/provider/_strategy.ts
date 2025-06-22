import type { ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionProvider } from '~/types/provider';
import type { InjectionToken } from '~/types/token';

/** Provider Resolver Strategy. */
export interface ProviderResolverStrategy {
  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param provider Provider.
   * @param context Resolution context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Instance.
   */
  resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    isAsync: false,
  ): TType;
  /**
   * Resolve instance asynchronously.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param provider Provider.
   * @param context Resolution context.
   *
   * @returns Instance.
   */
  resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    provider: InjectionProvider<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    isAsync: true,
  ): Promise<TType>;
}
