import type { LifecycleResolveResult, LifecycleResolverStrategy, Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

/** Resolution Lifecycle Resolver Strategy. */
export class ResolutionLifecycleResolverStrategy implements LifecycleResolverStrategy {
  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    _registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): LifecycleResolveResult<TType> {
    if (context.hasInstance(token)) {
      const instance = context.getInstance(token);

      return {
        isResolved: true,
        instance,
      };
    }

    return {
      isResolved: false,
    };
  }

  /** @inheritdoc */
  public store<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    _registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
    instance: TType,
  ): void {
    context.setInstance(token, instance);
  }
}
