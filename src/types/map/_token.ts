import type { ClassInjectionToken, PrimitiveInjectionToken } from '~/types/token';

/** Primitive Token Map Key. */
export type PrimitiveTokenMapKey = {
  /** Token value. */
  value: PrimitiveInjectionToken;
};

/**
 * Class Token Map Key.
 *
 * @template TType Type of instance.
 */
export type ClassTokenMapKey<TType> = ClassInjectionToken<TType>;

/**
 * Token Map Key.
 *
 * @template TType Type of instance.
 */
export type TokenMapKey<TType> = PrimitiveTokenMapKey | ClassTokenMapKey<TType>;
