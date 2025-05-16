import type { ClassInjectionToken } from './_class';
import type { PrimitiveInjectionToken } from './_primitive';

/**
 * Dependency Injection Token.
 *
 * @template TType Type of instance.
 */
export type InjectionToken<TType> = PrimitiveInjectionToken | ClassInjectionToken<TType>;
