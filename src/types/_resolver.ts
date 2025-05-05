import type { Container } from '~/container';
import type { InjectTokenOrOptions } from './_decorator';
import type { InjectionProvider } from './_provider';
import type { InjectionToken } from './_token';

/** Resolver Strategy. */
export interface IResolverStrategy {
  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param container Container.
   * @param provider Provider.
   *
   * @returns Instance.
   */
  resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    container: Container,
    provider: InjectionProvider<TType, TDependencies, TInjects>,
  ): TType;
}

/**
 * Resolve Instance Options.
 *
 * @template TType Type of instance.
 */
export type ResolveInstanceOptions<TType> = {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /** `true` if the resolution is optional, `false` otherwise. */
  optional: boolean;
};
