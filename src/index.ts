import 'polyfill-symbol-metadata';

import type { IDependencyInjectionContainer } from './types';

import { _ContainerHelper } from './helpers';

/** Global Dependency Injection Container. */
export const container: IDependencyInjectionContainer = _ContainerHelper.globalContainer;

export * from './types';
export * from './decorators';
export * from './errors';
