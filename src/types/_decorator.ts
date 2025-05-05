import type { Class } from 'type-fest';
import type { Lifecycle } from '~/constants';
import type { InjectionToken, InjectTokenFactory } from './_token';
import type { ClassDecorator, ClassFieldDecorator } from './_type';

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
 */
type InjectOptionsBase<TType> = {
  /** Injection Token. */
  token: InjectionToken<TType> | InjectTokenFactory<TType>;
};

/**
 * Required Inject Options.
 *
 * @template TType Type of instance.
 */
export type RequiredInjectOptions<TType> = InjectOptionsBase<TType> & {
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
export type OptionalInjectOptions<TType> = InjectOptionsBase<TType> & {
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
 */
export type InjectTokenOrOptions<TType> = InjectionToken<TType> | InjectOptions<TType>;

/**
 * Inject Constructor Parameter Options.
 *
 * @template TType Type of instance.
 */
export type InjectConstructorParameterOptions<TType> = (InjectTokenOrOptions<TType> | InjectTokenFactory<TType>)[];

/**
 * Inject Parameter.
 *
 * @template TType Type of instance.
 */
export type InjectParameter<TType> = InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | InjectConstructorParameterOptions<TType>;

/**
 * Inject Return.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 */
export type InjectReturn<TTarget extends Class<unknown>, TType> = ClassDecorator<TTarget> | ClassFieldDecorator<TType, TType | undefined>;
