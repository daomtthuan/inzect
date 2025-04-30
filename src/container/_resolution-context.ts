import type { InjectionToken, IResolutionContext } from '~/types';

import { _ResolutionMap } from './_resolution-map';

/**
 * Resolution Context.
 *
 * @internal
 */
export class _ResolutionContext implements IResolutionContext {
  #resolutionMap = new _ResolutionMap();

  /** @inheritdoc */
  public getInstance<TType>(token: InjectionToken<TType>): TType {
    return this.#resolutionMap.get(token);
  }

  /** @inheritdoc */
  public setInstance<TType>(token: InjectionToken<TType>, instance: TType): void {
    this.#resolutionMap.set(token, instance);
  }

  /** @inheritdoc */
  public hasInstance<TType>(token: InjectionToken<TType>): boolean {
    return this.#resolutionMap.has(token);
  }

  /** @inheritdoc */
  public clearInstances(): void {
    this.#resolutionMap = new _ResolutionMap();
  }
}
