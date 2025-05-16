import type { EmptyObject } from 'type-fest';
import type { InjectionToken } from '~/types/token';

/**
 * Inject Options Base.
 *
 * @template TType Type of instance.
 * @template TOptions Options type.
 */
export type InjectOptionsBase<TType, TOptions extends object = EmptyObject> = {
  /** Injection Token. */
  token: InjectionToken<TType>;
} & TOptions;
