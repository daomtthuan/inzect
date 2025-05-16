import type { AbstractClass, Class } from 'type-fest';

/**
 * Class Injection Token.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionToken<TType> = Class<TType> | AbstractClass<TType>;
