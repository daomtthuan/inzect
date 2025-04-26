import type { DependencyInjectionRegistry, InjectionToken, Registration } from '~/types';

import { _RegistrationMap } from './_registration-map';

/**
 * Internal Dependency Injection Registry.
 *
 * @internal
 */
export class _Registry implements DependencyInjectionRegistry {
  #registrationMap = new _RegistrationMap();

  /** @inheritdoc */
  public set<TType>(token: InjectionToken<TType>, registration: Registration<TType>): void {
    const registrations = this.#getRegistrations(token);
    registrations.push(registration);
  }

  /**
   * Set registrations for the token.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   * @param registrations Registrations.
   */
  public setAll<TType>(token: InjectionToken<TType>, registrations: Registration<TType>[]): void {
    this.#registrationMap.set(token, registrations);
  }

  /** @inheritdoc */
  public get<TType>(token: InjectionToken<TType>): Registration<TType> | null {
    const registrations = this.#getRegistrations(token);
    return registrations[registrations.length - 1] ?? null;
  }

  /**
   * Get all registrations for the token.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns Registrations.
   */
  public getAll<TType>(token: InjectionToken<TType>): Registration<TType>[] {
    return this.#getRegistrations(token);
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

  #getRegistrations<TType>(token: InjectionToken<TType>): Registration<TType>[] {
    if (!this.#registrationMap.has(token)) {
      this.#registrationMap.set(token, []);
    }

    return this.#registrationMap.get(token)!;
  }
}
