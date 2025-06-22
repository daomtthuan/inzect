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
    isAsync: boolean,
  ): TType | Promise<TType> {
    const lifecycleResolver = this.#lifecycleResolverFactory.get(registration.scope);
    const result = lifecycleResolver.resolve(token, registration, context);
    if (result.isResolved) {
      return result.instance;
    }

    const providerResolver = this.#providerResolverFactory.get(registration.provider);

    // Resolve synchronously
    if (!isAsync) {
      const instance = providerResolver.resolve(token, registration.provider, context, false);
      lifecycleResolver.store(token, registration, context, instance);
      return instance;
    }

    // Resolve asynchronously
    return (async () => {
      const instance = await providerResolver.resolve(token, registration.provider, context, true);
      lifecycleResolver.store(token, registration, context, instance);
      return instance;
    })();
  }

  /** @inheritdoc */
  public resolveUnregistered<TType>(
    token: InjectionToken<TType>,
    optional: boolean,
    context: ResolutionContext,
    isAsync: boolean,
  ): TType | undefined | Promise<TType | undefined> {
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

      // Resolve synchronously
      if (!isAsync) {
        return providerResolver.resolve(token, provider, context, false);
      }

      // Resolve asynchronously
      return providerResolver.resolve(token, provider, context, true);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to resolve invalid token`,
    });
  }
}
