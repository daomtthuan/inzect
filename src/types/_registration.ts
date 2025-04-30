import type { InjectionLifecycle } from './_lifecycle';
import type { InjectionProvider } from './_provider';

/**
 * Registration.
 *
 * @template TType Type of instance.
 * @template TProvider Injection Provider.
 */
export type Registration<TType, TProvider extends InjectionProvider<TType> = InjectionProvider<TType>> = {
  /** Injection Provider. */
  provider: TProvider;

  /** Injection Lifecycle Scope. */
  scope: InjectionLifecycle;

  /** Resolved Instance. */
  instance?: TType;
};
