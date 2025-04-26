import type { Class } from 'type-fest';
import type { DefaultResolveOptions, DependencyInjectionContainer, OptionalResolveOptions, RegisterOptions, ResolutionContext, ResolveOptions } from '~/types';

import { ResolutionError } from '~/errors';
import { InjectionTokenHelper } from '~/helpers';
import { InjectionLifecycle } from '~/types';
import { _Registry } from './_registry';
import { _ResolutionContext } from './_resolution-context';

/**
 * Internal Dependency Injection Container.
 *
 * @internal
 */
export class _Container implements DependencyInjectionContainer {
  /** Dependency Injection Registry. */
  readonly #registry = new _Registry();

  /** @inheritdoc */
  public register<TType>({ token, provider, scope = InjectionLifecycle.Singleton }: RegisterOptions<TType>): void {
    this.#registry.set(token, {
      provider,
      scope,
    });
  }

  /** @inheritdoc */
  public resolve<TType>(options: DefaultResolveOptions<TType>): TType;
  /** @inheritdoc */
  public resolve<TType>(options: OptionalResolveOptions<TType>): TType | undefined;
  /** @inheritdoc */
  public resolve<TType>({ token, context = new _ResolutionContext(), optional = false }: ResolveOptions<TType>): TType | undefined {
    const registration = this.#registry.get(token);
    if (registration) {
      throw new Error('Not implemented');
    }

    if (InjectionTokenHelper.isPrimitiveInjectionToken(token)) {
      if (optional) {
        return undefined;
      }

      throw new ResolutionError({
        message: `Attempted to resolve unregistered token: ${token.toString()}`,
        token,
      });
    }

    // No registration found with this token. But the token is a class, try to construct an instance.
    if (InjectionTokenHelper.isClassInjectionToken(token)) {
      const constructor = token as Class<TType>;
      return this.#constructInstance(constructor, context);
    }

    throw new ResolutionError({
      message: `Attempted to resolve not accepted token`,
      token,
    });
  }

  #constructInstance<TType>(_constructor: Class<TType>, _context: ResolutionContext): TType {
    throw new Error('Not implemented');
  }
}
