import type { InjectionToken } from '~/types/token';
import type { OptionalInjectOptions, RequiredInjectOptions } from './options';

/** Inject Parameter. */
export type InjectParameter<TType> = InjectionToken<TType> | RequiredInjectOptions<TType> | OptionalInjectOptions<TType>;

/** Normalized Inject Parameter. */
export type NormalizedInjectParameter<TType> = {
  /** Injection token. */
  token: InjectionToken<TType>;

  /** Optional. */
  optional: boolean;
};
