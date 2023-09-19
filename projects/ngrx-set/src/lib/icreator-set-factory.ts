import type { IFullSet, IPayloadSet, IQuerySet } from './icreator-set';

/**
 * Represents a factory to a set which the dispatch action carries data but success does not.
 * @template TQuery Data type carried by the dispatch action.
 */
export type IQuerySetFactory<TQuery> = <
  TSource extends string,
  TName extends string,
>(
  source: TSource,
  name: TName,
) => Readonly<IQuerySet<TQuery, TSource, TName>>;
/**
 * Represents a factory to a set which the dispatch action does not carry data but success does.
 * @template TPayload Data type carried by the success action.
 */
export type IPayloadSetFactory<TPayload> = <
  TSource extends string,
  TName extends string,
>(
  source: TSource,
  name: TName,
) => Readonly<IPayloadSet<TPayload, TSource, TName>>;
/**
 * Represents a factory to a set which both the dispatch and success actions carry data.
 * @template TQuery Data type carried by the dispatch action.
 * @template TPayload Data type carried by the success action.
 */
export type IFullSetFactory<TQuery, TPayload> = <
  TSource extends string,
  TName extends string,
>(
  source: TSource,
  name: TName,
) => Readonly<IFullSet<TQuery, TPayload, TSource, TName>>;
