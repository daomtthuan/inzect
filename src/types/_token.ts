import type { Primitive } from 'type-fest';
import type { ClassType } from './_type';

/** Primitive Injection Token. */
export type PrimitiveInjectionToken = NonNullable<Primitive>;

/**
 * Class Injection Token.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionToken<TType> = ClassType<TType>;

/**
 * Dependency Injection Token.
 *
 * @template TType Type of instance.
 */
export type InjectionToken<TType> = PrimitiveInjectionToken | ClassInjectionToken<TType>;

/**
 * Injection Token Factory.
 *
 * @template TType Type of instance.
 */
export type InjectTokenFactory<TType> = () => InjectionToken<TType>;

/** Primitive Injection Token Map Key. */
export type PrimitiveInjectionTokenMapKey = {
  /** Token value. */
  value: PrimitiveInjectionToken;
};

/**
 * Injection Token Map Key.
 *
 * @template TType Type of instance.
 */
export type InjectionTokenMapKey<TType> = PrimitiveInjectionTokenMapKey | ClassInjectionToken<TType>;
