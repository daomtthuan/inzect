import type { Lifecycle } from './_lifecycle';
import type { InjectionToken, InjectTokenFactory } from './_token';
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
 * Inject Options Base.
 *
 * @template TType Type of instance.
 * @internal
 */
type _InjectOptionsBase<TType> = {
  /** Injection Token. */
  token: InjectionToken<TType> | InjectTokenFactory<TType>;
};

/**
 * Required Inject Options.
 *
 * @template TType Type of instance.
 */
export type RequiredInjectOptions<TType> = _InjectOptionsBase<TType> & {
  /**
   * If set to `true`, inject `undefined` if token is not registered.
   *
   * @default false
   */
  optional?: false | undefined;
};

/**
 * Optional Inject Options.
 *
 * @template TType Type of instance.
 */
export type OptionalInjectOptions<TType> = _InjectOptionsBase<TType> & {
  /** If set to `true`, inject `undefined` if token is not registered. */
  optional: true;
};

/**
 * Inject Options.
 *
 * @template TType Type of instance.
 */
export type InjectOptions<TType> = RequiredInjectOptions<TType> | OptionalInjectOptions<TType>;

/**
 * Injection Token or Inject Options.
 *
 * @template TType Type of instance.
 * @internal
 */
export type _InjectTokenOrOptions<TType> = InjectionToken<TType> | InjectOptions<TType>;

/**
 * Inject Parameter.
 *
 * @template TType Type of instance.
 * @internal
 */
export type _InjectParameter<TType> = _InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | (_InjectTokenOrOptions<TType> | InjectTokenFactory<TType>)[];

/**
 * Inject Return.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @internal
 */
export type _InjectReturn<TTarget extends _ClassType, TType> = _ClassDecorator<TTarget> | _ClassFieldDecorator<TType, TType | undefined>;
