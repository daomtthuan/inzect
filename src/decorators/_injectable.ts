import type { Class } from 'type-fest';
import type { ClassDecorator, InjectableOptions, InjectionToken } from '~/types';

import { Lifecycle } from '~/constants';
import { Container } from '~/container';
import { TokenHelper } from '~/helpers';

/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param token Injection Token.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends Class<unknown>, TType>(token?: InjectionToken<TType>): ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param options Injectable Options.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends Class<unknown>, TType>(options: InjectableOptions<TType>): ClassDecorator<TTarget>;
/**
 * Decorator factory to mark a class as injectable.
 *
 * @template TTarget Target class.
 * @template TType Type of instance.
 * @param tokenOrOptions Injection Token or Injectable Options.
 *
 * @returns Injectable decorator.
 */
export function Injectable<TTarget extends Class<unknown>, TType>(tokenOrOptions?: InjectionToken<TType> | InjectableOptions<TType>): ClassDecorator<TTarget> {
  const options = tokenOrOptions ? resolveInjectableOptions(tokenOrOptions) : undefined;

  return (target) => {
    Container.instance.register({
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
  if (TokenHelper.isPrimitiveInjectionToken(tokenOrOptions) || TokenHelper.isClassInjectionToken(tokenOrOptions)) {
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
