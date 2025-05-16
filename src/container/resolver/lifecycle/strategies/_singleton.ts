import type { LifecycleResolveResult, LifecycleResolverStrategy, Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

/** Singleton Lifecycle Resolver Strategy. */
export class SingletonLifecycleResolverStrategy implements LifecycleResolverStrategy {
  /** @inheritdoc */
  public resolve<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    _token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
  ): LifecycleResolveResult<TType> {
    if ('instance' in registration && registration.instance !== undefined) {
      const instance = registration.instance;

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
    _token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    _context: ResolutionContext,
    instance: TType,
  ): void {
    registration.instance = instance;
  }
}
