import type { ResolutionContext } from '~/types/container';
import type { InjectionToken } from '~/types/token';

import { TokenHelper } from '~/helpers';
import { InstanceMap } from './_instance-map';

/** Resolution Context. */
export class Context implements ResolutionContext {
  #instanceMap: InstanceMap;

  public constructor() {
    this.#instanceMap = new InstanceMap();
  }

  /** @inheritdoc */
  public getInstance<TType>(token: InjectionToken<TType>): TType {
    const key = TokenHelper.createMapKey(token);
    return this.#instanceMap.get(key);
  }

  /** @inheritdoc */
  public setInstance<TType>(token: InjectionToken<TType>, instance: TType): void {
    const key = TokenHelper.createMapKey(token);
    this.#instanceMap.set(key, instance);
  }

  /** @inheritdoc */
  public hasInstance<TType>(token: InjectionToken<TType>): boolean {
    const key = TokenHelper.createMapKey(token);
    return this.#instanceMap.has(key);
  }

  /** @inheritdoc */
  public clearInstances(): void {
    this.#instanceMap = new InstanceMap();
  }
}
