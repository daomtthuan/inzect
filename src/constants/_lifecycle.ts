/** Injection Lifecycle Scope Type. */
export enum Lifecycle {
  /**
   * Singleton scope.
   *
   * Always resolve to the same single instance throughout the entire lifetime of the container.
   */
  Singleton,

  /**
   * Transient scope.
   *
   * Creates a new instance every time the dependency is resolved.
   */
  Transient,

  /**
   * Resolution scope.
   *
   * Resolve the same instance only within the same resolution context.
   */
  Resolution,
}
