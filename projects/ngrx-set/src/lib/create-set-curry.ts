import { createSet } from './create-set';
import type { IFullSet, IPayloadSet, IQuerySet } from './icreator-set';

type IQuerySetCurry<TQuery> = <TSource extends string, TName extends string>(
  source: TSource,
  name: TName,
) => Readonly<IQuerySet<TQuery, TSource, TName>>;
type IPayloadSetCurry<TPayload> = <
  TSource extends string,
  TName extends string,
>(
  source: TSource,
  name: TName,
) => Readonly<IPayloadSet<TPayload, TSource, TName>>;
type IFullSetCurry<TQuery, TPayload> = <
  TSource extends string,
  TName extends string,
>(
  source: TSource,
  name: TName,
) => Readonly<IFullSet<TQuery, TPayload, TSource, TName>>;

/**
 * Creates a factory to a set which the dispatch action carries data but success does not.
 * @template TQuery Data type carried by the dispatch action.
 * @returns A factory to a set which the dispatch action carries data but success does not.
 * @deprecated Will be revomed in the next version, use {@link createSet<TQuery>(): IQuerySetFactory<TQuery>}.
 */
export function createSetCurry<TQuery>(): IQuerySetCurry<TQuery>;
/**
 * Creates a factory to a set which the dispatch action does not carry data but success does.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @returns A factory to a set which the dispatch action does not carry data but success does.
 * @deprecated Will be revomed in the next version, use {@link createSet<TQuery extends undefined, TPayload>(): IPayloadSetFactory<TPayload>}.
 */
export function createSetCurry<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TQuery needs to be provided as `undefined` for the overload to work.
  TQuery extends undefined,
  TPayload,
>(): IPayloadSetCurry<TPayload>;
/**
 * Creates a factory to a set which both the dispatch and success actions carry data.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @returns A factory to a set which both the dispatch and success actions carry data.
 * @deprecated Will be revomed in the next version, use {@link createSet<TQuery extends undefined, TPayload>(): IFullSetFactory<TQuery, TPayload>}.
 */
export function createSetCurry<TQuery, TPayload>(): IFullSetCurry<
  TQuery,
  TPayload
>;
/**
 * Creates a factory to a set of action creators.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 * @returns A factory to a set which both the dispatch and success actions carry data.
 * @deprecated Will be revomed in the next version, use {@link createSet<TQuery, TPayload>(): IFullSetFactory<TQuery, TPayload>}.
 */
export function createSetCurry<TQuery, TPayload>():
  | IQuerySetCurry<TQuery>
  | IPayloadSetCurry<TPayload>
  | IFullSetCurry<TQuery, TPayload> {
  return <TSource extends string, TName extends string>(
    source: TSource,
    name: TName,
  ) => createSet<TQuery, TPayload, TSource, TName>(source, name);
}

/**
 * Creates a factory to a set which the dispatch action does not carry data but success does.
 * @template TPayload Data type carried by the success action.
 * @returns A factory to a set which the dispatch action does not carry data but success does.
 * @deprecated Will be revomed in the next version, use {@link createSet<undefined, TPayload>(): IPayloadSetFactory<TQuery, TPayload>}.
 */
export const createPayloadSetCurry: <
  TPayload,
>() => IPayloadSetCurry<TPayload> = <TPayload>(): IPayloadSetCurry<TPayload> =>
  createSetCurry<undefined, TPayload>();
