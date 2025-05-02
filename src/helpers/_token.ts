import type { _ClassType, _InjectionTokenMapKey, _StringInjectionTokenMapKey, InjectionToken } from '~/types';

import { ArgumentError } from '~/errors';
import { _TypeHelper } from './_type';

/**
 * Helper for Injection Token.
 *
 * @internal
 */
export class _InjectionTokenHelper {
  /** String Injection Token Map. */
  public static readonly stringKeyMap: Map<string, _StringInjectionTokenMapKey> = new Map();

  /**
   * Check if the token is a string injection token.
   *
   * @param token Injection token.
   *
   * @returns True if the token is a string injection token, false otherwise.
   */
  public static isStringInjectionToken<TType>(token: InjectionToken<TType>): token is string {
    return typeof token === 'string';
  }

  /**
   * Check if the token is a class injection token.
   *
   * @param token Injection token.
   *
   * @returns True if the token is a class injection token, false otherwise.
   */
  public static isClassInjectionToken<TType>(token: InjectionToken<TType>): token is _ClassType<TType> {
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
    if (_InjectionTokenHelper.isStringInjectionToken(token)) {
      if (!_InjectionTokenHelper.stringKeyMap.has(token)) {
        _InjectionTokenHelper.stringKeyMap.set(token, { value: token });
      }

      return _InjectionTokenHelper.stringKeyMap.get(token)!;
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
    if (_InjectionTokenHelper.isStringInjectionToken(token)) {
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
