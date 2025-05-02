import type { _ClassDecorator, _ClassType, Lifecycle } from '~/types';

import { container } from '~/container';
import { _ResolutionContext } from '~/container/_resolution-context';
import { _InjectionTokenHelper } from '~/helpers';

/**
 * Decorator factory to mark a class as injectable with scope.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param scope Scope.
 *
 * @returns TTarget decorator.
 */
export function Scope<TTarget extends _ClassType>(scope: Lifecycle): _ClassDecorator<TTarget> {
  return (target) => {
    container.register({
      token: target,
      provider: { useClass: target },
      scope,
    });
  };
}
