import type { Class, Primitive } from 'type-fest';

/**
 * Helper for Type.
 *
 * @internal
 */
export class _TypeHelper {
  static readonly #primitiveTypes = ['string', 'number', 'boolean', 'symbol', 'bigint'];

  /**
   * Check if the value is `null` or `undefined`.
   *
   * @param value Value.
   *
   * @returns True if the value is `null` or `undefined`, false otherwise.
   */
  public static isNullish(value: unknown): value is null | undefined {
    return value === null || value === undefined;
  }

  /**
   * Check if the value is {@link Primitive}.
   *
   * @param value Value.
   *
   * @returns True if the value is {@link Primitive}, false otherwise.
   */
  public static isPrimitive(value: unknown): value is Primitive {
    if (_TypeHelper.isNullish(value)) {
      return true;
    }

    return this.#primitiveTypes.includes(typeof value);
  }

  /**
   * Check if the value is {@link Class}.
   *
   * @param value Value.
   *
   * @returns True if the value is {@link Class}, false otherwise.
   */
  public static isClass(value: unknown): value is Class<unknown> {
    return typeof value === 'function' && value.toString().startsWith('class ');
  }
}
