import type { Observable, OperatorFunction, exhaustMap, switchMap } from 'rxjs';
import { tap } from 'rxjs';

/**
 * An operator that will notify when an action on a set is aborted.
 * @template TIn Type of value received by the operator.
 * @template TOut Type of value emitted by the operator.
 * @param mapper - The operator with the desired abort behavior.
 * @param project - A function that, when applied to an item emitted by the source Observable, returns an Observable.
 * @param notifier - A function that will be invoked before the abort with the last value emitted by the source.
 * @returns A function that returns an Observable that emits the result of applying the `project` function to each item emitted by the source Observable.
 */
export function onAbortMap<TIn, TOut>(
  mapper: typeof switchMap | typeof exhaustMap,
  project: (value: TIn, index: number) => Observable<TOut>,
  notifier: (value: TIn) => void,
): OperatorFunction<TIn, TOut> {
  return (source: Observable<TIn>): Observable<TOut> => {
    let busy = false;
    return source.pipe(
      tap(v => {
        busy ? notifier(v) : void 0;
        busy = true;
      }),
      mapper((value: TIn, index: number) =>
        project(value, index).pipe(
          tap({
            complete: () => (busy = false),
            error: () => (busy = false),
          }),
        ),
      ),
    );
  };
}
