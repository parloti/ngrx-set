import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IAbortCreator } from '../icreator-set';

/**
 * Maps each source value (an {@link IAbortCreator}) to its `reason` property.
 * @template TType Action creator type.
 * @returns A function that returns an Observable that emits the value of the `reason` property of the source Observable's values.
 */
export const pluckReason = <TType extends string>(): OperatorFunction<
  ActionType<IAbortCreator<TType>>,
  string
> => map((action: ActionType<IAbortCreator<TType>>): string => action.reason);
