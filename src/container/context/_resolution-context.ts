import type { InjectionToken, IResolutionContext } from '~/types';

import { TokenHelper } from '~/helpers';
import { ResolutionMap } from './_resolution-map';

/** Resolution Context. */
export class ResolutionContext implements IResolutionContext {
  #resolutionMap = new ResolutionMap();

  /** @inheritdoc */
  public getInstance<TType>(token: InjectionToken<TType>): TType {
    const key = TokenHelper.createMapKey(token);
    return this.#resolutionMap.get(key);
  }

  /** @inheritdoc */
  public setInstance<TType>(token: InjectionToken<TType>, instance: TType): void {
    const key = TokenHelper.createMapKey(token);
    this.#resolutionMap.set(key, instance);
  }

  /** @inheritdoc */
  public hasInstance<TType>(token: InjectionToken<TType>): boolean {
    const key = TokenHelper.createMapKey(token);
    return this.#resolutionMap.has(key);
  }

  /** @inheritdoc */
  public clearInstances(): void {
    this.#resolutionMap = new ResolutionMap();
  }
}
