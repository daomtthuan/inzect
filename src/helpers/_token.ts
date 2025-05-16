import type { PrimitiveTokenMapKey, TokenMapKey } from '~/types/map';
import type { ClassInjectionToken, InjectionToken, PrimitiveInjectionToken } from '~/types/token';

import { ArgumentError } from '~/errors';
import { TypeHelper } from './_type';

/** Helper for Injection Token. */
export class TokenHelper {
  static readonly #primitiveTokenMap: Map<PrimitiveInjectionToken, PrimitiveTokenMapKey> = new Map();

  /**
   * Check if the token is {@link InjectionToken}
   *
   * @param token Token to check.
   *
   * @returns `true` if the token is {@link InjectionToken}, `false` otherwise.
   */
  public static isInjectionToken<TType>(token: unknown): token is InjectionToken<TType> {
    return TokenHelper.isPrimitiveInjectionToken(token) || TokenHelper.isClassInjectionToken(token);
  }

  /**
   * Check if the token is {@link PrimitiveInjectionToken}
   *
   * @param token Token to check.
   *
   * @returns `true` if the token is {@link PrimitiveInjectionToken}, `false` otherwise.
   */
  public static isPrimitiveInjectionToken(token: unknown): token is PrimitiveInjectionToken {
    return !TypeHelper.isNullish(token) && TypeHelper.isPrimitive(token);
  }

  /**
   * Check if the token is {@link ClassInjectionToken}
   *
   * @param token Token to check.
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
  public static createMapKey<TType>(token: InjectionToken<TType>): TokenMapKey<TType> {
    if (TokenHelper.isPrimitiveInjectionToken(token)) {
      if (!TokenHelper.#primitiveTokenMap.has(token)) {
        TokenHelper.#primitiveTokenMap.set(token, {
          value: token,
        });
      }

      return TokenHelper.#primitiveTokenMap.get(token)!;
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
   * @param token Token to stringify.
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

  /**
   * Normalize token.
   *
   * @param token Token to normalize.
   *
   * @returns Normalized token.
   */
  public static normalize<TType>(token: InjectionToken<TType>): InjectionToken<TType> {
    return token;
  }
}
