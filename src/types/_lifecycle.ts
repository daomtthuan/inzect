/** Injection Lifecycle Type. */
export enum InjectionLifecycle {
  /**
   * Singleton Injection.\
   * The same instance will be returned for the same token.
   */
  Singleton,

  /**
   * Transient Injection.\
   * A new instance will be returned for each resolution.
   */
  Transient,
}
