import type { Lifecycle } from '~/constants';
import type { InjectionToken } from '~/types/token';

/**
 * Injectable Options.
 *
 * @template TType Type of instance.
 */
export type InjectableOptions<TType> = {
  /**
   * Injection Token.\
   * If not provided, the class will be used as the token.
   */
  token?: InjectionToken<TType> | undefined;

  /**
   * Injection Lifecycle Scope.
   *
   * @default InjectionLifecycle.Transient
   */
  scope?: Lifecycle | undefined;
};
