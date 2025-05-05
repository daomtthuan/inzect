import type { ClassInjectionToken, InjectionToken, InjectionTokenMapKey, PrimitiveInjectionToken, PrimitiveInjectionTokenMapKey } from '~/types';

import { ArgumentError } from '~/errors';
import { TypeHelper } from './_type';

/** Helper for Injection Token. */
export class TokenHelper {
  static readonly #primitiveKeyMap: Map<PrimitiveInjectionToken, PrimitiveInjectionTokenMapKey> = new Map();

  /**
   * Check if the token is {@link PrimitiveInjectionToken}
   *
   * @param token Injection token.
   *
   * @returns `true` if the token is {@link PrimitiveInjectionToken}, `false` otherwise.
   */
  public static isPrimitiveInjectionToken(token: unknown): token is PrimitiveInjectionToken {
    return !TypeHelper.isNullish(token) && TypeHelper.isPrimitive(token);
  }

  /**
   * Check if the token is {@link ClassInjectionToken}
   *
   * @param token Injection token.
   *
   * @returns `true` if the token is {@link ClassInjectionToken}, `false` otherwise.
   */
  public static isClassInjectionToken<TType>(token: unknown): token is ClassInjectionToken<TType> {
    return TypeHelper.isClass(token);
  }

  /**
   * Create a map key for the token.
   *
   * @param token Injection token.
   *
   * @returns Map key.
   */
  public static createMapKey<TType>(token: InjectionToken<TType>): InjectionTokenMapKey<TType> {
    if (TokenHelper.isPrimitiveInjectionToken(token)) {
      if (!TokenHelper.#primitiveKeyMap.has(token)) {
        TokenHelper.#primitiveKeyMap.set(token, { value: token });
      }

      return TokenHelper.#primitiveKeyMap.get(token)!;
    }

    if (TokenHelper.isClassInjectionToken(token)) {
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
    if (TokenHelper.isPrimitiveInjectionToken(token)) {
      return JSON.stringify(token);
    }

    if (TokenHelper.isClassInjectionToken(token)) {
      return token.name;
    }

    throw new ArgumentError({
      argument: token,
      message: 'Invalid token',
    });
  }
}
