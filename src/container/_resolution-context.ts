import type { InjectionToken, IResolutionContext } from '~/types';

import { _InjectionTokenHelper } from '~/helpers';
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
    const key = _InjectionTokenHelper.createMapKey(token);
    return this.#resolutionMap.get(key);
  }

  /** @inheritdoc */
  public setInstance<TType>(token: InjectionToken<TType>, instance: TType): void {
    const key = _InjectionTokenHelper.createMapKey(token);
    this.#resolutionMap.set(key, instance);
  }

  /** @inheritdoc */
  public hasInstance<TType>(token: InjectionToken<TType>): boolean {
    const key = _InjectionTokenHelper.createMapKey(token);
    return this.#resolutionMap.has(key);
  }

  /** @inheritdoc */
  public clearInstances(): void {
    this.#resolutionMap = new _ResolutionMap();
  }
}
