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
  queryStrong: createSet<IMyQuery, 'source', 'query-strong'>(
    'source',
    'query-strong',
  ),
  payload: createSet<undefined, IMyPayload>('source', 'payload'),
  payloadStrong: createSet<undefined, IMyPayload, 'source', 'payload-strong'>(
    'source',
    'payload-strong',
  ),
  full: createSet<IMyQuery, IMyPayload>('source', 'full'),
  fullStrong: createSet<IMyQuery, IMyPayload, 'source', 'full-strong'>(
    'source',
    'full-strong',
  ),
  queryCurryNew: createSet<IMyQuery>()('source', 'query-curry-new'),
  queryCurry: createSetCurry<IMyQuery>()('source', 'query-curry'),
  payloadCurryNew: createSet<undefined, IMyPayload>()(
    'source',
    'payload-curry-new',
  ),
  payloadCurry: createSetCurry<undefined, IMyPayload>()(
    'source',
    'payload-curry',
  ),
  fullCurry: createSetCurry<IMyQuery, IMyPayload>()('source', 'full-curry'),
  fullCurryNew: createSet<IMyQuery, IMyPayload>()('source', 'full-curry-new'),
  payloadCurryShort: createPayloadSetCurry<IMyPayload>()(
    'source',
    'payload-curry-short',
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
