import type { Class } from 'type-fest';
import type { _ClassType } from '~/types';

/**
 * Helper for Type.
 *
 * @internal
 */
export class _TypeHelper {
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
