import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IFailureCreator } from '../creators';

export const pluckError = <TType extends string>(): OperatorFunction<
  ActionType<IFailureCreator<TType>>,
  string
> => map((action: ActionType<IFailureCreator<TType>>): string => action.error);
