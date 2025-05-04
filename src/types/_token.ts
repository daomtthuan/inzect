import type { Primitive } from 'type-fest';
import type { _ClassType } from './_type';

/** Primitive Injection Token. */
export type PrimitiveInjectionToken = NonNullable<Primitive>;

/**
 * Class Injection Token.
 *
 * @template TType Type of instance.
 */
export type ClassInjectionToken<TType> = _ClassType<TType>;

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

/**
 * Primitive Injection Token Map Key.
 *
 * @internal
 */
export type _PrimitiveInjectionTokenMapKey = {
  /** Token value. */
  value: PrimitiveInjectionToken;
};

/**
 * Injection Token Map Key.
 *
 * @template TType Type of instance.
 * @internal
 */
export type _InjectionTokenMapKey<TType> = _PrimitiveInjectionTokenMapKey | ClassInjectionToken<TType>;
