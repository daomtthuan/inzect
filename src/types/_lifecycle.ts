import type { IResolutionContext } from './_context';
import type { InjectTokenOrOptions } from './_decorator';
import type { Registration } from './_registration';
import type { InjectionToken } from './_token';

/**
 * Lifecycle Strategy Instance Options Base.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
type LifecycleStrategyInstanceOptionsBase<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]> = {
  /** Injection token. */
  token: InjectionToken<TType>;

  /** Registration. */
  registration: Registration<TType, TDependencies, TInjects>;

  /** Resolution context. */
  context: IResolutionContext;
};

/**
 * Resolution Lifecycle Strategy Store Instance Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type LifecycleStrategyStoreInstanceOptions<
  TType,
  TDependencies extends unknown[],
  TInjects extends InjectTokenOrOptions<unknown>[],
> = LifecycleStrategyInstanceOptionsBase<TType, TDependencies, TInjects> & {
  /** Instance. */
  instance: TType | undefined;
};

/**
 * Lifecycle Strategy Resolve Instance Options.
 *
 * @template TType Type of instance.
 * @template TDependencies Dependencies types.
 * @template TInjects Inject types.
 */
export type LifecycleStrategyResolveInstanceOptions<
  TType,
  TDependencies extends unknown[],
  TInjects extends InjectTokenOrOptions<unknown>[],
> = LifecycleStrategyInstanceOptionsBase<TType, TDependencies, TInjects>;

/**
 * Lifecycle Strategy Resolve Instance Return.
 *
 * @template TType Type of instance.
 */
export type LifecycleStrategyResolveInstanceReturn<TType> = [isResolved: false] | [isResolved: true, instance: TType | undefined];

/** Lifecycle Strategy Interface. */
export interface ILifecycleStrategy {
  /**
   * Store instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param options Lifecycle Strategy Store Instance Options.
   */
  storeInstance<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyStoreInstanceOptions<TType, TDependencies, TInjects>,
  ): void;

  /**
   * Resolve instance.
   *
   * @template TType Type of instance.
   * @template TDependencies Dependencies types.
   * @template TInjects Inject types.
   * @param options Lifecycle Strategy Resolve Instance Options.
   *
   * @returns Resolved Instance return.
   */
  resolveInstance<TType, TDependencies extends unknown[], TInjects extends InjectTokenOrOptions<unknown>[]>(
    options: LifecycleStrategyResolveInstanceOptions<TType, TDependencies, TInjects>,
  ): LifecycleStrategyResolveInstanceReturn<TType>;
}
