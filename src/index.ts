import 'polyfill-symbol-metadata';

import type { IDependencyInjectionContainer } from './types';

import { _Container } from './container';

/** Global Dependency Injection Container. */
export const container: IDependencyInjectionContainer = _Container.instance;

export * from './types';
export * from './decorators';
export * from './errors';
