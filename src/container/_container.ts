import type { Class } from 'type-fest';
import type {
  _ClassType,
  _InjectTokenOrOptions,
  _InternalResolveOptions,
  ClassInjectionProvider,
  ClassRegisterOptions,
  FactoryInjectionProvider,
  FactoryRegisterOptions,
  IDependencyInjectionContainer,
  InjectionToken,
  InjectTokenFactory,
  OptionalResolveOptions,
  RegisterOptions,
  Registration,
  RequiredResolveOptions,
  ResolveOptions,
  ValueInjectionProvider,
  ValueRegisterOptions,
} from '~/types';
import type { _InjectConstructorParameterOptions } from '~/types/_decorator';

import { _MetadataKey } from '~/constants';
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
  static #instance?: _Container;
  readonly #registry = new _Registry();
  readonly #internalResolutionContext = new _ResolutionContext();

  /** @inheritdoc */
  public register<TType>(options: ClassRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType>(options: ValueRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjects>,
  ): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
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
    const instance = this._internalResolve(tokenOrOptions);
    this.#internalResolutionContext.clearInstances();

    return instance;
  }

  /** @inheritdoc */
  public isRegistered<TType>(token: InjectionToken<TType>): boolean {
    return this.#registry.has(token);
  }

  /** @inheritdoc */
  public clear(): void {
    this.#registry.clear();
    this.#internalResolutionContext.clearInstances();
    _InjectionTokenHelper.primitiveKeyMap.clear();
  }

  /**
   * Resolve with internal resolution context.
   *
   * @template TType Type of instance.
   * @param arg Internal resolve argument.
   *
   * @returns Resolved instance.
   * @internal
   */
  public _internalResolve<TType>(arg: _InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | ResolveOptions<TType>): TType | undefined {
    const options = this.#resolveInternalResolveOptions(arg);
    const token = options.token;

    const registration = this.#registry.get(token);
    if (!registration) {
      return this.#resolveUnregisteredRegistration(options);
    }

    const [isResolved, instance] = this.#resolveLifecycle(token, registration);
    if (isResolved) {
      return instance;
    }

    return this.#resolveRegistration(token, registration);
  }

  #resolveInternalResolveOptions<TType>(arg: _InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | ResolveOptions<TType>): _InternalResolveOptions<TType> {
    if (typeof arg === 'object' && 'token' in arg) {
      const token = _TypeHelper.isFunction(arg.token) ? arg.token() : arg.token;

      return {
        token,
        optional: arg.optional ?? false,
      };
    }

    const token = _TypeHelper.isFunction(arg) ? arg() : arg;
    return {
      token,
      optional: false,
    };
  }

  #registerLifecycle<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
    instance: TType | undefined,
  ): void {
    switch (registration.scope) {
      case Lifecycle.Singleton: {
        registration.instance = instance;
        break;
      }

      case Lifecycle.Resolution: {
        this.#internalResolutionContext.setInstance(token, instance);
        break;
      }

      default: {
        break;
      }
    }
  }

  #resolveLifecycle<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
  ): [isResolved: false] | [isResolved: true, instance: TType | undefined] {
    if (registration.scope === Lifecycle.Singleton && 'instance' in registration) {
      return [true, registration.instance];
    }

    if (registration.scope === Lifecycle.Resolution && this.#internalResolutionContext.hasInstance(token)) {
      return [true, this.#internalResolutionContext.getInstance(token)];
    }

    return [false];
  }

  #resolveUnregisteredRegistration<TType>(options: _InternalResolveOptions<TType>): TType | undefined {
    const token = options.token;
    const optional = options.optional;

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
      return this.#constructInstance(token);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to resolve invalid token`,
    });
  }

  #resolveRegistration<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
  ): TType {
    let instance;
    if (_ProviderHelper.isClassProvider(registration.provider)) {
      instance = this.#resolveClassRegistration(registration.provider);
    } else if (_ProviderHelper.isValueProvider(registration.provider)) {
      instance = this.#resolveValueRegistration(registration.provider);
    } else if (_ProviderHelper.isFactoryProvider(registration.provider)) {
      instance = this.#resolveFactoryRegistration(registration.provider);
    } else {
      throw new RegistrationError({
        token,
        registration,
        message: `Invalid registration found for token: ${_InjectionTokenHelper.stringify(token)}`,
      });
    }

    this.#registerLifecycle(token, registration, instance);

    return instance;
  }

  #resolveClassRegistration<TType>(provider: ClassInjectionProvider<TType>): TType {
    return this.#constructInstance(provider.useClass);
  }

  #resolveValueRegistration<TType>(provider: ValueInjectionProvider<TType>): TType {
    return provider.useValue;
  }

  #resolveFactoryRegistration<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]>(
    provider: FactoryInjectionProvider<TType, TDependencies, TInjects>,
  ): TType {
    const dependencies = (provider.inject?.map((inject) => this._internalResolve(inject)) ?? []) as TDependencies;
    return provider.useFactory(...dependencies);
  }

  #constructInstance<TType>(constructor: _ClassType<TType>): TType {
    const args = this.#getInjectConstructorParameterOptions(constructor).map((options) => this._internalResolve(options));
    return new (constructor as Class<TType>)(...args);
  }

  /**
   * Get Inject Constructor Parameters Options.
   *
   * @template TType Type of instance.
   * @param constructor Class constructor.
   *
   * @returns Inject Constructor Parameters Options.
   */
  #getInjectConstructorParameterOptions<TType>(constructor: _ClassType<TType>): _InjectConstructorParameterOptions<TType> {
    const options = constructor[Symbol.metadata]?.[_MetadataKey.InjectConstructorParameterOptions];
    if (!options || !Array.isArray(options)) {
      return [];
    }

    return options;
  }

  /** @returns Container instance. */
  public static get instance(): _Container {
    if (!_Container.#instance) {
      _Container.#instance = new _Container();
    }

    return _Container.#instance;
  }
}
