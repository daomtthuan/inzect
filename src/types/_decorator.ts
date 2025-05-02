import type { Except } from 'type-fest';
import type { OptionalResolveOptions, RequiredResolveOptions } from './_container';
import type { Lifecycle } from './_lifecycle';
import type { InjectionToken } from './_token';
import type { _ClassDecorator, _ClassFieldDecorator, _ClassType } from './_type';

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

/**
 * Inject Parameter.
 *
 * @template TType Type of instance.
 * @internal
 */
export type _InjectParameter<TType> = InjectionToken<TType> | InjectOptions<TType> | (InjectionToken<TType> | InjectOptions<TType>)[];

/**
 * Inject Return.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @internal
 */
export type _InjectReturn<TTarget extends _ClassType, TType> = _ClassDecorator<TTarget> | _ClassFieldDecorator<TType, TType | undefined>;
