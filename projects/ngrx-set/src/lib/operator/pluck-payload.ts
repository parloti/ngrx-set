import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IPayloadCreator } from '../creators';

export const pluckPayload = <
  TPayload,
  TType extends string,
>(): OperatorFunction<ActionType<IPayloadCreator<TPayload, TType>>, TPayload> =>
  map(
    (action: ActionType<IPayloadCreator<TPayload>>): TPayload => action.payload,
  );
