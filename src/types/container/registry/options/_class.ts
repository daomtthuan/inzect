import type { ClassInjectionProvider } from '~/types/provider';
import type { RegisterOptionsBase } from './_base';

/**
 * Class Register Options.
 *
 * @template TType Type of instance.
 */
export type ClassRegisterOptions<TType> = RegisterOptionsBase<TType, ClassInjectionProvider<TType>>;
