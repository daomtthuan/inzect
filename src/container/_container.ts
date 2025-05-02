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
import { _InjectionTokenHelper, _ProviderHelper, _RegistrationHelper, _TypeHelper } from '~/helpers';
import { InjectionLifecycle } from '~/types';
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
  public register<TType>(options: FactoryRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType>(options: RegisterOptions<TType>): void {
    const token = options.token;
    const provider = options.provider;
    const scope = options.scope ?? InjectionLifecycle.Singleton;

    this.#registry.set(token, {
      provider,
      scope,
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

    if (_RegistrationHelper.isClassRegistration(registration)) {
      return this.#resolveClassRegistration(token, registration, context);
    }

    if (_RegistrationHelper.isValueRegistration(registration)) {
      return this.#resolveValueRegistration(token, registration, context);
    }

    if (_RegistrationHelper.isFactoryRegistration(registration)) {
      return this.#resolveFactoryRegistration(token, registration, context);
    }

    throw new RegistrationError({
      token,
      registration,
      message: `Invalid registration found for token: ${_InjectionTokenHelper.stringify(token)}`,
    });
  }

  /** @inheritdoc */
  public clear(): void {
    this.#registry.clear();
    this.#internalResolutionContext = undefined;
    _InjectionTokenHelper.stringKeyMap.clear();
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
    if (_InjectionTokenHelper.isStringInjectionToken(token)) {
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

  #resolveLifecycleRegistration<TType>(
    token: InjectionToken<TType>,
    registration: Registration<TType>,
    context: IResolutionContext,
  ): [isResolved: false] | [isResolved: true, instance: TType] {
    if (registration.scope === InjectionLifecycle.Singleton && registration.instance !== undefined) {
      return [true, registration.instance];
    }

    if (registration.scope === InjectionLifecycle.Resolution && context.hasInstance(token)) {
      return [true, context.getInstance(token)];
    }

    return [false];
  }

  #resolveClassRegistration<TType>(
    token: InjectionToken<TType>,
    registration: Registration<TType, ClassInjectionProvider<TType>>,
    context: IResolutionContext,
  ): TType {
    registration.instance = this.#constructInstance(token, registration.provider.useClass, context);
    if (registration.scope === InjectionLifecycle.Resolution) {
      context.setInstance(token, registration.instance);
    }

    return registration.instance;
  }

  #resolveValueRegistration<TType>(
    _token: InjectionToken<TType>,
    _registration: Registration<TType, ValueInjectionProvider<TType>>,
    _context: IResolutionContext,
  ): TType {
    throw new Error('Not implemented');
  }

  #resolveFactoryRegistration<TType>(
    _token: InjectionToken<TType>,
    _registration: Registration<TType, FactoryInjectionProvider<TType>>,
    _context: IResolutionContext,
  ): TType {
    throw new Error('Not implemented');
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
