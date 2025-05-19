import type { DependencyInjectionContainer, RegisterParameter, Registration, ResolutionContext } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

import { Lifecycle } from '~/constants';
import { Context } from './context';
import { Registry } from './registry';
import { Resolver } from './resolver';

/** Dependency Injection Container. */
export class Container implements DependencyInjectionContainer {
  static #instance?: Container;

  readonly #parent?: Container | undefined;
  readonly #registry: Registry;
  readonly #resolver: Resolver;
  readonly #context: ResolutionContext;

  /**
   * @param parent Parent Dependency Injection Container.
   * @param registry Dependency Injection Registry.
   * @param resolver Dependency Injection Resolver.
   * @param context Resolution Context.
   */
  private constructor(
    parent?: Container,
    registry: Registry = new Registry(),
    resolver: Resolver = new Resolver(this),
    context: ResolutionContext = new Context(),
  ) {
    this.#parent = parent;
    this.#registry = registry;
    this.#resolver = resolver;
    this.#context = context;
  }

  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>({
    token,
    provider,
    scope = Lifecycle.Transient,
  }: RegisterParameter<TType, TDependencies, TInjectParameters>): void {
    this.#registry.set(token, {
      provider: provider,
      scope,
    });
  }

  /** @inheritdoc */
  public resolve<TType>(token: InjectionToken<TType>, optional: boolean = false): TType | undefined {
    try {
      return this._resolveWithContext(token, optional);
    } finally {
      this.#context.clearInstances();
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

  /** @inheritdoc */
  public createChild(): DependencyInjectionContainer {
    return new Container(this);
  }

  /**
   * Resolve with internal context.
   *
   * @param token Injection Token.
   * @param optional If `true`, returns `undefined` if the token is not registered.
   * @param context Resolution Context.
   *
   * @returns Resolved instance.
   * @internal
   */
  public _resolveWithContext<TType>(token: InjectionToken<TType>, optional: boolean, context: ResolutionContext = this.#context): TType | undefined {
    const registration = this._lookupRegistration(token);
    if (!registration) {
      return this.#resolver.resolveUnregistered(token, optional, context);
    }

    return this.#resolver.resolveRegistration(token, registration, context);
  }

  /**
   * Lookup registration.
   *
   * @param token Injection Token.
   *
   * @returns Registration.
   * @internal
   */
  private _lookupRegistration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters> | undefined {
    const registration = this.#registry.get<TType, TDependencies, TInjectParameters>(token);
    if (registration) {
      return registration;
    }

    return this.#parent?._lookupRegistration(token);
  }

  /**
   * @returns Static Instance of Container.
   * @internal
   */
  public static get _instance(): Container {
    Container.#instance ??= new Container();
    return Container.#instance;
  }
}
