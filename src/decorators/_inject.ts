import type { _Container } from '~/container/_container';
import type { _ClassDecorator, _ClassFieldDecorator, InjectionToken, InjectOptions, OptionalInjectOptions, RequiredInjectOptions } from '~/types';

import { _ResolutionContext, container } from '~/container';

/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param token Injection Token.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(token: InjectionToken<TType>): _ClassFieldDecorator<TType>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param options Required Inject options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: RequiredInjectOptions<TType>): _ClassFieldDecorator<TType>;
/**
 * Decorator factory to mark a class field will be injected.\
 * `undefined` is injected if the token is not registered.
 *
 * @overload
 * @template TType Type of instance.
 * @param options Optional Inject options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: OptionalInjectOptions<TType>): _ClassFieldDecorator<TType, TType | undefined>;
/**
 * Decorator factory to mark a class field will be injected.
 *
 * @overload
 * @template TType Type of instance.
 * @param tokenOrOptions Injection Token or Inject options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(tokenOrOptions: InjectionToken<TType> | InjectOptions<TType>): _ClassFieldDecorator<TType, TType | undefined> {
  const options = resolveInjectOptions(tokenOrOptions);

  return () => () => {
    const context = (container as _Container).context;

    return !options.optional ?
        container.resolve({
          token: options.token,
          context,
        })
      : container.resolve({
          token: options.token,
          optional: true,
          context,
        });
  };
}

/**
 * Resolve Inject options.
 *
 * @param tokenOrOptions Injection Token or Inject options.
 *
 * @returns Resolved Inject options.
 */
function resolveInjectOptions<TType>(tokenOrOptions: InjectionToken<TType> | InjectOptions<TType>): InjectOptions<TType> {
  if (typeof tokenOrOptions === 'object' && 'token' in tokenOrOptions) {
    return tokenOrOptions;
  }

  return {
    token: tokenOrOptions,
  };
}
