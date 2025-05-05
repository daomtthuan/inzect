import type { Class } from 'type-fest';
import type {
  ClassDecorator,
  ClassFieldDecorator,
  InjectConstructorParameterOptions,
  InjectionToken,
  InjectParameter,
  InjectReturn,
  InjectTokenFactory,
  OptionalInjectOptions,
  RequiredInjectOptions,
} from '~/types';

import { MetadataKey } from '~/constants';
import { Container } from '~/container';
import { ArgumentError } from '~/errors';
import { DecoratorHelper } from '~/helpers';

/**
 * Decorator factory to mark parameters of constructor will be injected.
 *
 * @overload
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param options Inject Constructor Parameter Options.
 *
 * @returns Inject decorator.
 */
export function Inject<TTarget extends Class<unknown>, TType>(options: InjectConstructorParameterOptions<TType>): ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param token Injection Token.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(token: InjectionToken<TType>): ClassFieldDecorator<TType>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param options Required Inject Options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: RequiredInjectOptions<TType>): ClassFieldDecorator<TType>;
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
export function Inject<TType>(options: OptionalInjectOptions<TType>): ClassFieldDecorator<TType, TType | undefined>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param factory Inject Token Factory.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(factory: InjectTokenFactory<TType>): ClassFieldDecorator<TType>;
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
export function Inject<TTarget extends Class<unknown>, TType>(injectArg: InjectParameter<TType>): InjectReturn<TTarget, TType> {
  return (
    ...decoratorArgs: [target: TTarget | undefined, context: ClassDecoratorContext | ClassFieldDecoratorContext]
  ): void | ((value: TType) => TType | undefined) => {
    if (DecoratorHelper.isClassDecoratorParameters(decoratorArgs)) {
      const [_target, context] = decoratorArgs;
      return applyInjectClass(injectArg, context);
    }

    if (DecoratorHelper.isClassFieldDecoratorParameters(decoratorArgs)) {
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
function applyInjectField<TType>(injectArg: InjectParameter<TType>): (value: TType) => TType | undefined {
  if (Array.isArray(injectArg)) {
    throw new ArgumentError({
      argument: injectArg,
      message: 'Only one argument is allowed',
    });
  }

  return () => Container.instance.resolveInstance(injectArg);
}

/**
 * Apply Inject Class decorator factory.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param injectArg Inject argument.
 * @param context Class decorator Context.
 */
function applyInjectClass<TType>(injectArg: InjectParameter<TType>, context: ClassDecoratorContext): void {
  if (!Array.isArray(injectArg) || injectArg.length === 0) {
    throw new ArgumentError({
      argument: injectArg,
      message: 'At least one argument is required',
    });
  }

  context.metadata[MetadataKey.InjectConstructorParameterOptions] = injectArg;
}
