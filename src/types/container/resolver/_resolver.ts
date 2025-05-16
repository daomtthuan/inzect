import type { Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

/** Dependency Injection Resolver. */
export interface DependencyInjectionResolver {
  /**
   * Resolve Registration.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param registration Registration.
   * @param context Resolution context.
   *
   * @returns Instance.
   */
  resolveRegistration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): TType;

  /**
   * Resolve Unregistered.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   * @param optional Optional.
   * @param context Resolution context.
   *
   * @returns Instance.
   */
  resolveUnregistered<TType>(token: InjectionToken<TType>, optional: boolean, context: ResolutionContext): TType | undefined;
}
