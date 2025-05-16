import type { Class } from 'type-fest';
import type { ClassDecorator, ClassFieldDecorator } from '~/types/decorator';

/**
 * Inject Result.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 */
export type InjectResult<TTarget extends Class<unknown>, TType> = ClassDecorator<TTarget> | ClassFieldDecorator<TType, TType | undefined>;
