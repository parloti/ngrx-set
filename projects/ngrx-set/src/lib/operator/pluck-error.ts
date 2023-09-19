import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IFailureCreator } from '../icreator-set';

/**
 * Maps each source value (an error) to its `error` property.
 * @template TType Action creator type.
 * @returns A function that returns an Observable that emits the value of the `error` property of the source Observable's values.
 */
export const pluckError = <TType extends string>(): OperatorFunction<
  ActionType<IFailureCreator<TType>>,
  string
> => map((action: ActionType<IFailureCreator<TType>>): string => action.error);
