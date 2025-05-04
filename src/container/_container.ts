import type { Class } from 'type-fest';
import type {
  _ClassType,
  _InjectTokenOrOptions,
  ClassInjectionProvider,
  ClassRegisterOptions,
  FactoryInjectionProvider,
  FactoryRegisterOptions,
  IDependencyInjectionContainer,
  InjectionToken,
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
import { _ContainerHelper, _InjectionTokenHelper, _ProviderHelper, _TypeHelper } from '~/helpers';
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
    const options = _ContainerHelper.resolveResolveOptions(tokenOrOptions);

    const instance = this._internalResolve(options.token, options.optional);
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
   * @param token Injection token.
   * @param optional Optional flag.
   *
   * @returns Resolved instance.
   * @internal
   */
  public _internalResolve<TType>(token: InjectionToken<TType>, optional: boolean = false): TType | undefined {
    const registration = this.#registry.get(token);
    if (!registration) {
      return this.#resolveUnregisteredRegistration(token, optional);
    }

    const [isResolved, instance] = this.#resolveLifecycle(token, registration);
    if (isResolved) {
      return instance;
    }

    return this.#resolveRegistration(token, registration);
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

  #resolveUnregisteredRegistration<TType>(token: InjectionToken<TType>, optional: boolean): TType | undefined {
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
    const dependencies = (provider.inject?.map((inject) => {
      const resolveOptions = _ContainerHelper.resolveResolveOptions(inject);
      this._internalResolve(resolveOptions.token, resolveOptions.optional);
    }) ?? []) as TDependencies;

    return provider.useFactory(...dependencies);
  }

  #constructInstance<TType>(constructor: _ClassType<TType>): TType {
    const parametersResolveOptions = _ContainerHelper.getParametersResolveOptions(constructor);
    const args = parametersResolveOptions.map((options) => this._internalResolve(options.token, options.optional));
    return new (constructor as Class<TType>)(...args);
  }
}
