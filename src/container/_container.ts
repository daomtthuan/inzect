import type { Class } from 'type-fest';
import type {
  ClassInjectionProvider,
  ClassRegisterOptions,
  DefaultResolveOptions,
  DependencyInjectionContainer,
  FactoryInjectionProvider,
  FactoryRegisterOptions,
  InjectionToken,
  OptionalResolveOptions,
  RegisterOptions,
  Registration,
  ResolutionContext,
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
 * Internal Dependency Injection Container.
 *
 * @internal
 */
export class _Container implements DependencyInjectionContainer {
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
      message: `Invalid registration found for token: ${token.toString()}`,
      token,
      cause: {
        registration,
      },
    });
  }

  #resolveUnregisteredRegistration<TType>(token: InjectionToken<TType>, context: ResolutionContext, optional: boolean): TType | undefined {
    if (_InjectionTokenHelper.isPrimitiveInjectionToken(token)) {
      if (optional) {
        return undefined;
      }

      throw new ResolutionError({
        message: `Attempted to resolve unregistered token: ${token.toString()}`,
        token,
      });
    }

    // No registration found with this token. But the token is a class, try to construct an instance.
    if (_InjectionTokenHelper.isClassInjectionToken(token)) {
      const constructor = token as Class<TType>;
      return this.#constructInstance(constructor, context);
    }

    throw new ResolutionError({
      message: `Attempted to resolve not accepted token`,
      token,
    });
  }

  #resolveLifecycleRegistration<TType>(
    token: InjectionToken<TType>,
    registration: Registration<TType>,
    context: ResolutionContext,
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
    context: ResolutionContext,
  ): TType {
    registration.instance = this.#constructInstance(registration.provider.useClass, context);
    if (registration.scope === InjectionLifecycle.Resolution) {
      context.setInstance(token, registration.instance);
    }

    return registration.instance;
  }

  #resolveValueRegistration<TType>(
    _token: InjectionToken<TType>,
    _registration: Registration<TType, ValueInjectionProvider<TType>>,
    _context: ResolutionContext,
  ): TType {
    throw new Error('Not implemented');
  }

  #resolveFactoryRegistration<TType>(
    _token: InjectionToken<TType>,
    _registration: Registration<TType, FactoryInjectionProvider<TType>>,
    _context: ResolutionContext,
  ): TType {
    throw new Error('Not implemented');
  }

  #constructInstance<TType>(constructor: Class<TType>, _context: ResolutionContext): TType {
    return new constructor();
  }
}
