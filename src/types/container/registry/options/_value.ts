import type { ValueInjectionProvider } from '~/types/provider';
import type { RegisterOptionsBase } from './_base';

/**
 * Value Register Options.
 *
 * @template TType Type of instance.
 */
export type ValueRegisterOptions<TType> = RegisterOptionsBase<ValueInjectionProvider<TType>>;
