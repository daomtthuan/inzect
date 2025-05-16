import type { Container } from '~/container';
import type { DependencyInjectionResolver, Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { ClassInjectionProvider } from '~/types/provider';
import type { InjectionToken } from '~/types/token';

import { ResolutionError } from '~/errors';
import { TokenHelper, TypeHelper } from '~/helpers';
import { LifecycleResolverFactory } from './lifecycle';
import { ProviderResolverFactory } from './provider';

/** Dependency Injection Resolver. */
export class Resolver implements DependencyInjectionResolver {
  readonly #lifecycleResolverFactory: LifecycleResolverFactory;
  readonly #providerResolverFactory: ProviderResolverFactory;

  /** @param container Container reference. */
  public constructor(container: Container) {
    this.#lifecycleResolverFactory = new LifecycleResolverFactory();
    this.#providerResolverFactory = new ProviderResolverFactory(container);
  }

  /** @inheritdoc */
  public resolveRegistration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
    context: ResolutionContext,
  ): TType {
    const lifecycleResolver = this.#lifecycleResolverFactory.get(registration.scope);
    const result = lifecycleResolver.resolve(token, registration, context);
    if (result.isResolved) {
      return result.instance;
    }

    const providerResolver = this.#providerResolverFactory.get(registration.provider);
    const instance = providerResolver.resolve(registration.provider, context);
    lifecycleResolver.store(token, registration, context, instance);

    return instance;
  }

  /** @inheritdoc */
  public resolveUnregistered<TType>(token: InjectionToken<TType>, optional: boolean, context: ResolutionContext): TType | undefined {
    if (TokenHelper.isPrimitiveInjectionToken(token)) {
      if (optional) {
        return undefined;
      }

      throw new ResolutionError({
        token,
        message: `Attempted to resolve unregistered token: ${TokenHelper.stringify(token)}`,
      });
    }

    // No registration found with this token. But the token is a class, try to construct an instance.
    if (TypeHelper.isClass(token)) {
      const provider: ClassInjectionProvider<TType> = {
        useClass: token,
      };

      const providerResolver = this.#providerResolverFactory.get(provider);
      return providerResolver.resolve(provider, context);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to resolve invalid token`,
    });
  }
}
