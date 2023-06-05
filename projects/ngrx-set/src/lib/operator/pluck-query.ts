import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IQueryCreator } from '../creators';

export const pluckQuery = <TQuery, TType extends string>(): OperatorFunction<
  ActionType<IQueryCreator<TQuery, TType>>,
  TQuery
> => map((action: ActionType<IQueryCreator<TQuery>>): TQuery => action.query);
