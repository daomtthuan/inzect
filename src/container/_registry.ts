import type { IDependencyInjectionRegistry, InjectionToken, InjectOptions, Registration } from '~/types';

import { _InjectionTokenHelper } from '~/helpers';
import { _RegistrationMap } from './_registration-map';

/**
 * Dependency Injection Registry.
 *
 * @internal
 */
export class _Registry implements IDependencyInjectionRegistry {
  #registrationMap = new _RegistrationMap();

  /** @inheritdoc */
  public set<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjects>,
  ): void {
    const registrations = this.#getRegistrations<TType, TDependencies, TInjects>(token);
    registrations.push(registration);
  }

  /**
   * Set registrations for the token.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param token Injection token.
   * @param registrations Registrations.
   */
  public setAll<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
    registrations: Registration<TType, TDependencies, TInjects>[],
  ): void {
    const key = _InjectionTokenHelper.createMapKey(token);
    this.#registrationMap.set(key, registrations);
  }

  /** @inheritdoc */
  public get<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjects> | null {
    const registrations = this.#getRegistrations<TType, TDependencies, TInjects>(token);
    return registrations[registrations.length - 1] ?? null;
  }

  /**
   * Get all registrations for the token.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param token Injection token.
   *
   * @returns Registrations.
   */
  public getAll<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjects>[] {
    return this.#getRegistrations<TType, TDependencies, TInjects>(token);
  }

  /** @inheritdoc */
  public has<TType>(token: InjectionToken<TType>): boolean {
    const registrations = this.#getRegistrations(token);
    return registrations.length > 0;
  }

  /** @inheritdoc */
  public clear(): void {
    this.#registrationMap = new _RegistrationMap();
  }

  #getRegistrations<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjects>[] {
    const key = _InjectionTokenHelper.createMapKey(token);
    if (!this.#registrationMap.has(key)) {
      this.#registrationMap.set(key, []);
    }

    return this.#registrationMap.get(key) as Registration<TType, TDependencies, TInjects>[];
  }
}
