import type { ClassType } from '~/types/core';
import type { ClassDecorator, ClassFieldDecorator } from '~/types/decorator';

import { TypeHelper } from './_type';

/** Helper for Decorator. */
export class DecoratorHelper {
  /**
   * Check if the arguments are valid for a class decorator.
   *
   * @template TTarget Target class.
   * @template TDecorate Transformed class.
   * @param args Arguments.
   *
   * @returns `true` if the arguments are valid for a class decorator, `false` otherwise.
   */
  public static isClassDecoratorParameters<TTarget extends ClassType<unknown>, TDecorate extends ClassType<unknown>>(
    args: [target: TTarget | undefined, context: DecoratorContext],
  ): args is Parameters<ClassDecorator<TTarget, TDecorate>> {
    const [target, context] = args;

    return TypeHelper.isClass(target) && context.kind === 'class';
  }

  /**
   * Check if the arguments are valid for a class field decorator.
   *
   * @template TValue Target field value.
   * @template TTransform Transformed field value.
   * @param args Arguments.
   *
   * @returns `true` if the arguments are valid for a class field decorator, `false` otherwise.
   */
  public static isClassFieldDecoratorParameters<TValue, TTransform = TValue>(
    args: [_: unknown, context: DecoratorContext],
  ): args is Parameters<ClassFieldDecorator<TValue, TTransform>> {
    const [_, context] = args;

    return context.kind === 'field';
  }
}
