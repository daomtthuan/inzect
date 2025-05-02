import type { _ClassDecorator, _ClassFieldDecorator, _ClassType } from '~/types';

import { _TypeHelper } from './_type';

/**
 * Helper for Decorator.
 *
 * @internal
 */
export class _DecoratorHelper {
  /**
   * Check if the arguments are valid for a class decorator.
   *
   * @template TTarget Target class.
   * @template TDecorate Decorated class.
   * @param args Arguments.
   *
   * @returns `true` if the arguments are valid for a class decorator, `false` otherwise.
   */
  public static isClassDecoratorParameters<TTarget extends _ClassType, TDecorate extends _ClassType>(
    args: [target: TTarget | undefined, context: DecoratorContext],
  ): args is Parameters<_ClassDecorator<TTarget, TDecorate>> {
    const [target, context] = args;

    return _TypeHelper.isClass(target) && context.kind === 'class';
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
  ): args is Parameters<_ClassFieldDecorator<TValue, TTransform>> {
    const [_, context] = args;

    return context.kind === 'field';
  }
}
