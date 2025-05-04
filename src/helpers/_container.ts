import type { _ClassType, _InjectTokenOrOptions, InjectTokenFactory, ResolveOptions } from '~/types';

import { _InjectConstants } from '~/constants';
import { _Container } from '~/container';
import { _TypeHelper } from './_type';

/**
 * Helper for Dependency Injection Container.
 *
 * @internal
 */
export class _ContainerHelper {
  static #container?: _Container;

  /**
   * Resolve Resolve Options.
   *
   * @template TType Type of instance.
   * @param arg Injection Token or Inject Options or Injection Token Factory or Resolve Options.
   *
   * @returns Resolved Resolve Options.
   */
  public static resolveResolveOptions<TType>(arg: _InjectTokenOrOptions<TType> | InjectTokenFactory<TType> | ResolveOptions<TType>): ResolveOptions<TType> {
    if (typeof arg === 'object' && 'token' in arg) {
      const token = _TypeHelper.isFunction(arg.token) ? arg.token() : arg.token;

      return {
        token,
        optional: arg.optional ?? false,
        context: 'context' in arg ? arg.context : undefined,
      };
    }

    const token = _TypeHelper.isFunction(arg) ? arg() : arg;
    return {
      token,
    };
  }

  /**
   * Set Parameters Resolve Options.
   *
   * @template TType Type of instance.
   * @param constructor Class constructor.
   * @param parameterResolveOptions Parameters Resolve Options.
   */
  public static setParametersResolveOptions<TType>(constructor: _ClassType<TType>, parameterResolveOptions: ResolveOptions<TType>[]): void {
    constructor[Symbol.metadata] = {
      ...constructor[Symbol.metadata],
      [_InjectConstants.injectParameterResolveOptions]: parameterResolveOptions,
    };
  }

  /**
   * Get Parameters Resolve Options.
   *
   * @template TType Type of instance.
   * @param constructor Class constructor.
   *
   * @returns Parameters Resolve Options.
   */
  public static getParametersResolveOptions<TType>(constructor: _ClassType<TType>): ResolveOptions<TType>[] {
    const injectParameterOptions = constructor[Symbol.metadata]?.[_InjectConstants.injectParameterResolveOptions] as ResolveOptions<TType>[] | undefined;
    return injectParameterOptions ?? [];
  }

  /** @returns Global Dependency Injection Container. */
  public static get globalContainer(): _Container {
    if (!_ContainerHelper.#container) {
      _ContainerHelper.#container = new _Container();
    }

    return _ContainerHelper.#container;
  }
}
