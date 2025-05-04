import type { _InjectTokenOrOptions } from './_decorator';
import type { Lifecycle } from './_lifecycle';
import type { InjectionProvider } from './_provider';

/**
 * Registration.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type Registration<TType, TDependencies extends unknown[], TInjects extends _InjectTokenOrOptions<unknown>[]> = {
  /** Injection Provider. */
  provider: InjectionProvider<TType, TDependencies, TInjects>;

  /** Injection Lifecycle Scope. */
  scope: Lifecycle;

  /** Resolved Instance. */
  instance?: TType | undefined;
};
