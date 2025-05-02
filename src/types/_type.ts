import type { AbstractClass, Class } from 'type-fest';

/**
 * Class Type.
 *
 * @template TType Type of instance.
 * @internal
 */
export type _ClassType<TType = unknown> = Class<TType> | AbstractClass<TType>;

/**
 * Class decorator.
 *
 * @template TTarget Target class.
 * @template TDecorate Decorated class.
 * @param target Target class.
 * @param context Class decorator Context.
 * @internal
 */
export type _ClassDecorator<TTarget extends _ClassType, TDecorate extends _ClassType = TTarget> = (
  target: TTarget,
  context: ClassDecoratorContext,
) => TDecorate | void;

/**
 * Class Field decorator.
 *
 * @template TValue Target field value.
 * @template TTransform Transformed field value.
 * @param context Class Field decorator Context.
 * @internal
 */
export type _ClassFieldDecorator<TValue, TTransform = TValue> = (_: undefined, context: ClassFieldDecoratorContext) => ((value: TValue) => TTransform) | void;
