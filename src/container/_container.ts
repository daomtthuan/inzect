import type {
  ClassRegisterOptions,
  DependencyInjectionContainer,
  FactoryRegisterOptions,
  RegisterParameter,
  Registration,
  ResolutionContext,
  ValueRegisterOptions,
} from '~/types/container';
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
  public createChild(): DependencyInjectionContainer {
    return new Container(this);
  }

  /** @inheritdoc */
  public register<TType>(options: ClassRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType>(options: ValueRegisterOptions<TType>): void;
  /** @inheritdoc */
  public register<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    options: FactoryRegisterOptions<TType, TDependencies, TInjectParameters>,
  ): void;
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
  public resolve<TType>(token: InjectionToken<TType>, optional?: false): TType;
  /** @inheritdoc */
  public resolve<TType>(token: InjectionToken<TType>, optional: true): TType | undefined;
  /** @inheritdoc */
  public resolve<TType>(token: InjectionToken<TType>, optional: boolean = false): TType | undefined {
    try {
      return this.resolveWithContext(token, optional, this.#context, false);
    } finally {
      this.#context.clearInstances();
    }
  }

  /** @inheritdoc */
  public async resolveAsync<TType>(token: InjectionToken<TType>, optional?: false): Promise<TType>;
  /** @inheritdoc */
  public async resolveAsync<TType>(token: InjectionToken<TType>, optional: true): Promise<TType | undefined>;
  /** @inheritdoc */
  public async resolveAsync<TType>(token: InjectionToken<TType>, optional: boolean = false): Promise<TType | undefined> {
    try {
      return await this.resolveWithContext(token, optional, this.#context, true);
    } finally {
      this.#context.clearInstances();
    }
  }

  /**
   * Resolve with context.
   *
   * @overload
   * @param token Injection Token.
   * @param optional If `true`, returns `undefined` if the token is not registered.
   * @param context Resolution Context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Resolved instance.
   * @internal
   */
  public resolveWithContext<TType>(token: InjectionToken<TType>, optional: boolean, context?: ResolutionContext, isAsync?: false): TType | undefined;
  /**
   * Resolve with context asynchronously.
   *
   * @overload
   * @param token Injection Token.
   * @param optional If `true`, returns `undefined` if the token is not registered.
   * @param context Resolution Context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Resolved instance.
   * @internal
   */
  public resolveWithContext<TType>(token: InjectionToken<TType>, optional: boolean, context?: ResolutionContext, isAsync?: true): Promise<TType | undefined>;
  /**
   * Resolve with context.
   *
   * @overload
   * @param token Injection Token.
   * @param optional If `true`, returns `undefined` if the token is not registered.
   * @param context Resolution Context.
   * @param isAsync Is resolve asynchronously.
   *
   * @returns Resolved instance.
   * @internal
   */
  public resolveWithContext<TType>(
    token: InjectionToken<TType>,
    optional: boolean,
    context: ResolutionContext = this.#context,
    isAsync: boolean = false,
  ): TType | undefined | Promise<TType | undefined> {
    const registration = this.lookupRegistration(token);
    if (!registration) {
      return this.#resolver.resolveUnregistered(token, optional, context, isAsync);
    }

    return this.#resolver.resolveRegistration(token, registration, context, isAsync);
  }

  /**
   * Lookup registration.
   *
   * @param token Injection Token.
   *
   * @returns Registration.
   * @internal
   */
  private lookupRegistration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters> | undefined {
    const registration = this.#registry.get<TType, TDependencies, TInjectParameters>(token);
    if (registration) {
      return registration;
    }

    const parentRegistration = this.#parent?.lookupRegistration<TType, TDependencies, TInjectParameters>(token);
    if (parentRegistration && parentRegistration.scope === Lifecycle.Container) {
      return undefined;
    }

    return parentRegistration;
  }

  /**
   * @returns Static Instance of Container.
   * @internal
   */
  public static get instance(): Container {
    Container.#instance ??= new Container();
    return Container.#instance;
  }
}
