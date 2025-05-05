import 'polyfill-symbol-metadata';

import type { IDependencyInjectionContainer } from './types';

import { Container } from './container';

/** Global Dependency Injection Container. */
export const container: IDependencyInjectionContainer = Container.instance;

export { Lifecycle } from './constants';
export { Inject, Injectable, Scope } from './decorators';
export { ArgumentError, RegistrationError, ResolutionError } from './errors';
