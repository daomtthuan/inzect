import type { AbstractClass, Class } from 'type-fest';

/**
 * Class Type.
 *
 * @template TType Type of instance.
 */
export type ClassType<TType> = Class<TType> | AbstractClass<TType>;

/**
 * Class decorator.
 *
 * @template TTarget Target class.
 * @template TDecorate Decorated class.
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
