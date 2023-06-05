import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IAbortCreator } from '../creators';

export const pluckReason = <TType extends string>(): OperatorFunction<
  ActionType<IAbortCreator<TType>>,
  string
> => map((action: ActionType<IAbortCreator<TType>>): string => action.reason);
