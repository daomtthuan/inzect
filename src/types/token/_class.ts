import type { ClassType } from '~/types/core';

/**
 * Class Injection Token.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionToken<TType> = ClassType<TType>;
