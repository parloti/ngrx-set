/**
 * Data format carried by the request abort action.
 */
export interface IAbortProp {
  /**
   * Reason why the request was aborted.
   */
  reason: string;
}
/**
 * Data format carried by the request failure action.
 */
export interface IFailureProp {
  /**
   * Error that caused the request to fail.
   */
  error: string;
}
/**
 * Data format that can be transported by the request dispatch action.
 * @template TQuery Custom data type carried by the action.
 */
export interface IQueryProp<TQuery> {
  /**
   * Data carried by the action.
   */
  query: TQuery;
}
/**
 * Data format that can be transported by the request success action.
 * @template TPayload Custom data type carried by the action.
 */
export interface IPayloadProp<TPayload> {
  /**
   * Data carried by the action.
   */
  payload: TPayload;
}
