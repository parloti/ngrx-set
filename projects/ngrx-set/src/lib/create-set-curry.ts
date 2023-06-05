import type { IFullSet, IPayloadSet, IQuerySet } from './create-set';
import { createSet } from './create-set';

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

export function createSetCurry<TQuery>(): IQuerySetCurry<TQuery>;
export function createSetCurry<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TQuery extends void,
  TPayload,
>(): IPayloadSetCurry<TPayload>;
export function createSetCurry<TQuery, TPayload>(): IFullSetCurry<
  TQuery,
  TPayload
>;
export function createSetCurry<TQuery, TPayload>():
  | IQuerySetCurry<TQuery>
  | IPayloadSetCurry<TPayload>
  | IFullSetCurry<TQuery, TPayload> {
  return <TSource extends string, TName extends string>(
    source: TSource,
    name: TName,
  ) => createSet<TQuery, TPayload, TSource, TName>(source, name);
}

export const createPayloadSetCurry = <TPayload>() =>
  createSetCurry<void, TPayload>();
