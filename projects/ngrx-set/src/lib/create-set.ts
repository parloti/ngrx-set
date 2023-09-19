import { InjectionToken, type FactoryProvider } from '@angular/core';
import { createAction, props } from '@ngrx/store';

import { createType } from './create-type';
import type {
  IEmptyCreator,
  IEmptySet,
  IFailureCreator,
  IFullSet,
  IPayloadCreator,
  IPayloadSet,
  IQueryCreator,
  IQuerySet,
} from './icreator-set';
import type {
  IFullSetFactory,
  IPayloadSetFactory,
  IQuerySetFactory,
} from './icreator-set-factory';
import type {
  IAbortProp,
  IFailureProp,
  IPayloadProp,
  IQueryProp,
} from './properties';

const ABORT_DIFF = 'Abort';
const DISPATCH_DIFF = 'Dispatch';
const FAILURE_DIFF = 'Failure';
const SUCCESS_DIFF = 'Success';

type IAnySet<TQuery, TPayload, TSource extends string, TName extends string> =
  | IEmptySet
  | IQuerySet<TQuery, TSource, TName>
  | IPayloadSet<TPayload, TSource, TName>
  | IFullSet<TQuery, TPayload, TSource, TName>;

/**
 * Strongly typed string concatenation.
 * @template T1 Type of first string to concatenate.
 * @template T2 Type of second string to concatenate.
 * @param s1 - First string to concatenate.
 * @param s2 - Second string to concatenate.
 * @returns The concatenated string.
 */
function concatString<T1 extends string, T2 extends string>(
  s1: T1,
  s2: T2,
): `${T1} ${T2}` {
  return `${s1} ${s2}`;
}

/**
 * Appends a differentiator to the end of the type to distinguish actions within a set according to their purpose.
 * @template TType Type of action set.
 * @template TDiff Type of the action type differentiator.
 * @param type - First string to concatenate.
 * @param diff - Second string to concatenate.
 * @returns The concatenated string.
 */
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

/**
 * Creates a set which neither dispatch nor success carry data.
 * @template TSource The action source type.
 * @template TName The action set name type.
 * @param source - Origin, from where the action is triggered.
 * @param name - The name of the creator set.
 * @returns A set which neither dispatch nor success carry data.
 */
export function createSet<
  TSource extends string = string,
  TName extends string = string,
>(source: TSource, name: TName): Readonly<IEmptySet<TSource, TName>>;
/**
 * Creates a set which the dispatch action carries data but success does not.
 * @template TQuery Data type carried by the dispatch action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 * @param source - Origin, from where the action is triggered.
 * @param name - The name of the creator set.
 * @returns A set which the dispatch action carries data but success does not.
 */
export function createSet<
  TQuery,
  TSource extends string = string,
  TName extends string = string,
>(source: TSource, name: TName): Readonly<IQuerySet<TQuery, TSource, TName>>;
/**
 * Creates a set which the dispatch action does not carry data but success does.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 * @param source - Origin, from where the action is triggered.
 * @param name - The name of the creator set.
 * @returns A set which the dispatch action does not carry data but success does.
 */
export function createSet<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TQuery needs to be provided as `undefined` for the overload to work.
  TQuery extends undefined,
  TPayload,
  TSource extends string = string,
  TName extends string = string,
>(
  source: TSource,
  name: TName,
): Readonly<IPayloadSet<TPayload, TSource, TName>>;
/**
 * Creates a set which both the dispatch and success actions carry data.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 * @param source - Origin, from where the action is triggered.
 * @param name - The name of the creator set.
 * @returns A set which both the dispatch and success actions carry data.
 */
export function createSet<
  TQuery,
  TPayload,
  TSource extends string = string,
  TName extends string = string,
>(
  source: TSource,
  name: TName,
): Readonly<IFullSet<TQuery, TPayload, TSource, TName>>;
/**
 * Creates a factory to a set which the dispatch action carries data but success does not.
 * @template TQuery Data type carried by the dispatch action.
 * @returns A factory to a set which the dispatch action carries data but success does not.
 */
export function createSet<TQuery>(): IQuerySetFactory<TQuery>;
/**
 * Creates a factory to a set which the dispatch action does not carry data but success does.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @returns A factory to a set which the dispatch action does not carry data but success does.
 */
export function createSet<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TQuery needs to be provided as `undefined` for the overload to work.
  TQuery extends undefined,
  TPayload,
>(): IPayloadSetFactory<TPayload>;
/**
 * Creates a factory to a set which both the dispatch and success actions carry data.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @returns A factory to a set which both the dispatch and success actions carry data.
 */
export function createSet<TQuery, TPayload>(): IFullSetFactory<
  TQuery,
  TPayload
>;
/**
 * Creates a set of action creators.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @template TSource The action source type.
 * @template TName The action set name type.
 * @param source - Origin, from where the action is triggered.
 * @param name - The name of the action set.
 * @returns A set of action creator.
 */
export function createSet<
  TQuery,
  TPayload,
  TSource extends string = string,
  TName extends string = string,
>(
  source?: TSource,
  name?: TName,
):
  | Readonly<IAnySet<TQuery, TPayload, TSource, TName>>
  | IQuerySetFactory<TQuery>
  | IPayloadSetFactory<TPayload>
  | IFullSetFactory<TQuery, TPayload> {
  if (source !== void 0 && name !== void 0) {
    const type = createType(source, name);

    const abort = createAction(
      createDiffType(type, ABORT_DIFF),
      props<IAbortProp>(),
    );

    const dispatchType = createDiffType(type, DISPATCH_DIFF);
    const _dispatch = createAction(dispatchType, props<IQueryProp<TQuery>>());
    type TDispatchType = typeof dispatchType;
    const dispatch = _dispatch as TQuery extends undefined
      ? IEmptyCreator<TDispatchType>
      : IQueryCreator<TQuery, TDispatchType>;

    const failure: IFailureCreator<string> = createAction(
      createDiffType(type, FAILURE_DIFF),
      props<IFailureProp>(),
    );

    const successTyp = createDiffType(type, SUCCESS_DIFF);
    const _success = createAction(successTyp, props<IPayloadProp<TPayload>>());
    type TSuccessType = typeof successTyp;
    const success = _success as TPayload extends undefined
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
  } else {
    return <TSource extends string, TName extends string>(
      source: TSource,
      name: TName,
    ) => createSet<TQuery, TPayload, TSource, TName>(source, name);
  }
}

const REGISTERED_CREATOR_SETS: IAnySet<object, object, string, string>[] = [];

/**
 * A token that injects every action set created with {@link createSet}.
 */
export const REGISTERED_CREATOR_SETS_TOKEN = new InjectionToken(
  'Creators sets',
  {
    providedIn: 'any',
    factory: () => REGISTERED_CREATOR_SETS,
  },
);

/**
 * Configures the Injector to return an array containing all action sets created with {@link createSet} when token {@link REGISTERED_CREATOR_SETS_TOKEN} is injected.
 * @returns A Injector configuration.
 */
export function provideRegisteredCreatorSets(): FactoryProvider {
  return {
    provide: REGISTERED_CREATOR_SETS_TOKEN,
    useFactory: () => REGISTERED_CREATOR_SETS,
  };
}
