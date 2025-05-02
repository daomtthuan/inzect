import type { _ClassType } from './_type';

/**
 * Dependency Injection Token.
 *
 * @template TType Type of instance.
 */
export type InjectionToken<TType> = string | _ClassType<TType>;

/**
 * String Injection Token Map Key.
 *
 * @internal
 */
export type _StringInjectionTokenMapKey = {
  /** Token value. */
  value: string;
};

/**
 * Injection Token Map Key.
 *
 * @template TType Type of instance.
 * @internal
 */
export type _InjectionTokenMapKey<TType> = _StringInjectionTokenMapKey | _ClassType<TType>;
