import type { _ClassDecorator, _ClassType, Lifecycle } from '~/types';

import { _ResolutionContext } from '~/container/_resolution-context';
import { _ContainerHelper, _InjectionTokenHelper } from '~/helpers';

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
    _ContainerHelper.globalContainer.register({
      token: target,
      provider: { useClass: target },
      scope,
    });
  };
}
