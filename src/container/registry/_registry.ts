import type { DependencyInjectionRegistry, Registration } from '~/types/container';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

import { TokenHelper } from '~/helpers';
import { RegistrationMap } from './_registration-map';

/** Dependency Injection Registry. */
export class Registry implements DependencyInjectionRegistry {
  #registrationMap: RegistrationMap;

  public constructor() {
    this.#registrationMap = new RegistrationMap();
  }

  /** @inheritdoc */
  public set<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registration: Registration<TType, TDependencies, TInjectParameters>,
  ): void {
    const registrations = this.#getRegistrations<TType, TDependencies, TInjectParameters>(token);
    registrations.push(registration);
  }

  /** @inheritdoc */
  public setAll<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
    registrations: Registration<TType, TDependencies, TInjectParameters>[],
  ): void {
    const key = TokenHelper.createMapKey(token);
    this.#registrationMap.set(key, registrations);
  }

  /** @inheritdoc */
  public get<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters> | undefined {
    const registrations = this.#getRegistrations<TType, TDependencies, TInjectParameters>(token);
    return registrations[registrations.length - 1];
  }

  /** @inheritdoc */
  public getAll<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters>[] {
    return this.#getRegistrations<TType, TDependencies, TInjectParameters>(token);
  }

  /** @inheritdoc */
  public has<TType>(token: InjectionToken<TType>): boolean {
    const registrations = this.#getRegistrations(token);
    return registrations.length > 0;
  }

  /** @inheritdoc */
  public delete<TType>(token: InjectionToken<TType>): void {
    const key = TokenHelper.createMapKey(token);
    this.#registrationMap.delete(key);
  }

  /** @inheritdoc */
  public clear(): void {
    this.#registrationMap = new RegistrationMap();
  }

  #getRegistrations<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]>(
    token: InjectionToken<TType>,
  ): Registration<TType, TDependencies, TInjectParameters>[] {
    const key = TokenHelper.createMapKey(token);
    if (!this.#registrationMap.has(key)) {
      this.#registrationMap.set(key, []);
    }

    return this.#registrationMap.get(key) as Registration<TType, TDependencies, TInjectParameters>[];
  }
}
