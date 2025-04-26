import type { AbstractClass, Class, Primitive } from 'type-fest';

/** Injection Token Primitive. */
export type InjectionTokenPrimitive = {
  /** Token. */
  token: Primitive;
};

/**
 * Injection Token Class.
 *
 * @template TInstance Type of instance.
 */
export type InjectionTokenClass<TInstance> = Class<TInstance> | AbstractClass<TInstance>;

/**
 * Dependency Injection Token.
 *
 * @template TInstance Type of instance.
 */
export type InjectionToken<TInstance> = InjectionTokenPrimitive | InjectionTokenClass<TInstance>;
