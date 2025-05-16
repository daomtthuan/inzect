import type { InjectionToken } from '~/types/token';

/** Resolution Context. */
export interface ResolutionContext {
  /**
   * Get instance.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   */
  getInstance<TType>(token: InjectionToken<TType>): TType;

  /**
   * Set instance.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   * @param instance Instance.
   */
  setInstance<TType>(token: InjectionToken<TType>, instance: TType): void;

  /**
   * Check if the context has an instance for the token.
   *
   * @template TType Type of instance.
   * @param token Injection token.
   *
   * @returns `true` if the context has an instance for the token, `false` otherwise.
   */
  hasInstance<TType>(token: InjectionToken<TType>): boolean;

  /** Clear the context. */
  clearInstances(): void;
}
