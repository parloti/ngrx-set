import { Observable, exhaustMap, switchMap, tap } from 'rxjs';

export function onAbortMap<TIn, TOut>(
  mapper: typeof switchMap | typeof exhaustMap,
  project: (value: TIn, index: number) => Observable<TOut>,
  notifier: (value: TIn) => void,
) {
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
