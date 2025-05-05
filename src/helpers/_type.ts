import type { Class, Primitive } from 'type-fest';

/** Helper for Type. */
export class TypeHelper {
  static readonly #primitiveTypes = ['string', 'number', 'boolean', 'symbol', 'bigint'];

  /**
   * Check if the value is null or undefined.
   *
   * @param value Value.
   *
   * @returns `true` if the value is null or undefined, `false` otherwise.
   */
  public static isNullish(value: unknown): value is null | undefined {
    return value === null || value === undefined;
  }

  /**
   * Check if the value is primitive.
   *
   * @param value Value.
   *
   * @returns `true` if the value is primitive, `false` otherwise.
   */
  public static isPrimitive(value: unknown): value is Primitive {
    return TypeHelper.isNullish(value) || this.#primitiveTypes.includes(typeof value);
  }

  /**
   * Check if the value is {@link Class}.
   *
   * @template TType Type of instance.
   * @param value Value.
   *
   * @returns `true` if the value is {@link Class}, `false` otherwise.
   */
  public static isClass<TType>(value: unknown): value is Class<TType> {
    return typeof value === 'function' && value.toString().startsWith('class ');
  }

  /**
   * Check if the value is function.
   *
   * @template TParams Function parameters.
   * @template TReturn Function return type.
   * @param value Value.
   *
   * @returns `true` if the value is function, `false` otherwise.
   */
  public static isFunction<TParams extends unknown[], TReturn>(value: unknown): value is (...args: TParams) => TReturn {
    return typeof value === 'function' && !TypeHelper.isClass(value);
  }
}
