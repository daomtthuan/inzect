import type { Lifecycle } from '~/constants';
import type { InjectParameter } from '~/types/injector';
import type { InjectionProvider } from '~/types/provider';

/**
 * Registration.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type Registration<TType, TDependencies extends unknown[], TInjectParameters extends InjectParameter<unknown>[]> = {
  /** Injection Provider. */
  provider: InjectionProvider<TType, TDependencies, TInjectParameters>;

  /** Injection Lifecycle Scope. */
  scope: Lifecycle;

  /** Resolved Instance. */
  instance?: TType | undefined;
};
