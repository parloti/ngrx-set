import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IQueryCreator } from '../icreator-set';

/**
 * Maps each source value (an {@link IQueryCreator}) to its `query` property.
 * @template TQuery Data type carried by the action.
 * @template TType Action creator type.
 * @returns A function that returns an Observable that emits the value of the `query` property of the source Observable's values.
 */
export const pluckQuery = <TQuery, TType extends string>(): OperatorFunction<
  ActionType<IQueryCreator<TQuery, TType>>,
  TQuery
> => map((action: ActionType<IQueryCreator<TQuery>>): TQuery => action.query);
