import type { _ClassDecorator, _ClassType, InjectableOptions } from '~/types';

import { container } from '~/container';

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
    container.register({
      token: options?.token ?? target,
      provider: { useClass: target },
      scope: options?.scope,
    });
  };
}
