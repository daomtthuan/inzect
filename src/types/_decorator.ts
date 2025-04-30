import type { Except } from 'type-fest';
import type { OptionalResolveOptions, RequiredResolveOptions } from './_container';
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

/**
 * Required Inject Options.
 *
 * @template TType Type of instance.
 */
export type RequiredInjectOptions<TType> = Except<RequiredResolveOptions<TType>, 'context'>;

/**
 * Optional Inject Options.
 *
 * @template TType Type of instance.
 */
export type OptionalInjectOptions<TType> = Except<OptionalResolveOptions<TType>, 'context'>;

/**
 * Inject Options.
 *
 * @template TType Type of instance.
 */
export type InjectOptions<TType> = RequiredInjectOptions<TType> | OptionalInjectOptions<TType>;
