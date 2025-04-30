import type { Class, Primitive } from 'type-fest';
import type { _ClassType } from '~/types';

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
   * @template TType Type of instance.
   * @param value Value.
   *
   * @returns True if the value is {@link Class}, false otherwise.
   */
  public static isClass<TType>(value: unknown): value is Class<TType> {
    return typeof value === 'function' && value.toString().startsWith('class ');
  }
}
