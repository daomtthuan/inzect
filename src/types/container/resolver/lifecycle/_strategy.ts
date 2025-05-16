import type { Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';
import type { LifecycleResolveResult } from './_contract';

/** Lifecycle Resolver Strategy. */
export interface LifecycleResolverStrategy {
  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param registration Registration.
   * @param context Resolution context.
   *
   * @returns Resolved Instance return.
   */
  resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): LifecycleResolveResult<TType>;

  /**
   * Store instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param registration Registration.
   * @param context Resolution context.
   * @param instance Instance to store.
   */
  store<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    instance: TType,
  ): void;
}
