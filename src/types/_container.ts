import type { RegisterOptions } from './_registry';

/** Dependency Injection Container. */
export interface DependencyInjectionContainer {
  /**
   * Registers a dependency.
   *
   * @template TType Type of instance to register.
   * @param options Register options.
   */
  register<TType>(options: RegisterOptions<TType>): void;
}
