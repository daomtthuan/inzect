import type { Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

/** Dependency Injection Resolver. */
export interface DependencyInjectionResolver {
  /**
   * Resolve Registration.
   *
   * @overload
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param registration Registration.
   * @param context Resolution context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Instance.
   */
  resolveRegistration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    isAsync: false,
  ): TType;
  /**
   * Resolve Registration asynchronously.
   *
   * @overload
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjectParameters Inject parameter types.
   * @param token Injection token.
   * @param registration Registration.
   * @param context Resolution context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Instance.
   */
  resolveRegistration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    isAsync: true,
  ): Promise<TType>;

  /**
   * Resolve Unregistered.
   *
   * @overload
   * @template TType Type of instance.
   * @param token Injection token.
   * @param optional Optional.
   * @param context Resolution context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Instance.
   */
  resolveUnregistered<TType>(token: InjectionToken<TType>, optional: boolean, context: ResolutionContext, isAsync: false): TType | undefined;
  /**
   * Resolve Unregistered asynchronously.
   *
   * @overload
   * @template TType Type of instance.
   * @param token Injection token.
   * @param optional Optional.
   * @param context Resolution context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Instance.
   */
  resolveUnregistered<TType>(token: InjectionToken<TType>, optional: boolean, context: ResolutionContext, isAsync: true): Promise<TType | undefined>;
}
