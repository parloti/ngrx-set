import type { Actions } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import type {
  IAbortProp,
  ICreatorSet,
  IFailureProp,
  IPayloadCreator,
  IPayloadProp,
  IQueryCreator,
} from 'ngrx-set';
import { catchFailure } from 'ngrx-set';
import type { Observable, ObservableInputTuple } from 'rxjs';
import {
  combineLatest,
  first,
  map,
  merge,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import type { IAction, IEmptyCreator } from '../icreator-set';

/**
 * It controls the request for a set of creators, including collecting the needed data to complete the call body, listening for the "dispatch" action and triggering "abort", "success" or "failure" actions when the appropriate events occur.
 * @param root0 - The request configuration.
 * @param root0.actions$ - Stream of each action dispatched after the latest state has been reduced.
 * @param root0.creatorSet - Set of creators related to the request.
 * @param root0.extraData$ - Additional data streams needed to build the request body.
 * @param root0.project - A function will receive the query from {@link TDispatch } action and the extra data from {@link extraData$ } and return an observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
 * @returns An observable that return either "abort", "success" or "failure" actions.
 * @example
 *
 * ## Example
 * ```ts
 * actionSetRequest({
 *   actions$,
 *   creatorSet,
 *   extraData$,
 *   // Typescript cannot infer `TQuery` so you need to make it explicit here.
 *   project: (query: { data: string }, extraData) =>
 *     this.backendService.simulateCredit({
 *       ...query,
 *       ...extraData,
 *     }),
 *  });
 * ```
 */
export function actionSetRequest<
  TQuery,
  TPayload,
  TDispatch extends IQueryCreator<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It should be `IQueryProp<TQuery>` but TypeScript can't infer that, see more at https://github.com/microsoft/TypeScript/issues/32794
    any /* IQueryProp<TQuery> */,
    TDispatchType
  >,
  TSuccess extends IPayloadCreator<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It should be `IPayloadProp<TPayload>` but TypeScript can't infer that, see more at https://github.com/microsoft/TypeScript/issues/32794
    any /* IPayloadProp<TPayload> */,
    ISuccessType
  >,
  TCreatorSet extends ICreatorSet<TDispatch, TSuccess, TReasonType, TErrorType>,
  TExtraData,
  TDispatchType extends string = string,
  ISuccessType extends string = string,
  TReasonType extends string = string,
  TErrorType extends string = string,
>({
  actions$,
  creatorSet,
  extraData$,
  project,
}: {
  /**
   * Stream of each action dispatched after the latest state has been reduced.
   */
  actions$: Actions;
  /**
   * Set of creators related to the request.
   */
  creatorSet: TCreatorSet;
  /**
   * Additional data streams needed to build the request body.
   */
  extraData$?: ObservableInputTuple<TExtraData>;
  /**
   * A function will receive the query from {@link TDispatch } action and the extra data from {@link extraData$ } and return an observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
   * @param query - The query from {@link TDispatch } action.
   * @param extraData - The emission from {@link extraData$ } stream.
   * @returns An observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
   */
  project: (query: TQuery, extraData: TExtraData) => Observable<TPayload>;
}): Observable<
  | IAction<IAbortProp, TReasonType>
  | IAction<IPayloadProp<TPayload>, ISuccessType>
  | IAction<IFailureProp, TErrorType>
>;

/**
 * It controls the request for a set of creators, including collecting the needed data to complete the call body, listening for the "dispatch" action and triggering "abort", "success" or "failure" actions when the appropriate events occur.
 * @param root0 - The request configuration.
 * @param root0.actions$ - Stream of each action dispatched after the latest state has been reduced.
 * @param root0.creatorSet - Set of creators related to the request..
 * @param root0.extraData$ - Additional data streams needed to build the request body..
 * @param root0.project - A function will receive the query from {@link TDispatch } action and the extra data from {@link extraData$ } and return an observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
 * @returns An observable that return either "abort", "success" or "failure" actions.
 * @example
 *
 * ## Example
 * ```ts
 * actionSetRequest({
 *   actions$,
 *   creatorSet,
 *   extraData$,
 *   // Typescript cannot infer `TQuery` so you need to make it explicit here.
 *   project: (query: undefined, extraData) =>
 *     this.backendService.simulateCredit({
 *       ...query,
 *       ...extraData,
 *     }),
 *  });
 * ```
 */
export function actionSetRequest<
  TQuery extends undefined,
  TPayload,
  TDispatch extends IEmptyCreator<TDispatchType>,
  TSuccess extends IPayloadCreator<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It should be `IPayloadProp<TPayload>` but TypeScript can't infer that, see more at https://github.com/microsoft/TypeScript/issues/32794
    any /* IPayloadProp<TPayload> */,
    ISuccessType
  >,
  TCreatorSet extends ICreatorSet<TDispatch, TSuccess, TReasonType, TErrorType>,
  TExtraData,
  TDispatchType extends string = string,
  ISuccessType extends string = string,
  TReasonType extends string = string,
  TErrorType extends string = string,
>({
  actions$,
  creatorSet,
  extraData$,
  project,
}: {
  /**
   * Stream of each action dispatched after the latest state has been reduced.
   */
  actions$: Actions;
  /**
   * Set of creators related to the request.
   */
  creatorSet: TCreatorSet;
  /**
   * Additional data streams needed to build the request body.
   */
  extraData$?: ObservableInputTuple<TExtraData>;
  /**
   * A function will receive the query from {@link TDispatch } action and the extra data from {@link extraData$ } and return an observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
   * @param query - The query from {@link TDispatch } action.
   * @param extraData - The emission from {@link extraData$ } stream.
   * @returns An observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
   */
  project: (query: TQuery, extraData: TExtraData) => Observable<TPayload>;
}): Observable<
  | IAction<IAbortProp, TReasonType>
  | IAction<IPayloadProp<TPayload>, ISuccessType>
  | IAction<IFailureProp, TErrorType>
>;

/**
 * It controls the request for a set of creators, including collecting the needed data to complete the call body, listening for the "dispatch" action and triggering "abort", "success" or "failure" actions when the appropriate events occur.
 * @param root0 - The request configuration.
 * @param root0.actions$ - Stream of each action dispatched after the latest state has been reduced.
 * @param root0.creatorSet - Set of creators related to the request..
 * @param root0.extraData$ - Additional data streams needed to build the request body..
 * @param root0.project - A function will receive the query from {@link TDispatch } action and the extra data from {@link extraData$ } and return an observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
 * @returns An observable that return either "abort", "success" or "failure" actions.
 */
export function actionSetRequest<
  TQuery,
  TPayload,
  TDispatch extends
    | IQueryCreator<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It should be `IQueryProp<TQuery>` but TypeScript can't infer that, see more at https://github.com/microsoft/TypeScript/issues/32794
        any /* IQueryProp<TQuery> */,
        TDispatchType
      >
    | IEmptyCreator<TDispatchType>,
  TSuccess extends IPayloadCreator<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It should be `IPayloadProp<TPayload>` but TypeScript can't infer that, see more at https://github.com/microsoft/TypeScript/issues/32794
    any /* IPayloadProp<TPayload> */,
    ISuccessType
  >,
  /* | IEmptyCreator<string>*/ TCreatorSet extends ICreatorSet<
    TDispatch,
    TSuccess,
    TReasonType,
    TErrorType
  >,
  TExtraData,
  TDispatchType extends string = string,
  ISuccessType extends string = string,
  TReasonType extends string = string,
  TErrorType extends string = string,
>({
  actions$,
  creatorSet,
  extraData$,
  project,
}: {
  /**
   * Stream of each action dispatched after the latest state has been reduced.
   */
  actions$: Actions;
  /**
   * Set of creators related to the request.
   */
  creatorSet: TCreatorSet;
  /**
   * Additional data streams needed to build the request body.
   */
  extraData$?: ObservableInputTuple<TExtraData>;
  /**
   * A function will receive the query from {@link TDispatch } action and the extra data from {@link extraData$ } and return an observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
   * @param query - The query from {@link TDispatch } action.
   * @param extraData - The emission from {@link extraData$ } stream.
   * @returns An observable whose emitions will be mapped to the {@link TSuccess } action and error to {@link TCreatorSet.failure } action.
   */
  project: (
    query: TQuery | undefined,
    extraData: TExtraData,
  ) => Observable<TPayload>;
}): Observable<
  | IAction<IAbortProp, TReasonType>
  | IAction<IPayloadProp<TPayload>, ISuccessType>
  | IAction<IFailureProp, TErrorType>
> {
  const { abort, dispatch, failure, success } = creatorSet as ICreatorSet<
    IQueryCreator<TQuery, TDispatchType> | IEmptyCreator<TDispatchType>,
    IPayloadCreator<TPayload, ISuccessType>,
    TReasonType,
    TErrorType
  >;

  /**
   * Subject to feed the {@link abort} action if the request is canceled due to starting a new request.
   */
  const abort$ = new Subject<IAction<IAbortProp, TReasonType>>();

  /**
   * Trigger action {@link abort}.
   * @param reason - The reason the request was aborted..
   * @returns Undefined.
   */
  const abortOnSwitch = (reason: string) => abort$.next(abort({ reason }));

  type TRequest = (
    query: TQuery | undefined,
    extraData: TExtraData,
  ) => Observable<
    | IAction<IPayloadProp<TPayload>, ISuccessType>
    | IAction<IFailureProp, TErrorType>
  >;
  /**
   * Makes the request and triggers {@link TSuccess } or {@link TCreatorSet.failure } actions according to the {@link project} return notifications or {@link abort} if the request is switched.
   * @param query - The query from {@link TDispatch } action.
   * @param extraData - The value from {@link extraData$ } stream.
   * @returns An observable that emits {@link TCreatorSet.failure } action with the error that caused it, or the {@link TSuccess } action with the {@link project } return notifications.
   */
  const request: TRequest = (query, extraData) =>
    project(query, extraData).pipe(
      tap({ unsubscribe: () => abortOnSwitch('Request switched') }),
      map(payload => success({ payload })),
      catchFailure(failure),
    );

  const extraDataPatch$ =
    extraData$ !== void 0
      ? combineLatest(extraData$).pipe(
          first(),
          tap({
            unsubscribe: () => abortOnSwitch('extraData$ switched'),
          }),
        )
      : // TODO: Try to get rid of this casting
        (of(void 0) as Observable<TExtraData>);

  type TControl = Observable<
    | IAction<IPayloadProp<TPayload>, ISuccessType>
    | IAction<IFailureProp, TErrorType>
  >;
  /**
   * Controls the request, by listening for the {@link TDispatch} action, receives the {@link TQuery} and the {@link TExtraDate} and  forwards this to {@link request}, emits {@link abort} if the request is switched.
   */
  const control$: TControl = actions$.pipe(
    ofType(dispatch),
    switchMap(action => {
      return extraDataPatch$.pipe(
        map(extraData => {
          const query = 'query' in action ? action.query : void 0;
          return { extraData, query } as const;
        }),
      );
    }),
    switchMap(({ extraData, query }) => request(query, extraData)),
  );

  return merge(abort$, control$);
}
