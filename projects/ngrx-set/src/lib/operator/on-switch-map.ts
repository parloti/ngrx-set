import { Observable, switchMap } from 'rxjs';
import { onAbortMap } from './on-abort-map';

export const onSwitchMap = <TIn, TOut>(
  project: (value: TIn, index: number) => Observable<TOut>,
  notifier: (value: TIn) => void,
) => onAbortMap(switchMap, project, notifier);
