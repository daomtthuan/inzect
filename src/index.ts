import type { DependencyInjectionContainer } from './types/container';

import { Container } from './container';

/** Global Dependency Injection Container. */
export const container: DependencyInjectionContainer = Container._instance;

export type {
  ClassRegisterOptions,
  DependencyInjectionContainer,
  FactoryRegisterOptions,
  RegisterParameter,
  ResolutionContext,
  ValueRegisterOptions,
} from './types/container';
export type { ArgumentErrorOptions, RegistrationErrorOptions, ResolutionErrorOptions } from './types/error';
export type { InjectParameter } from './types/injector';
export type { ClassInjectionProvider, FactoryInjectionProvider, InjectionProvider, ValueInjectionProvider } from './types/provider';
export type { InjectionToken } from './types/token';

export { Lifecycle } from './constants';
export { Inject, Injectable, Scope } from './decorators';
export { ArgumentError, RegistrationError, ResolutionError } from './errors';
