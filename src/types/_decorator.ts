import type { InjectionLifecycle } from './_lifecycle';
import type { InjectionToken } from './_token';
import type { _ClassType } from './_type';

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
   * @default InjectionLifecycle.Singleton
   */
  scope?: InjectionLifecycle | undefined;
};
