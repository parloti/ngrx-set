import { InjectionToken, type FactoryProvider } from '@angular/core';
import { createAction, props } from '@ngrx/store';
import { createType } from './create-type';
import type {
  ICreatorSet,
  IEmptyCreator,
  IFailureCreator,
  IPayloadCreator,
  IQueryCreator,
} from './creators';

const ABORT_DIFF = 'Abort';
const DISPATCH_DIFF = 'Dispatch';
const FAILURE_DIFF = 'Failure';
const SUCCESS_DIFF = 'Success';

type IAbortType<TType extends string> = `${TType} (${typeof ABORT_DIFF})`;
type IDispatchType<TType extends string> = `${TType} (${typeof DISPATCH_DIFF})`;
type IFailureType<TType extends string> = `${TType} (${typeof FAILURE_DIFF})`;
type ISuccessType<TType extends string> = `${TType} (${typeof SUCCESS_DIFF})`;

type IType<
  TSource extends string,
  TName extends string,
> = `[${TSource}] ${TName}`;

export type IEmptySet<
  TSource extends string = string,
  TName extends string = string,
> = ICreatorSet<
  IEmptyCreator<IDispatchType<`${IType<TSource, TName>}`>>,
  IEmptyCreator<ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;
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

type IAnySet<TQuery, TPayload, TSource extends string, TName extends string> =
  | IEmptySet
  | IQuerySet<TQuery, TSource, TName>
  | IPayloadSet<TPayload, TSource, TName>
  | IFullSet<TQuery, TPayload, TSource, TName>;

function concatString<T1 extends string, T2 extends string>(
  s1: T1,
  s2: T2,
): `${T1} ${T2}` {
  return `${s1} ${s2}`;
}

const REGISTERED_CREATOR_SETS: IAnySet<object, object, string, string>[] = [];

function createDiffType<
  TType extends string,
  TDiff extends
    | typeof ABORT_DIFF
    | typeof DISPATCH_DIFF
    | typeof FAILURE_DIFF
    | typeof SUCCESS_DIFF,
>(type: TType, diff: TDiff): `${TType} (${TDiff})` {
  return concatString(type, `(${diff})`);
}

export function createSet<
  TSource extends string = string,
  TName extends string = string,
>(source: TSource, name: TName): Readonly<IEmptySet<TSource, TName>>;
export function createSet<
  TQuery,
  TSource extends string = string,
  TName extends string = string,
>(source: TSource, name: TName): Readonly<IQuerySet<TQuery, TSource, TName>>;
export function createSet<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TQuery extends void,
  TPayload,
  TSource extends string = string,
  TName extends string = string,
>(
  source: TSource,
  name: TName,
): Readonly<IPayloadSet<TPayload, TSource, TName>>;
export function createSet<
  TQuery,
  TPayload,
  TSource extends string = string,
  TName extends string = string,
>(
  source: TSource,
  name: TName,
): Readonly<IFullSet<TQuery, TPayload, TSource, TName>>;
export function createSet<
  TQuery,
  TPayload,
  TSource extends string = string,
  TName extends string = string,
>(
  source: TSource,
  name: TName,
): Readonly<IAnySet<TQuery, TPayload, TSource, TName>> {
  const type = createType(source, name);

  const abort = createAction(
    createDiffType(type, ABORT_DIFF),
    props<{ reason: string }>(),
  );

  const dispatchType = createDiffType(type, DISPATCH_DIFF);
  const _dispatch = createAction(dispatchType, props<{ query: TQuery }>());
  type TDispatchType = typeof dispatchType;
  const dispatch = _dispatch as TQuery extends void
    ? IEmptyCreator<TDispatchType>
    : IQueryCreator<TQuery, TDispatchType>;

  const failure: IFailureCreator<string> = createAction(
    createDiffType(type, FAILURE_DIFF),
    props<{ error: string }>(),
  );

  const successTyp = createDiffType(type, SUCCESS_DIFF);
  const _success = createAction(successTyp, props<{ payload: TPayload }>());
  type TSuccessType = typeof successTyp;
  const success = _success as TPayload extends void
    ? IEmptyCreator<TSuccessType>
    : IPayloadCreator<TPayload, TSuccessType>;

  const _creators = { abort, dispatch, failure, success } as IAnySet<
    TQuery,
    TPayload,
    TSource,
    TName
  >;
  const creators = Object.freeze(_creators);
  REGISTERED_CREATOR_SETS.push(
    creators as IAnySet<object, object, TSource, TName>,
  );
  return creators;
}

export const REGISTERED_CREATOR_SETS_TOKEN = new InjectionToken(
  'Creators sets',
  {
    providedIn: 'any',
    factory: () => REGISTERED_CREATOR_SETS,
  },
);

export function provideRegisteredCreatorSets(): FactoryProvider {
  return {
    provide: REGISTERED_CREATOR_SETS_TOKEN,
    useFactory: () => REGISTERED_CREATOR_SETS,
  };
}
