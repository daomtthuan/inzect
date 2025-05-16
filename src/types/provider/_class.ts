import type { Class } from '~/types/core';

/**
 * Class Injection Provider.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionProvider<TType> = {
  /** Provide a class. */
  useClass: Class<TType>;
};
