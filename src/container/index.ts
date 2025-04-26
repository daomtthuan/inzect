import type { DependencyInjectionContainer } from '~/types';

import { _Container } from './_container';

/** Dependency Injection Container. */
export const container: DependencyInjectionContainer = new _Container();
