import type {
  ClassInjectionProvider,
  ClassRegisterOptions,
  FactoryRegisterOptions,
  IDependencyInjectionContainer,
  InjectionToken,
  InjectTokenFactory,
  InjectTokenOrOptions,
  OptionalResolveOptions,
  RegisterOptions,
  Registration,
  RequiredResolveOptions,
  ResolveInstanceOptions,
  ResolveOptions,
  ValueRegisterOptions,
} from '~/types';

import { Lifecycle } from '~/constants';
import { ResolutionError } from '~/errors';
import { TokenHelper, TypeHelper } from '~/helpers';
import { ResolutionContext } from './context/_resolution-context';
import { LifecycleStrategyFactory } from './lifecycle/_factory';
import { Registry } from './registry/_registry';
import { ResolverStrategyFactory } from './resolver/_factory';

/** Dependency Injection Container. */
export class Container implements IDependencyInjectionContainer {
  static #instance?: Container;
  readonly #registry = new Registry();
  readonly #internalResolutionContext = new ResolutionContext();

  /** @inheritdoc */
  public register<TType>(options: ClassRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType>(options: ValueRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjects>,
  ): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
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
    try {
      return this.resolveInstance(tokenOrOptions);
    } finally {
      this.#internalResolutionContext.clearInstances();
    }
  }

  /** @inheritdoc */
  public unregister<TType>(token: InjectionToken<TType>): void {
    this.#registry.delete(token);
  }

  /** @inheritdoc */
  public isRegistered<TType>(token: InjectionToken<TType>): boolean {
    return this.#registry.has(token);
  }

  /** @inheritdoc */
  public clear(): void {
    this.#registry.clear();
  }

  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @param arg Internal resolve argument.
   *
   * @returns Instance.
   */
  public resolveInstance<TType>(arg: InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | ResolveOptions<TType>): TType | undefined {
    const options = this.#normalizeResolveOptions(arg);
    const token = options.token;

    const registration = this.#registry.get(token);
    if (!registration) {
      return this.#resolveUnregisteredRegistration(options);
    }

    const lifecycle = LifecycleStrategyFactory.get(registration.scope);
    const [isResolved, instance] = lifecycle.resolve({
      token,
      registration,
      context: this.#internalResolutionContext,
    });
    if (isResolved) {
      return instance;
    }

    return this.#resolveRegistration(token, registration);
  }

  #normalizeResolveOptions<TType>(arg: InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | ResolveOptions<TType>): ResolveInstanceOptions<TType> {
    if (typeof arg === 'object' && 'token' in arg) {
      const token = TypeHelper.isFunction(arg.token) ? arg.token() : arg.token;

      return {
        token,
        optional: arg.optional ?? false,
      };
    }

    const token = TypeHelper.isFunction(arg) ? arg() : arg;
    return {
      token,
      optional: false,
    };
  }

  #resolveUnregisteredRegistration<TType>(options: ResolveInstanceOptions<TType>): TType | undefined {
    const token = options.token;
    const optional = options.optional;

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
      const provider: ClassInjectionProvider<TType> = { useClass: token };
      const resolver = ResolverStrategyFactory.get(provider);
      return resolver.resolve(this, provider);
    }

    throw new ResolutionError({
      token,
      message: `Attempted to resolve invalid token`,
    });
  }

  #resolveRegistration<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
  ): TType {
    const provider = registration.provider;
    const scope = registration.scope;

    const resolver = ResolverStrategyFactory.get(provider);
    const instance = resolver.resolve(this, provider);

    const lifecycle = LifecycleStrategyFactory.get(scope);
    lifecycle.store({
      token,
      registration,
      context: this.#internalResolutionContext,
      instance,
    });

    return instance;
  }

  /**
   * Get Inject Constructor Parameters Options.
   *
   * @template TType Type of instance.
   * @param constructor Class constructor.
   *
   * @returns Inject Constructor Parameters Options.
   */

  /** @returns Container instance. */
  public static get instance(): Container {
    Container.#instance ??= new Container();
    return Container.#instance;
  }
}
