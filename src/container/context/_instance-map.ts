/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TokenMapKey } from '~/types/map';

/**
 * Instance Map.
 *
 * @template TType Type of instance.
 */
export class InstanceMap<TType = any> extends WeakMap<TokenMapKey<TType>, TType> {}
