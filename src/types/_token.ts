import type { AbstractClass, Class, Primitive } from 'type-fest';

/** Injection Token Primitive. */
export type InjectionTokenPrimitive = {
  /** Token. */
  token: Exclude<Primitive, null | undefined>;
};

/**
 * Injection Token Class.
 *
 * @template TType Type of instance.
 */
export type InjectionTokenClass<TType> = Class<TType> | AbstractClass<TType>;

/**
 * Dependency Injection Token.
 *
 * @template TType Type of instance.
 */
export type InjectionToken<TType> = InjectionTokenPrimitive | InjectionTokenClass<TType>;
