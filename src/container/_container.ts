import type { Except } from 'type-fest';
import type {
  _ClassType,
  ClassInjectionProvider,
  ClassRegisterOptions,
  FactoryInjectionProvider,
  FactoryRegisterOptions,
  IDependencyInjectionContainer,
  InjectionToken,
  InjectOptions,
  IResolutionContext,
  OptionalResolveOptions,
  RegisterOptions,
  Registration,
  RequiredResolveOptions,
  ResolveOptions,
  ValueInjectionProvider,
  ValueRegisterOptions,
} from '~/types';

import { _InjectConstants } from '~/constants';
import { RegistrationError, ResolutionError } from '~/errors';
import { _InjectionTokenHelper, _ProviderHelper, _TypeHelper } from '~/helpers';
import { Lifecycle } from '~/types';
import { _Registry } from './_registry';
import { _ResolutionContext } from './_resolution-context';

/**
 * Dependency Injection Container.
 *
 * @internal
 */
export class _Container implements IDependencyInjectionContainer {
  readonly #registry = new _Registry();
  #internalResolutionContext?: IResolutionContext | undefined;

  /** @inheritdoc */
  public register<TType>(options: ClassRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType>(options: ValueRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjects>,
  ): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    options: RegisterOptions<TType, TDependencies, TInjects>,
  ): void {
    const token = options.token;

    this.#registry.set(token, {
      provider: options.provider,
      scope: options.scope ?? Lifecycle.Transient,
    });
  }

  /** @inheritdoc */
  public resolve<TType>(token: InjectionToken<TType>): TType;
  /** @inheritdoc */
  public resolve<TType>(options: RequiredResolveOptions<TType>): TType;
  /** @inheritdoc */
  public resolve<TType>(options: OptionalResolveOptions<TType>): TType | undefined;
  /** @inheritdoc */
  public resolve<TType>(tokenOrOptions: InjectionToken<TType> | ResolveOptions<TType>): TType | undefined {
    const options = this.#resolveResolveOptions(tokenOrOptions);
    const token = options.token;
    const context = this.#resolveResolutionContext(options.context);
    const optional = options.optional ?? false;

    const registration = this.#registry.get(token);
    if (!registration) {
      return this.#resolveUnregisteredRegistration(token, optional, context);
    }

    const [isResolved, instance] = this.#resolveLifecycleRegistration(token, registration, context);
    if (isResolved) {
      return instance;
    }

    return this.#resolveRegistration(token, registration, context);
  }

  /** @inheritdoc */
  public isRegistered<TType>(token: InjectionToken<TType>): boolean {
    return this.#registry.has(token);
  }

  /** @inheritdoc */
  public clear(): void {
    this.#registry.clear();
    this.#internalResolutionContext = undefined;
    _InjectionTokenHelper.primitiveKeyMap.clear();
  }

  /**
   * Internal resolve.
   *
   * @template TType Type of instance.
   * @param options Resolve Options without context.
   * @param context Resolution Context.
   *
   * @returns Resolved instance.
   * @internal
   */
  public _internalResolve<TType>(
    options: Except<ResolveOptions<TType>, 'context'>,
    context: IResolutionContext | undefined = this.#internalResolutionContext,
  ): TType | undefined {
    return !options.optional ?
        this.resolve({
          token: options.token,
          context,
        })
      : this.resolve({
          token: options.token,
          optional: true,
          context,
        });
  }

  #resolveResolutionContext(context?: IResolutionContext | undefined): IResolutionContext {
    this.#internalResolutionContext = context ?? new _ResolutionContext();
    return this.#internalResolutionContext;
  }

  #resolveResolveOptions<TType>(tokenOrOptions: InjectionToken<TType> | ResolveOptions<TType>): ResolveOptions<TType> {
    if (typeof tokenOrOptions === 'object' && 'token' in tokenOrOptions) {
      return tokenOrOptions;
    }

    return {
      token: tokenOrOptions,
    };
  }

  #resolveUnregisteredRegistration<TType>(token: InjectionToken<TType>, optional: boolean, context: IResolutionContext): TType | undefined {
    if (_InjectionTokenHelper.isPrimitiveInjectionToken(token)) {
      if (optional) {
        return undefined;
      }

      throw new ResolutionError({
        token,
        message: `Attempted to resolve unregistered token: ${_InjectionTokenHelper.stringify(token)}`,
      });
    }

    // No registration found with this token. But the token is a class, try to construct an instance.
    if (_InjectionTokenHelper.isClassInjectionToken(token)) {
      return this.#constructInstance(token, token, context);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to resolve invalid token`,
    });
  }

  #resolveLifecycleRegistration<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
    context: IResolutionContext,
  ): [isResolved: false] | [isResolved: true, instance: TType] {
    if (registration.scope === Lifecycle.Singleton && registration.instance !== undefined) {
      return [true, registration.instance];
    }

    if (registration.scope === Lifecycle.Resolution && context.hasInstance(token)) {
      return [true, context.getInstance(token)];
    }

    return [false];
  }

  #resolveRegistration<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
    context: IResolutionContext,
  ): TType {
    let instance;
    if (_ProviderHelper.isClassProvider(registration.provider)) {
      instance = this.#resolveClassRegistration(token, registration.provider, registration.scope, context);
    } else if (_ProviderHelper.isValueProvider(registration.provider)) {
      instance = this.#resolveValueRegistration(token, registration.provider, registration.scope, context);
    } else if (_ProviderHelper.isFactoryProvider(registration.provider)) {
      instance = this.#resolveFactoryRegistration(token, registration.provider, registration.scope, context);
    } else {
      throw new RegistrationError({
        token,
        registration,
        message: `Invalid registration found for token: ${_InjectionTokenHelper.stringify(token)}`,
      });
    }

    if (registration.scope === Lifecycle.Singleton) {
      registration.instance = instance;
    }

    return instance;
  }

  #resolveClassRegistration<TType>(
    token: InjectionToken<TType>,
    provider: ClassInjectionProvider<TType>,
    scope: Lifecycle,
    context: IResolutionContext,
  ): TType {
    const instance = this.#constructInstance(token, provider.useClass, context);
    if (scope === Lifecycle.Resolution) {
      context.setInstance(token, instance);
    }

    return instance;
  }

  #resolveValueRegistration<TType>(
    token: InjectionToken<TType>,
    provider: ValueInjectionProvider<TType>,
    scope: Lifecycle,
    context: IResolutionContext,
  ): TType {
    const instance = provider.useValue;
    if (scope === Lifecycle.Resolution) {
      context.setInstance(token, instance);
    }

    return instance;
  }

  #resolveFactoryRegistration<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
    provider: FactoryInjectionProvider<TType, TDependencies, TInjects>,
    scope: Lifecycle,
    context: IResolutionContext,
  ): TType {
    const dependencies = (provider.inject?.map((inject) => {
      const options = this.#resolveResolveOptions(inject);
      this._internalResolve(options, context);
    }) ?? []) as TDependencies;
    const instance = provider.useFactory(...dependencies);
    if (scope === Lifecycle.Resolution) {
      context.setInstance(token, instance);
    }

    return instance;
  }

  #constructInstance<TType>(token: InjectionToken<TType>, constructor: _ClassType<TType>, context: IResolutionContext): TType {
    if (_TypeHelper.isClass(constructor)) {
      const injectOptions = (constructor[Symbol.metadata]?.[_InjectConstants.injectClassOptions] as InjectOptions<TType>[]) ?? [];

      const args = injectOptions.map((options) => this._internalResolve(options, context));
      return new constructor(...args);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to construct not a class`,
      cause: { constructor },
    });
  }
}
