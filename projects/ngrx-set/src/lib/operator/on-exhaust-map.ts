import { Observable, exhaustMap } from 'rxjs';
import { onAbortMap } from './on-abort-map';

export const onExhaustMap = <TIn, TOut>(
  project: (value: TIn, index: number) => Observable<TOut>,
  notifier: (value: TIn) => void,
) => onAbortMap(exhaustMap, project, notifier);
