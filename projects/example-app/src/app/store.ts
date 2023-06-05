import { createAction, createReducer, on, props } from '@ngrx/store';
import {
  createPayloadSetCurry,
  createSet,
  createSetCurry,
  createType,
} from 'ngrx-set';
import { updateState } from './update-state';

interface IMyQuery {
  body: string;
}
interface IMyPayload {
  data: string;
}

export const creators = {
  loading: createAction(
    createType('**', 'Is loading'),
    props<Record<string, boolean>>(),
  ),
  empty: createSet('source', 'empty'),
  query: createSet<IMyQuery>('source', 'query'),
  query2: createSet<IMyQuery, 'source', 'query2'>('source', 'query2'),
  payload: createSet<void, IMyPayload>('source', 'payload'),
  payload2: createSet<void, IMyPayload, 'source', 'payload2'>(
    'source',
    'payload2',
  ),
  full: createSet<IMyQuery, IMyPayload>('source', 'full'),
  full2: createSet<IMyQuery, IMyPayload, 'source', 'full2'>('source', 'full2'),
  queryCurry: createSetCurry<IMyQuery>()('source', 'query-curry'),
  payloadCurry: createSetCurry<void, IMyPayload>()('source', 'payload-curry'),
  fullCurry: createSetCurry<IMyQuery, IMyPayload>()('source', 'full-curry'),
  payloadCurry2: createPayloadSetCurry<IMyPayload>()(
    'source',
    'payload-curry2',
  ),
};
export interface IState {
  p_loading: { [key: string]: number };
  s_loading: { [key: string]: boolean };
}
const initialState: IState = {
  p_loading: {},
  s_loading: {},
};

export const reducer = createReducer(
  initialState,
  on(creators.loading, (state, action) => {
    const loading = { ...state.p_loading };
    for (const key in action) {
      if (key !== 'type' && Object.prototype.hasOwnProperty.call(action, key)) {
        if (action[key] === true) {
          loading[key]++;
        } else {
          loading[key]--;
        }
      }
    }
    return updateState(state, loading);
  }),
  on(creators.loading, (state, action) => {
    const loading = { ...state.s_loading };
    for (const key in action) {
      if (key !== 'type' && Object.prototype.hasOwnProperty.call(action, key)) {
        loading[key] = action[key] === true;
      }
    }
    return updateState(state, loading);
  }),
);
