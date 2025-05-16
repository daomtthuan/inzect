/**
 * Lifecycle Resolve Result.
 *
 * @template TType Type of instance.
 */
export type LifecycleResolveResult<TType> =
  | {
      /** Instance is resolved. */
      isResolved: true;

      /** Instance. */
      instance: TType;
    }
  | {
      /** Instance is not resolved. */
      isResolved: false;
    };
