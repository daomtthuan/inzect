import type { IDependencyInjectionContainer } from '~/types';

import { _Container } from './_container';

export { _ResolutionContext } from './_resolution-context';

/** Dependency Injection Container. */
export const container: IDependencyInjectionContainer = new _Container();
