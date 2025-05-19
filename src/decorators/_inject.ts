import type { Class } from '~/types/core';
import type { ClassDecorator, ClassFieldDecorator, InjectResult } from '~/types/decorator';
import type { InjectParameter } from '~/types/injector';
import type { InjectionToken } from '~/types/token';

import { MetadataKey } from '~/constants';
import { Container } from '~/container';
import { ArgumentError } from '~/errors';
import { DecoratorHelper, TokenHelper } from '~/helpers';

/**
 * Decorator factory to mark parameters of constructor will be injected.
 *
 * @overload
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param injects Inject Constructor Parameters.
 *
 * @returns Inject Decorator.
 */
export function Inject<TTarget extends Class<unknown>, TType>(injects: InjectParameter<TType>[]): ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param token Injection Token.
 * @param optional If `true`, inject `undefined` if the token is not registered.
 *
 * @returns Inject Decorator.
 */
export function Inject<TType>(token: InjectionToken<TType>, optional?: boolean): ClassFieldDecorator<TType>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param tokenOrInjects Injection Token or Inject Constructor Parameters.
 * @param optional If `true`, inject `undefined` if the token is not registered.
 *
 * @returns Inject Decorator.
 */
export function Inject<TTarget extends Class<unknown>, TType>(
  tokenOrInjects: InjectionToken<TType> | InjectParameter<TType>[],
  optional: boolean = false,
): InjectResult<TTarget, TType> {
  return (
    ...args: [target: TTarget | undefined, context: ClassDecoratorContext | ClassFieldDecoratorContext]
  ): void | ((value: TType) => TType | undefined) => {
    if (DecoratorHelper.isClassDecoratorParameters(args) && Array.isArray(tokenOrInjects)) {
      const injects = tokenOrInjects;
      return applyInjectClass(args, injects);
    }

    if (DecoratorHelper.isClassFieldDecoratorParameters(args) && TokenHelper.isInjectionToken(tokenOrInjects)) {
      const token = tokenOrInjects;
      return applyInjectField(token, optional);
    }

    throw new ArgumentError({
      argument: args,
      message: 'Invalid Inject arguments',
    });
  };
}

/**
 * Apply Inject Class Decorator factory.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param decoratorArgs Decorator arguments.
 * @param injects Inject Constructor Parameters.
 */
function applyInjectClass<TTarget extends Class<unknown>, TType>(
  [_target, context]: Parameters<ClassDecorator<TTarget>>,
  injects: InjectParameter<TType>[],
): void {
  if (injects.length === 0) {
    throw new ArgumentError({
      argument: injects,
      message: 'At least one inject argument is required',
    });
  }

  context.metadata[MetadataKey.InjectConstructorParameter] = injects;
}

/**
 * Apply Inject Field Decorator.
 *
 * @template TType Type of instance.
 * @param token Injection Token.
 * @param optional If `true`, inject `undefined` if the token is not registered.
 *
 * @returns Return of Inject Field Decorator.
 */
function applyInjectField<TType>(token: InjectionToken<TType>, optional: boolean): ReturnType<ClassFieldDecorator<TType, TType | undefined>> {
  return () => Container._instance._resolveWithContext(token, optional);
}
