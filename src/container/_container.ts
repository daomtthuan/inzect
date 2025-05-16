import type {
  DependencyInjectionContainer,
  DependencyInjectionRegistry,
  DependencyInjectionResolver,
  RegisterParameter,
  ResolutionContext,
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

  readonly #registry: DependencyInjectionRegistry;
  readonly #resolver: DependencyInjectionResolver;
  readonly #context: ResolutionContext;

  /**
   * @param registry Dependency Injection Registry.
   * @param resolver Dependency Injection Resolver.
   * @param context Resolution Context.
   */
  private constructor(
    registry: DependencyInjectionRegistry = new Registry(),
    resolver: DependencyInjectionResolver = new Resolver(this),
    context: ResolutionContext = new Context(),
  ) {
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
  public resolve<TType>(token: InjectionToken<TType>, optional: boolean = false, context?: ResolutionContext): TType | undefined {
    const contextToUse = this.#prepareContext(context);

    const registration = this.#registry.get(token);
    if (!registration) {
      return this.#resolver.resolveUnregistered(token, optional, contextToUse);
    }

    return this.#resolver.resolveRegistration(token, registration, contextToUse);
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
   * Resolve with internal context.
   *
   * @param token Injection Token.
   * @param optional If `true`, returns `undefined` if the token is not registered.
   *
   * @returns Resolved instance.
   * @internal
   */
  public _resolve<TType>(token: InjectionToken<TType>, optional?: boolean): TType | undefined {
    return this.resolve(token, optional, this.#context);
  }

  /**
   * @returns Dependency Injection Container.
   * @internal
   */
  public static get _instance(): Container {
    Container.#instance ??= new Container();
    return Container.#instance;
  }

  #prepareContext(context?: ResolutionContext): ResolutionContext {
    if (context) {
      return context;
    }

    this.#context.clearInstances();
    return this.#context;
  }
}
