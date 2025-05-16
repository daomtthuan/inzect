import type { InjectionToken } from '~/types/token';
import type { InjectableOptions } from './_options';

/** Injectable Parameter. */
export type InjectableParameter<TType> = InjectionToken<TType> | InjectableOptions<TType>;
