import type { _Container } from '~/container/_container';
import type {
  _ClassDecorator,
  _ClassFieldDecorator,
  _ClassType,
  _InjectParameter,
  _InjectReturn,
  InjectionToken,
  InjectOptions,
  OptionalInjectOptions,
  RequiredInjectOptions,
} from '~/types';

import { _InjectConstants } from '~/constants';
import { _ResolutionContext, container } from '~/container';
import { ArgumentError } from '~/errors';
import { _DecoratorHelper } from '~/helpers';

/**
 * Decorator factory to mark parameters of constructor will be injected.
 *
 * @overload
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param tokenOrOptionsList Injection Token or Inject options list.
 *
 * @returns Inject decorator.
 */
export function Inject<TTarget extends _ClassType, TType>(tokenOrOptionsList: (InjectionToken<TType> | InjectOptions<TType>)[]): _ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param token Injection Token.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(token: InjectionToken<TType>): _ClassFieldDecorator<TType>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param options Required Inject options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: RequiredInjectOptions<TType>): _ClassFieldDecorator<TType>;
/**
 * Decorator factory to mark a class field will be injected.\
 * `undefined` is injected if the token is not registered.
 *
 * @overload
 * @template TType Type of instance.
 * @param options Optional Inject options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: OptionalInjectOptions<TType>): _ClassFieldDecorator<TType, TType | undefined>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param injectArg Inject argument.
 *
 * @returns Inject decorator.
 */
export function Inject<TTarget extends _ClassType, TType>(injectArg: _InjectParameter<TType>): _InjectReturn<TTarget, TType> {
  return (
    ...decoratorArgs: [target: TTarget | undefined, context: ClassDecoratorContext | ClassFieldDecoratorContext]
  ): void | ((value: TType) => TType | undefined) => {
    if (_DecoratorHelper.isClassDecoratorParameters(decoratorArgs)) {
      const [_target, context] = decoratorArgs;
      return applyInjectClass(injectArg, context);
    }

    if (_DecoratorHelper.isClassFieldDecoratorParameters(decoratorArgs)) {
      return applyInjectField(injectArg);
    }

    throw new ArgumentError({
      argument: decoratorArgs,
      message: 'Invalid Inject arguments',
    });
  };
}

/**
 * Resolve Inject options.
 *
 * @template TType Type of instance.
 * @param tokenOrOptions Injection Token or Inject options.
 *
 * @returns Resolved Inject options.
 */
function resolveInjectOptions<TType>(tokenOrOptions: InjectionToken<TType> | InjectOptions<TType>): InjectOptions<TType> {
  if (typeof tokenOrOptions === 'object' && 'token' in tokenOrOptions) {
    return {
      token: tokenOrOptions.token,
      optional: tokenOrOptions.optional ?? false,
    };
  }

  return {
    token: tokenOrOptions,
    optional: false,
  };
}

/**
 * Apply Inject field decorator.
 *
 * @template TType Type of instance.
 * @param arg Inject argument.
 *
 * @returns Return of Inject field decorator.
 */
function applyInjectField<TType>(arg: _InjectParameter<TType>): (value: TType) => TType | undefined {
  if (Array.isArray(arg)) {
    throw new ArgumentError({
      argument: arg,
      message: 'Only one argument is allowed',
    });
  }

  const options = resolveInjectOptions(arg);
  return () => (container as _Container)._internalResolve(options);
}

/**
 * Apply Inject Class decorator factory.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param arg Inject argument.
 * @param context Decorator Context.
 */
function applyInjectClass<TType>(arg: _InjectParameter<TType>, context: ClassDecoratorContext): void {
  if (!Array.isArray(arg) || arg.length === 0) {
    throw new ArgumentError({
      argument: arg,
      message: 'At least one argument is required',
    });
  }

  const options = arg.map(resolveInjectOptions);
  context.metadata[_InjectConstants.injectClassOptions] = options;
}
