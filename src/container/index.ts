import type { IDependencyInjectionContainer } from '~/types';

import { _Container } from './_container';

/** Dependency Injection Container. */
export const container: IDependencyInjectionContainer = new _Container();
