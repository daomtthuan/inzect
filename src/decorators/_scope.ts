import type { Class } from 'type-fest';
import type { Lifecycle } from '~/constants';
import type { ClassDecorator } from '~/types';

import { Container } from '~/container';

/**
 * Decorator factory to mark a class as injectable with scope.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param scope Scope.
 *
 * @returns TTarget decorator.
 */
export function Scope<TTarget extends Class<unknown>>(scope: Lifecycle): ClassDecorator<TTarget> {
  return (target) => {
    Container.instance.register({
      token: target,
      provider: {
        useClass: target,
      },
      scope,
    });
  };
}
