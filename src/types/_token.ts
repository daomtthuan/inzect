import type { Primitive } from 'type-fest';
import type { _ClassType } from './_type';

/** Injection Token Primitive. */
export type InjectionTokenPrimitive = {
  /** Token value. */
  value: Exclude<Primitive, null | undefined>;
};

/**
 * Injection Token Class.
 *
 * @template TType Type of instance.
 */
export type InjectionTokenClass<TType> = _ClassType<TType>;

/**
 * Dependency Injection Token.
 *
 * @template TType Type of instance.
 */
export type InjectionToken<TType> = InjectionTokenPrimitive | InjectionTokenClass<TType>;
