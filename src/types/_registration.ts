import type { InjectOptions } from './_decorator';
import type { InjectionLifecycle } from './_lifecycle';
import type { InjectionProvider } from './_provider';

/**
 * Registration.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type Registration<TType, TDependencies extends unknown[], TInjects extends InjectOptions<unknown>[]> = {
  /** Injection Provider. */
  provider: InjectionProvider<TType, TDependencies, TInjects>;

  /** Injection Lifecycle Scope. */
  scope: InjectionLifecycle;

  /** Resolved Instance. */
  instance?: TType;
};
