import type { InjectionToken } from './_token';

/** Resolution Context. */
export interface ResolutionContext {
  /**
   * Get instance.
   *
   * @param token Injection token.
   */
  getInstance<TType>(token: InjectionToken<TType>): TType;

  /**
   * Set instance.
   *
   * @param token Injection token.
   * @param instance Instance.
   */
  setInstance<TType>(token: InjectionToken<TType>, instance: TType): void;

  /**
   * Check if the context has an instance for the token.
   *
   * @param token Injection token.
   *
   * @returns True if the context has an instance for the token, false otherwise.
   */
  hasInstance(token: InjectionToken<unknown>): boolean;

  /** Clear the context. */
  clearInstances(): void;
}
