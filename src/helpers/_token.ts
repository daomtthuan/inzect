import type { _ClassType, _InjectionTokenMapKey, _PrimitiveInjectionTokenMapKey, ClassInjectionToken, InjectionToken, PrimitiveInjectionToken } from '~/types';

import { ArgumentError } from '~/errors';
import { _TypeHelper } from './_type';

/**
 * Helper for Injection Token.
 *
 * @internal
 */
export class _InjectionTokenHelper {
  /** String Injection Token Map. */
  public static readonly primitiveKeyMap: Map<PrimitiveInjectionToken, _PrimitiveInjectionTokenMapKey> = new Map();

  /**
   * Check if the token is {@link PrimitiveInjectionToken}
   *
   * @param token Injection token.
   *
   * @returns `true` if the token is {@link PrimitiveInjectionToken}, `false` otherwise.
   */
  public static isPrimitiveInjectionToken(token: unknown): token is PrimitiveInjectionToken {
    return !_TypeHelper.isNullish(token) && _TypeHelper.isPrimitive(token);
  }

  /**
   * Check if the token is {@link ClassInjectionToken}
   *
   * @param token Injection token.
   *
   * @returns `true` if the token is {@link ClassInjectionToken}, `false` otherwise.
   */
  public static isClassInjectionToken<TType>(token: unknown): token is ClassInjectionToken<TType> {
    return _TypeHelper.isClass(token);
  }

  /**
   * Create a map key for the token.
   *
   * @param token Injection token.
   *
   * @returns Map key.
   */
  public static createMapKey<TType>(token: InjectionToken<TType>): _InjectionTokenMapKey<TType> {
    if (_InjectionTokenHelper.isPrimitiveInjectionToken(token)) {
      if (!_InjectionTokenHelper.primitiveKeyMap.has(token)) {
        _InjectionTokenHelper.primitiveKeyMap.set(token, { value: token });
      }

      return _InjectionTokenHelper.primitiveKeyMap.get(token)!;
    }

    if (_InjectionTokenHelper.isClassInjectionToken(token)) {
      return token;
    }

    throw new ArgumentError({
      argument: token,
      message: 'Invalid token',
    });
  }

  /**
   * Stringify the token.
   *
   * @param token Injection token.
   *
   * @returns Stringified token.
   */
  public static stringify<TType>(token: InjectionToken<TType>): string {
    if (_InjectionTokenHelper.isPrimitiveInjectionToken(token)) {
      return JSON.stringify(token);
    }

    if (_InjectionTokenHelper.isClassInjectionToken(token)) {
      return token.name;
    }

    throw new ArgumentError({
      argument: token,
      message: 'Invalid token',
    });
  }
}
