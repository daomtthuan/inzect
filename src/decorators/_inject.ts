import type { _Container } from '~/container/_container';
import type { _ClassDecorator, _ClassFieldDecorator, InjectOptions, OptionalInjectOptions, RequiredInjectOptions } from '~/types';

import { _ResolutionContext, container } from '~/container';

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
 * @param options Inject options.
 *
 * @returns Inject decorator.
 */
export function Inject<TType>(options: InjectOptions<TType>): _ClassFieldDecorator<TType, TType | undefined> {
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
