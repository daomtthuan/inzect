/** Injection Lifecycle Type. */
export enum Lifecycle {
  /**
   * Singleton scope.
   *
   * Always resolves to the same single instance throughout the entire lifetime of the container.
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
   * Resolves the same instance only within the same resolution context.
   */
  Resolution,
}
