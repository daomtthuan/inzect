import type { Container } from '~/container';
import type { IResolutionContext } from './_context';
import type { InjectTokenOrOptions } from './_decorator';
import type { InjectionProvider } from './_provider';
import type { Registration } from './_registration';
import type { InjectionToken } from './_token';

/** Provider Resolver Strategy Factory Interface. */
export interface IProviderResolverStrategy {
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
 * Lifecycle Resolver Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type LifecycleResolverOptions<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]> = {
  /** Injection token. */
  token: InjectionToken<TType>;

  /** Registration. */
  registration: Registration<TType, TDependencies, TInjects>;

  /** Resolution context. */
  context: IResolutionContext;
};

/**
 * Lifecycle Resolver Resolve Return.
 *
 * @template TType Type of instance.
 */
export type LifecycleResolverResolveReturn<TType> =
  | {
      /** Is resolved. */
      isResolved: false;
    }
  | {
      /** Is resolved. */
      isResolved: true;

      /** Instance. */
      instance: TType | undefined;
    };

/** Lifecycle Strategy Interface. */
export interface ILifecycleResolverStrategy {
  /**
   * Store instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param instance Instance.
   * @param options Lifecycle Resolver Options.
   */
  store<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    instance: TType,
    options: LifecycleResolverOptions<TType, TDependencies, TInjects>,
  ): void;

  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param options Lifecycle Resolver Options.
   *
   * @returns Resolved Instance return.
   */
  resolve<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleResolverOptions<TType, TDependencies, TInjects>,
  ): LifecycleResolverResolveReturn<TType>;
}
