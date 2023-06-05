import type { NotAllowedCheck } from '@ngrx/store';
import type { ActionCreator, TypedAction } from '@ngrx/store/src/models';
import type {
  IAbortProp,
  IFailureProp,
  IPayloadProp,
  IQueryProp,
} from './properties';

type IPropsCheck<TProps extends object> = TProps & NotAllowedCheck<TProps>;
export type IAction<TProps, TType extends string> = TProps & TypedAction<TType>;
type ICreator<TProps extends object, TType extends string> = ActionCreator<
  TType,
  (props: IPropsCheck<TProps>) => IAction<TProps, TType>
>;

export type IAbortCreator<TType extends string = string> = ICreator<
  IAbortProp,
  TType
>;
export type IFailureCreator<TType extends string = string> = ICreator<
  IFailureProp,
  TType
>;
export type IQueryCreator<TQuery, TType extends string = string> = ICreator<
  IQueryProp<TQuery>,
  TType
>;
export type IPayloadCreator<TPayload, TType extends string = string> = ICreator<
  IPayloadProp<TPayload>,
  TType
>;
export type IEmptyCreator<TType extends string> = ActionCreator<
  TType,
  () => TypedAction<TType>
>;
export interface ICreatorSet<
  TDispatch extends ICreator<object, string> | IEmptyCreator<string>,
  TSuccess extends ICreator<object, string> | IEmptyCreator<string>,
  TReasonType extends string = string,
  TErrorType extends string = string,
> {
  abort: IAbortCreator<TReasonType>;
  dispatch: TDispatch;
  failure: IFailureCreator<TErrorType>;
  success: TSuccess;
}
