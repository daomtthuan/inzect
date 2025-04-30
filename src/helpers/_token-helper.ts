import type { InjectionToken, InjectionTokenClass, InjectionTokenPrimitive } from '~/types';

import { _TypeHelper } from './_type-helper';

/**
 * Helper for Injection Token.
 *
 * @internal
 */
export class _InjectionTokenHelper {
  /**
   * Check if the token is {@link InjectionTokenPrimitive}.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns True if the token is {@link InjectionTokenPrimitive}, false otherwise.
   */
  public static isPrimitiveInjectionToken<TType>(token: InjectionToken<TType>): token is InjectionTokenPrimitive {
    return typeof token === 'object' && 'value' in token && !_TypeHelper.isNullish(token.value) && _TypeHelper.isPrimitive(token.value);
  }

  /**
   * Check if the token is {@link InjectionTokenClass}.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns True if the token is {@link InjectionTokenClass}, false otherwise.
   */
  public static isClassInjectionToken<TType>(token: InjectionToken<TType>): token is InjectionTokenClass<TType> {
    return _TypeHelper.isClass(token);
  }
}
