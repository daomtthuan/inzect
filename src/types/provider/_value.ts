/**
 * Value Injection Provider.
 *
 * @template TType Type of instance.
 */
export type ValueInjectionProvider<TType> = {
  /** Provide a value. */
  useValue: TType;
};
