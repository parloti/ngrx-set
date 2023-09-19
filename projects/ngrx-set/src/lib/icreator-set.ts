import type { NotAllowedCheck } from '@ngrx/store';
import type { ActionCreator, TypedAction } from '@ngrx/store/src/models';
import type {
  IAbortProp,
  IFailureProp,
  IPayloadProp,
  IQueryProp,
} from './properties';

type IPropsCheck<TProps extends object> = TProps & NotAllowedCheck<TProps>;

/**
 * Represents a action.
 * @template TProps Data type carried by the action.
 * @template TType Unique name identifying the type of action.
 */
export type IAction<TProps, TType extends string> = TProps & TypedAction<TType>;

type ICreator<TProps extends object, TType extends string> = ActionCreator<
  TType,
  (props: IPropsCheck<TProps>) => IAction<TProps, TType>
>;

/**
 * Creator to be used when the request is aborted.
 * @template TType Unique name identifying the type of action.
 */
export type IAbortCreator<TType extends string = string> = ICreator<
  IAbortProp,
  TType
>;
/**
 * Creator to be used when the request fails.
 * @template TType Unique name identifying the type of action.
 */
export type IFailureCreator<TType extends string = string> = ICreator<
  IFailureProp,
  TType
>;
/**
 * Creator to be used when submitting a query to trigger the request.
 * @template TQuery Data type carried by the action.
 * @template TType Unique name identifying the type of action.
 */
export type IQueryCreator<TQuery, TType extends string = string> = ICreator<
  IQueryProp<TQuery>,
  TType
>;
/**
 * Creator to be used when receiving the request payload.
 * @template TPayload Data type carried by the action.
 * @template TType Unique name identifying the type of action.
 */
export type IPayloadCreator<TPayload, TType extends string = string> = ICreator<
  IPayloadProp<TPayload>,
  TType
>;
/**
 * Creator to be used without passing data.
 * @template TType Unique name identifying the type of action.
 */
export type IEmptyCreator<TType extends string> = ActionCreator<
  TType,
  () => TypedAction<TType>
>;

/**
 * A set of creators related to a request.
 * @template TDispatch Type of the creator used to create actions when submitting a query to trigger the request.
 * @template TSuccess Type of the creator used to create actions when receiving the request payload.
 * @template TReasonType Unique name identifying the type of action to be used when the request is aborted.
 * @template TErrorType Unique name identifying the type of action to be used when the request fails.
 */
export interface ICreatorSet<
  TDispatch extends ICreator<object, string> | IEmptyCreator<string>,
  TSuccess extends ICreator<object, string> | IEmptyCreator<string>,
  TReasonType extends string = string,
  TErrorType extends string = string,
> {
  /**
   * Creator to be used when the request is aborted.
   */
  abort: IAbortCreator<TReasonType>;
  /**
   * Creator to be used when submitting a query to trigger the request.
   */
  dispatch: TDispatch;
  /**
   * Creator to be used when the request fails.
   */
  failure: IFailureCreator<TErrorType>;
  /**
   * Creator to be used when receiving the request payload.
   */
  success: TSuccess;
}

type IAbortType<TType extends string> = `${TType} (Abort)`;
type IDispatchType<TType extends string> = `${TType} (Dispatch)`;
type IFailureType<TType extends string> = `${TType} (Failure)`;
type ISuccessType<TType extends string> = `${TType} (Success)`;

type IType<
  TSource extends string,
  TName extends string,
> = `[${TSource}] ${TName}`;

/**
 * {@link ICreatorSet} Aliases for when neither dispatch nor success carry data.
 * @template TSource The action source type.
 * @template TName The action set name type.
 */
export type IEmptySet<
  TSource extends string = string,
  TName extends string = string,
> = ICreatorSet<
  IEmptyCreator<IDispatchType<`${IType<TSource, TName>}`>>,
  IEmptyCreator<ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;
/**
 * {@link ICreatorSet} Aliases for when the dispatch action carries data but success does not.
 * @template TQuery Data type carried by the dispatch action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 */
export type IQuerySet<
  TQuery,
  TSource extends string,
  TName extends string,
> = ICreatorSet<
  IQueryCreator<TQuery, IDispatchType<`${IType<TSource, TName>}`>>,
  IEmptyCreator<ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;
/**
 * {@link ICreatorSet} Aliases for when the dispatch action does not carry data but success does.
 * @template TPayload Data type carried by the success action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 */
export type IPayloadSet<
  TPayload,
  TSource extends string,
  TName extends string,
> = ICreatorSet<
  IEmptyCreator<IDispatchType<`${IType<TSource, TName>}`>>,
  IPayloadCreator<TPayload, ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;
/**
 * {@link ICreatorSet} Aliases for when both the dispatch and success actions carry data.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 */
export type IFullSet<
  TQuery,
  TPayload,
  TSource extends string,
  TName extends string,
> = ICreatorSet<
  IQueryCreator<TQuery, IDispatchType<`${IType<TSource, TName>}`>>,
  IPayloadCreator<TPayload, ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;
