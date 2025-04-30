import { _container } from '~/container';
import { _ResolutionContext } from '~/container/_resolution-context';
import { type _ClassDecorator, type _ClassType, type InjectableOptions } from '~/types';

/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param options Injectable options.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends _ClassType, TType>(options?: InjectableOptions<TType>): _ClassDecorator<TTarget> {
  return (target) => {
    _container.register({
      token: options?.token ?? target,
      provider: { useClass: target },
      scope: options?.scope,
    });
  };
}
