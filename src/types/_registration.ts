import type { InjectOptions } from './_decorator';
import type { Lifecycle } from './_lifecycle';
import type { InjectionProvider } from './_provider';
import type { InjectionToken } from './_token';

/**
 * Registration.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type Registration<TType, TDependencies extends unknown[], TInjects extends (InjectionToken<unknown> | InjectOptions<unknown>)[]> = {
  /** Injection Provider. */
  provider: InjectionProvider<TType, TDependencies, TInjects>;

  /** Injection Lifecycle Scope. */
  scope: Lifecycle;

  /** Resolved Instance. */
  instance?: TType;
};
