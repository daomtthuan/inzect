import 'polyfill-symbol-metadata';

import type { IDependencyInjectionContainer } from './types';

import { _container } from './container';

export * from './types';
export * from './decorators';
export * from './errors';

/** Dependency Injection Container. */
export const container: IDependencyInjectionContainer = _container;

export default container;
