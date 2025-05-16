import type { Lifecycle } from '~/constants';
import type { InjectParameter } from '~/types/injector';
import type { InjectionProvider } from '~/types/provider';
import type { InjectionToken } from '~/types/token';

/**
 * Register Options Base.
 *
 * @template TType Type of instance.
 * @template TProvider Injection Provider.
 * @template TDependencies Dependencies types.
 * @template TInjectParameters Inject parameter types.
 */
export type RegisterOptionsBase<
  TType,
  TProvider extends InjectionProvider<TType, TDependencies, TInjectParameters>,
  TDependencies extends unknown[] = never,
  TInjectParameters extends InjectParameter<unknown>[] = never,
> = {
  /** Injection Token. */
  token: InjectionToken<TType>;

  /** Injection Provider. */
  provider: TProvider;

  /**
   * Injection Lifecycle Scope.
   *
   * @default InjectionLifecycle.Transient
   */
  scope?: Lifecycle | undefined;
};
