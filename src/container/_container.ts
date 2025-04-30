import type {
  _ClassType,
  ClassInjectionProvider,
  ClassRegisterOptions,
  DefaultResolveOptions,
  FactoryInjectionProvider,
  FactoryRegisterOptions,
  IDependencyInjectionContainer,
  InjectionToken,
  IResolutionContext,
  OptionalResolveOptions,
  RegisterOptions,
  Registration,
  ResolveOptions,
  ValueInjectionProvider,
  ValueRegisterOptions,
} from '~/types';

import { ResolutionError } from '~/errors';
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
  public resolve<TType>(options: DefaultResolveOptions<TType>): TType;
  /** @inheritdoc */
  public resolve<TType>(options: OptionalResolveOptions<TType>): TType | undefined;
  /** @inheritdoc */
  public resolve<TType>(options: ResolveOptions<TType>): TType | undefined {
    const token = options.token;
    const context = options.context ?? new _ResolutionContext();
    const optional = options.optional ?? false;

    const registration = this.#registry.get(token);
    if (!registration) {
      return this.#resolveUnregisteredRegistration(token, context, optional);
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

    throw new ResolutionError({
      token,
      message: `Invalid registration found for token: ${token.toString()}`,
      cause: {
        registration,
      },
    });
  }

  #resolveUnregisteredRegistration<TType>(token: InjectionToken<TType>, context: IResolutionContext, optional: boolean): TType | undefined {
    if (_InjectionTokenHelper.isPrimitiveInjectionToken(token)) {
      if (optional) {
        return undefined;
      }

      throw new ResolutionError({
        token,
        message: `Attempted to resolve unregistered token: ${token.toString()}`,
      });
    }

    // No registration found with this token. But the token is a class, try to construct an instance.
    if (_InjectionTokenHelper.isClassInjectionToken(token)) {
      return this.#constructInstance(token, token, context);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to resolve not accepted token`,
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

  #constructInstance<TType>(token: InjectionToken<TType>, constructor: _ClassType<TType>, _context: IResolutionContext): TType {
    if (_TypeHelper.isClass(constructor)) {
      return new constructor();
    }

    throw new ResolutionError({
      token,
      message: `Attempted to construct not a class`,
    });
  }
}
