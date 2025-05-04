import type { _ClassDecorator, _ClassType, InjectableOptions, InjectionToken } from '~/types';

import { _Container } from '~/container';
import { _ResolutionContext } from '~/container/_resolution-context';
import { _InjectionTokenHelper } from '~/helpers';
import { Lifecycle } from '~/types';

/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param token Injection Token.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends _ClassType, TType>(token?: InjectionToken<TType>): _ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param options Injectable Options.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends _ClassType, TType>(options: InjectableOptions<TType>): _ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param tokenOrOptions Injection Token or Injectable Options.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends _ClassType, TType>(tokenOrOptions?: InjectionToken<TType> | InjectableOptions<TType>): _ClassDecorator<TTarget> {
  const options = tokenOrOptions ? resolveInjectableOptions(tokenOrOptions) : undefined;

  return (target) => {
    _Container.instance.register({
      token: options?.token ?? target,
      provider: {
        useClass: target,
      },
      scope: options?.scope ?? Lifecycle.Transient,
    });
  };
}

/**
 * Resolve Injectable Options.
 *
 * @template TType Type of instance.
 * @param tokenOrOptions Injection Token or Injectable Options.
 *
 * @returns Resolved Injectable Options.
 */
function resolveInjectableOptions<TType>(tokenOrOptions: InjectionToken<TType> | InjectableOptions<TType>): InjectableOptions<TType> {
  if (_InjectionTokenHelper.isPrimitiveInjectionToken(tokenOrOptions) || _InjectionTokenHelper.isClassInjectionToken(tokenOrOptions)) {
    return {
      token: tokenOrOptions,
      scope: Lifecycle.Transient,
    };
  }

  return {
    token: tokenOrOptions.token,
    scope: tokenOrOptions.scope ?? Lifecycle.Transient,
  };
}
