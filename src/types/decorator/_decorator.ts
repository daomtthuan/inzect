import type { ClassType } from '~/types/core';

/**
 * Class decorator.
 *
 * @template TTarget Target class.
 * @template TDecorate Transformed class.
 * @param target Target class.
 * @param context Class decorator Context.
 */
export type ClassDecorator<TTarget extends ClassType<unknown>, TDecorate extends ClassType<unknown> = TTarget> = (
  target: TTarget,
  context: ClassDecoratorContext,
) => TDecorate | void;

/**
 * Class Field decorator.
 *
 * @template TValue Target field value.
 * @template TTransform Transformed field value.
 * @param context Class Field decorator Context.
 */
export type ClassFieldDecorator<TValue, TTransform = TValue> = (_: undefined, context: ClassFieldDecoratorContext) => ((value: TValue) => TTransform) | void;
