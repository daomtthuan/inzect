import type { Class } from 'type-fest';
import type { ClassDecorator } from '~/types/decorator';
import type { InjectionToken } from '~/types/token';

import { Lifecycle } from '~/constants';
import { Container } from '~/container';

/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param token Injection Token.
 * @param scope Scope.
 *
 * @returns Injectable Decorator.
 */
export function Injectable<TTarget extends Class<unknown>, TType>(
  token?: InjectionToken<TType> | undefined,
  scope: Lifecycle = Lifecycle.Transient,
): ClassDecorator<TTarget> {
  return (target) => {
    Container._instance.register({
      token: token ?? target,
      provider: {
        useClass: target,
      },
      scope,
    });
  };
}
