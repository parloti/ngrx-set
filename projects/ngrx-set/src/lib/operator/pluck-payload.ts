import type { ActionType } from '@ngrx/store';
import type { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IPayloadCreator } from '../icreator-set';

/**
 * Maps each source value (an {@link IPayloadCreator}) to its `payload` property.
 * @template TPayload Data type carried by the action.
 * @template TType Action creator type.
 * @returns A function that returns an Observable that emits the value of the `payload` property of the source Observable's values.
 */
export const pluckPayload = <
  TPayload,
  TType extends string,
>(): OperatorFunction<ActionType<IPayloadCreator<TPayload, TType>>, TPayload> =>
  map(
    (action: ActionType<IPayloadCreator<TPayload>>): TPayload => action.payload,
  );
