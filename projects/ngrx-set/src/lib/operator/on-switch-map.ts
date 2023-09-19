import type { Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs';
import { onAbortMap } from './on-abort-map';

/**
 * An operator that will notify when an action in a set is aborted according to the {@link switchMap} operator.
 * @template TIn Type of value received by the operator.
 * @template TOut Type of value emitted by the operator.
 * @param project - A function that, when applied to an item emitted by the source Observable, returns an Observable.
 * @param notifier - A function that will be invoked before the abort with the last value emitted by the source.
 * @returns A function that returns an Observable that emits the result of applying the `project` function to each item emitted by the source Observable and taking only the values from the most recently projected inner Observable.
 */
export const onSwitchMap = <TIn, TOut>(
  project: (value: TIn, index: number) => Observable<TOut>,
  notifier: (value: TIn) => void,
): OperatorFunction<TIn, TOut> => onAbortMap(switchMap, project, notifier);
