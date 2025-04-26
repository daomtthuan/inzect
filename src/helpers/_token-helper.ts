import type { InjectionToken, InjectionTokenClass, InjectionTokenPrimitive } from '~/types';

/** Helper for Injection Token. */
export class InjectionTokenHelper {
  static readonly #acceptedPrimitiveTokenTypes = ['string', 'number', 'boolean', 'symbol', 'bigint'];

  /**
   * Check if the token is {@link InjectionTokenPrimitive}.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns True if the token is {@link InjectionTokenPrimitive}, false otherwise.
   */
  public static isPrimitiveInjectionToken<TType>(token: InjectionToken<TType>): token is InjectionTokenPrimitive {
    return typeof token === 'object' && 'token' in token && InjectionTokenHelper.#acceptedPrimitiveTokenTypes.includes(typeof token.token);
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
    return typeof token === 'function' && token.toString().startsWith('class ');
  }
}
