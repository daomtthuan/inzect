import type { AbstractClass, Class } from 'type-fest';

/**
 * Class Type.
 *
 * @template T Type of instance.
 * @internal
 */
export type _ClassType<T = any> = Class<T> | AbstractClass<T>;

/**
 * Class decorator.
 *
 * @template TTarget Target class.
 * @template TDecorator Decorator class.
 * @param target Target class.
 * @param context Context.
 * @internal
 */
export type _ClassDecorator<TTarget extends _ClassType, TDecorator extends _ClassType = TTarget> = (
  target: TTarget,
  context: ClassDecoratorContext,
) => TDecorator | void;
