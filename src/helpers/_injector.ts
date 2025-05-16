import type { InjectParameter, NormalizedInjectParameter } from '~/types/injector';

/** Helper for Injector. */
export class InjectorHelper {
  /**
   * Normalize Inject Parameter.
   *
   * @param injectParameter Inject parameter.
   *
   * @returns Normalized inject parameter.
   */
  public static normalizeInjectParameter<TType>(injectParameter: InjectParameter<TType>): NormalizedInjectParameter<TType> {
    if (typeof injectParameter === 'object') {
      return {
        token: injectParameter.token,
        optional: injectParameter.optional ?? false,
      };
    }

    return {
      token: injectParameter,
      optional: false,
    };
  }
}
