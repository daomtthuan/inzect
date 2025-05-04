import type {
  _ClassDecorator,
  _ClassFieldDecorator,
  _ClassType,
  _InjectParameter,
  _InjectReturn,
  _InjectTokenOrOptions,
  InjectionToken,
  InjectTokenFactory,
  OptionalInjectOptions,
  RequiredInjectOptions,
} from '~/types';

import { _InjectConstants } from '~/constants';
import { _ResolutionContext } from '~/container';
import { _Container } from '~/container/_container';
import { ArgumentError } from '~/errors';
import { _ContainerHelper, _DecoratorHelper, _TypeHelper } from '~/helpers';

/**
 * Decorator factory to mark parameters of constructor will be injected.
 *
 * @overload
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param arg List of Inject Tokens or Inject Options or Inject Tokens Factory or Inject Options Factory.
 *
 * @returns Inject decorator.
 */
export function Inject<TTarget extends _ClassType, TType>(arg: (_InjectTokenOrOptions<TType> | InjectTokenFactory<TType>)[]): _ClassDecorator<TTarget>;
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
 * @param options Required Inject Options.
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
 * @param options Optional Inject Options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: OptionalInjectOptions<TType>): _ClassFieldDecorator<TType, TType | undefined>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param factory Inject Token Factory.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(factory: InjectTokenFactory<TType>): _ClassFieldDecorator<TType>;
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
      const [target] = decoratorArgs;
      return applyInjectClass(injectArg, target);
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
 * Apply Inject field decorator.
 *
 * @template TType Type of instance.
 * @param injectArg Inject argument.
 *
 * @returns Return of Inject field decorator.
 */
function applyInjectField<TType>(injectArg: _InjectParameter<TType>): (value: TType) => TType | undefined {
  if (Array.isArray(injectArg)) {
    throw new ArgumentError({
      argument: injectArg,
      message: 'Only one argument is allowed',
    });
  }

  const resolveOptions = _ContainerHelper.resolveResolveOptions(injectArg);
  return () => _ContainerHelper.globalContainer._internalResolve(resolveOptions.token, resolveOptions.optional);
}

/**
 * Apply Inject Class decorator factory.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param injectArg Inject argument.
 * @param target Target class.
 */
function applyInjectClass<TType>(injectArg: _InjectParameter<TType>, target: _ClassType<TType>): void {
  if (!Array.isArray(injectArg) || injectArg.length === 0) {
    throw new ArgumentError({
      argument: injectArg,
      message: 'At least one argument is required',
    });
  }

  const parametersResolveOptions = injectArg.map((arg) => _ContainerHelper.resolveResolveOptions(arg));
  _ContainerHelper.setParametersResolveOptions(target, parametersResolveOptions);
}
