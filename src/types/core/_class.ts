/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Class constructor.
 *
 * @template TType Type of instance.
 * @template TArgs Constructor arguments.
 */
export type Constructor<TType, TArgs extends unknown[] = any[]> = new (...args: TArgs) => TType;

/**
 * Class.
 *
 * @template TType Type of instance.
 * @template TArgs Constructor arguments.
 */
export interface Class<TType, TArgs extends unknown[] = any[]> extends Constructor<TType, TArgs> {
  /** Class prototype. */
  prototype: Pick<TType, keyof TType>;
}

/**
 * Abstract Class constructor.
 *
 * @template TType Type of instance.
 * @template TArgs Constructor arguments.
 */
export type AbstractConstructor<TType, TArgs extends unknown[] = any[]> = abstract new (...args: TArgs) => TType;

/**
 * Abstract Class.
 *
 * @template TType Type of instance.
 * @template TArgs Constructor arguments.
 */
export interface AbstractClass<TType, TArgs extends unknown[] = any[]> extends AbstractConstructor<TType, TArgs> {
  /** Class prototype. */
  prototype: Pick<TType, keyof TType>;
}

/**
 * Class or Abstract Class.
 *
 * @template TType Type of instance.
 * @template TArgs Constructor arguments.
 */
export type ClassType<TType, TArgs extends unknown[] = any[]> = Class<TType, TArgs> | AbstractClass<TType, TArgs>;
