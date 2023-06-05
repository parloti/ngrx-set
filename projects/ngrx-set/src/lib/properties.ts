export interface IAbortProp {
  reason: string;
}
export interface IFailureProp {
  error: string;
}
export interface IQueryProp<TQuery> {
  query: TQuery;
}
export interface IPayloadProp<TPayload> {
  payload: TPayload;
}
