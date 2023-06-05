import { TypedAction } from '@ngrx/store/src/models';
import { expectTypeOf } from 'expect-type';
import {
  createSet,
  IEmptySet,
  IFullSet,
  IPayloadSet,
  IQuerySet,
} from './create-set';
import {
  IAbortCreator,
  IAction,
  IEmptyCreator,
  IFailureCreator,
  IPayloadCreator,
  IQueryCreator,
} from './creators';
import {
  IAbortProp,
  IFailureProp,
  IPayloadProp,
  IQueryProp,
} from './properties';

type IMyQuery = { body: string };
type IMyPayload = { data: string };

// createSet => IEmptySet
{
  const empty = createSet('source', 'name');
  expectTypeOf(empty).toEqualTypeOf<Readonly<IEmptySet<'source', 'name'>>>();

  // Abort
  expectTypeOf(empty.abort).toEqualTypeOf<
    IAbortCreator<'[source] name (Abort)'>
  >();
  expectTypeOf(empty.abort.type).toEqualTypeOf<'[source] name (Abort)'>();
  expectTypeOf(empty.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, '[source] name (Abort)'>
  >();
  expectTypeOf(empty.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(empty.dispatch).toEqualTypeOf<
    IEmptyCreator<'[source] name (Dispatch)'>
  >();
  expectTypeOf(empty.dispatch.type).toEqualTypeOf<'[source] name (Dispatch)'>();
  expectTypeOf(empty.dispatch).returns.toEqualTypeOf<
    TypedAction<'[source] name (Dispatch)'>
  >();
  expectTypeOf(empty.dispatch).parameters.toEqualTypeOf<[]>();

  // Failure
  expectTypeOf(empty.failure).toEqualTypeOf<
    IFailureCreator<'[source] name (Failure)'>
  >();
  expectTypeOf(empty.failure.type).toEqualTypeOf<'[source] name (Failure)'>();
  expectTypeOf(empty.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, '[source] name (Failure)'>
  >();
  expectTypeOf(empty.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(empty.success).toEqualTypeOf<
    IEmptyCreator<'[source] name (Success)'>
  >();
  expectTypeOf(empty.success.type).toEqualTypeOf<'[source] name (Success)'>();
  expectTypeOf(empty.success).returns.toEqualTypeOf<
    TypedAction<'[source] name (Success)'>
  >();
  expectTypeOf(empty.success).parameters.toEqualTypeOf<[]>();
}

// createSet<IMyQuery> => IQuerySet
{
  const query = createSet<IMyQuery>('source', 'name');
  expectTypeOf(query).toEqualTypeOf<
    Readonly<IQuerySet<IMyQuery, string, string>>
  >();

  // Abort
  expectTypeOf(query.abort).toEqualTypeOf<
    IAbortCreator<`[${string}] ${string} (Abort)`>
  >();
  expectTypeOf(
    query.abort.type,
  ).toEqualTypeOf<`[${string}] ${string} (Abort)`>();
  expectTypeOf(query.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, `[${string}] ${string} (Abort)`>
  >();
  expectTypeOf(query.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(query.dispatch).toEqualTypeOf<
    IQueryCreator<IMyQuery, `[${string}] ${string} (Dispatch)`>
  >();
  expectTypeOf(
    query.dispatch.type,
  ).toEqualTypeOf<`[${string}] ${string} (Dispatch)`>();
  expectTypeOf(query.dispatch).returns.toEqualTypeOf<
    IAction<IQueryProp<IMyQuery>, `[${string}] ${string} (Dispatch)`>
  >();
  expectTypeOf(query.dispatch).parameters.toEqualTypeOf<
    [IQueryProp<IMyQuery>]
  >();

  // Failure
  expectTypeOf(query.failure).toEqualTypeOf<
    IFailureCreator<`[${string}] ${string} (Failure)`>
  >();
  expectTypeOf(
    query.failure.type,
  ).toEqualTypeOf<`[${string}] ${string} (Failure)`>();
  expectTypeOf(query.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, `[${string}] ${string} (Failure)`>
  >();
  expectTypeOf(query.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(query.success).toEqualTypeOf<
    IEmptyCreator<`[${string}] ${string} (Success)`>
  >();
  expectTypeOf(
    query.success.type,
  ).toEqualTypeOf<`[${string}] ${string} (Success)`>();
  expectTypeOf(query.success).returns.toEqualTypeOf<
    TypedAction<`[${string}] ${string} (Success)`>
  >();
  expectTypeOf(query.success).parameters.toEqualTypeOf<[]>();
}

// createSet<IMyQuery, TSource> => IQuerySet
{
  const query = createSet<IMyQuery, 'source'>('source', 'name');
  expectTypeOf(query).toEqualTypeOf<
    Readonly<IQuerySet<IMyQuery, 'source', string>>
  >();

  // Abort
  expectTypeOf(query.abort).toEqualTypeOf<
    IAbortCreator<`[source] ${string} (Abort)`>
  >();
  expectTypeOf(query.abort.type).toEqualTypeOf<`[source] ${string} (Abort)`>();
  expectTypeOf(query.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, `[source] ${string} (Abort)`>
  >();
  expectTypeOf(query.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(query.dispatch).toEqualTypeOf<
    IQueryCreator<IMyQuery, `[source] ${string} (Dispatch)`>
  >();
  expectTypeOf(
    query.dispatch.type,
  ).toEqualTypeOf<`[source] ${string} (Dispatch)`>();
  expectTypeOf(query.dispatch).returns.toEqualTypeOf<
    IAction<IQueryProp<IMyQuery>, `[source] ${string} (Dispatch)`>
  >();
  expectTypeOf(query.dispatch).parameters.toEqualTypeOf<
    [IQueryProp<IMyQuery>]
  >();

  // Failure
  expectTypeOf(query.failure).toEqualTypeOf<
    IFailureCreator<`[source] ${string} (Failure)`>
  >();
  expectTypeOf(
    query.failure.type,
  ).toEqualTypeOf<`[source] ${string} (Failure)`>();
  expectTypeOf(query.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, `[source] ${string} (Failure)`>
  >();
  expectTypeOf(query.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(query.success).toEqualTypeOf<
    IEmptyCreator<`[source] ${string} (Success)`>
  >();
  expectTypeOf(
    query.success.type,
  ).toEqualTypeOf<`[source] ${string} (Success)`>();
  expectTypeOf(query.success).returns.toEqualTypeOf<
    TypedAction<`[source] ${string} (Success)`>
  >();
  expectTypeOf(query.success).parameters.toEqualTypeOf<[]>();
}
// createSet<IMyQuery, TSource, TName> => IQuerySet
{
  const query = createSet<IMyQuery, 'source', 'name'>('source', 'name');
  expectTypeOf(query).toEqualTypeOf<
    Readonly<IQuerySet<IMyQuery, 'source', 'name'>>
  >();

  // Abort
  expectTypeOf(query.abort).toEqualTypeOf<
    IAbortCreator<'[source] name (Abort)'>
  >();
  expectTypeOf(query.abort.type).toEqualTypeOf<'[source] name (Abort)'>();
  expectTypeOf(query.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, '[source] name (Abort)'>
  >();
  expectTypeOf(query.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(query.dispatch).toEqualTypeOf<
    IQueryCreator<IMyQuery, '[source] name (Dispatch)'>
  >();
  expectTypeOf(query.dispatch.type).toEqualTypeOf<'[source] name (Dispatch)'>();
  expectTypeOf(query.dispatch).returns.toEqualTypeOf<
    IAction<IQueryProp<IMyQuery>, '[source] name (Dispatch)'>
  >();
  expectTypeOf(query.dispatch).parameters.toEqualTypeOf<
    [IQueryProp<IMyQuery>]
  >();

  // Failure
  expectTypeOf(query.failure).toEqualTypeOf<
    IFailureCreator<'[source] name (Failure)'>
  >();
  expectTypeOf(query.failure.type).toEqualTypeOf<'[source] name (Failure)'>();
  expectTypeOf(query.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, '[source] name (Failure)'>
  >();
  expectTypeOf(query.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(query.success).toEqualTypeOf<
    IEmptyCreator<'[source] name (Success)'>
  >();
  expectTypeOf(query.success.type).toEqualTypeOf<'[source] name (Success)'>();
  expectTypeOf(query.success).returns.toEqualTypeOf<
    TypedAction<'[source] name (Success)'>
  >();
  expectTypeOf(query.success).parameters.toEqualTypeOf<[]>();
}

// createSet<void, IMyPayload> => IPayloadSet
{
  const payload = createSet<void, IMyPayload>('source', 'name');
  expectTypeOf(payload).toEqualTypeOf<
    Readonly<IPayloadSet<IMyPayload, string, string>>
  >();

  // Abort
  expectTypeOf(payload.abort).toEqualTypeOf<
    IAbortCreator<`[${string}] ${string} (Abort)`>
  >();
  expectTypeOf(
    payload.abort.type,
  ).toEqualTypeOf<`[${string}] ${string} (Abort)`>();
  expectTypeOf(payload.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, `[${string}] ${string} (Abort)`>
  >();
  expectTypeOf(payload.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(payload.dispatch).toEqualTypeOf<
    IEmptyCreator<`[${string}] ${string} (Dispatch)`>
  >();
  expectTypeOf(
    payload.dispatch.type,
  ).toEqualTypeOf<`[${string}] ${string} (Dispatch)`>();
  expectTypeOf(payload.dispatch).returns.toEqualTypeOf<
    TypedAction<`[${string}] ${string} (Dispatch)`>
  >();
  expectTypeOf(payload.dispatch).parameters.toEqualTypeOf<[]>();

  // Failure
  expectTypeOf(payload.failure).toEqualTypeOf<
    IFailureCreator<`[${string}] ${string} (Failure)`>
  >();
  expectTypeOf(
    payload.failure.type,
  ).toEqualTypeOf<`[${string}] ${string} (Failure)`>();
  expectTypeOf(payload.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, `[${string}] ${string} (Failure)`>
  >();
  expectTypeOf(payload.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(payload.success).toEqualTypeOf<
    IPayloadCreator<IMyPayload, `[${string}] ${string} (Success)`>
  >();
  expectTypeOf(
    payload.success.type,
  ).toEqualTypeOf<`[${string}] ${string} (Success)`>();
  expectTypeOf(payload.success).returns.toEqualTypeOf<
    IAction<IPayloadProp<IMyPayload>, `[${string}] ${string} (Success)`>
  >();
  expectTypeOf(payload.success).parameters.toEqualTypeOf<
    [IPayloadProp<IMyPayload>]
  >();
}
// createSet<void, IMyPayload, TSource> => IPayloadSet
{
  const payload = createSet<void, IMyPayload, 'source'>('source', 'name');
  expectTypeOf(payload).toEqualTypeOf<
    Readonly<IPayloadSet<IMyPayload, 'source', string>>
  >();

  // Abort
  expectTypeOf(payload.abort).toEqualTypeOf<
    IAbortCreator<`[source] ${string} (Abort)`>
  >();
  expectTypeOf(
    payload.abort.type,
  ).toEqualTypeOf<`[source] ${string} (Abort)`>();
  expectTypeOf(payload.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, `[source] ${string} (Abort)`>
  >();
  expectTypeOf(payload.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(payload.dispatch).toEqualTypeOf<
    IEmptyCreator<`[source] ${string} (Dispatch)`>
  >();
  expectTypeOf(
    payload.dispatch.type,
  ).toEqualTypeOf<`[source] ${string} (Dispatch)`>();
  expectTypeOf(payload.dispatch).returns.toEqualTypeOf<
    TypedAction<`[source] ${string} (Dispatch)`>
  >();
  expectTypeOf(payload.dispatch).parameters.toEqualTypeOf<[]>();

  // Failure
  expectTypeOf(payload.failure).toEqualTypeOf<
    IFailureCreator<`[source] ${string} (Failure)`>
  >();
  expectTypeOf(
    payload.failure.type,
  ).toEqualTypeOf<`[source] ${string} (Failure)`>();
  expectTypeOf(payload.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, `[source] ${string} (Failure)`>
  >();
  expectTypeOf(payload.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(payload.success).toEqualTypeOf<
    IPayloadCreator<IMyPayload, `[source] ${string} (Success)`>
  >();
  expectTypeOf(
    payload.success.type,
  ).toEqualTypeOf<`[source] ${string} (Success)`>();
  expectTypeOf(payload.success).returns.toEqualTypeOf<
    IAction<IPayloadProp<IMyPayload>, `[source] ${string} (Success)`>
  >();
  expectTypeOf(payload.success).parameters.toEqualTypeOf<
    [IPayloadProp<IMyPayload>]
  >();
}
// createSet<void, IMyPayload, TSource, TName> => IPayloadSet
{
  const payload = createSet<void, IMyPayload, 'source', 'name'>(
    'source',
    'name',
  );
  expectTypeOf(payload).toEqualTypeOf<
    Readonly<IPayloadSet<IMyPayload, 'source', 'name'>>
  >();

  // Abort
  expectTypeOf(payload.abort).toEqualTypeOf<
    IAbortCreator<'[source] name (Abort)'>
  >();
  expectTypeOf(payload.abort.type).toEqualTypeOf<'[source] name (Abort)'>();
  expectTypeOf(payload.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, '[source] name (Abort)'>
  >();
  expectTypeOf(payload.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(payload.dispatch).toEqualTypeOf<
    IEmptyCreator<'[source] name (Dispatch)'>
  >();
  expectTypeOf(
    payload.dispatch.type,
  ).toEqualTypeOf<'[source] name (Dispatch)'>();
  expectTypeOf(payload.dispatch).returns.toEqualTypeOf<
    TypedAction<'[source] name (Dispatch)'>
  >();
  expectTypeOf(payload.dispatch).parameters.toEqualTypeOf<[]>();

  // Failure
  expectTypeOf(payload.failure).toEqualTypeOf<
    IFailureCreator<'[source] name (Failure)'>
  >();
  expectTypeOf(payload.failure.type).toEqualTypeOf<'[source] name (Failure)'>();
  expectTypeOf(payload.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, '[source] name (Failure)'>
  >();
  expectTypeOf(payload.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(payload.success).toEqualTypeOf<
    IPayloadCreator<IMyPayload, '[source] name (Success)'>
  >();
  expectTypeOf(payload.success.type).toEqualTypeOf<'[source] name (Success)'>();
  expectTypeOf(payload.success).returns.toEqualTypeOf<
    IAction<IPayloadProp<IMyPayload>, '[source] name (Success)'>
  >();
  expectTypeOf(payload.success).parameters.toEqualTypeOf<
    [IPayloadProp<IMyPayload>]
  >();
}

// createSet<IMyQuery, IMyPayload> => IFullSet
{
  const full = createSet<IMyQuery, IMyPayload>('source', 'name');
  expectTypeOf(full).toEqualTypeOf<
    Readonly<IFullSet<IMyQuery, IMyPayload, string, string>>
  >();

  // Abort
  expectTypeOf(full.abort).toEqualTypeOf<
    IAbortCreator<`[${string}] ${string} (Abort)`>
  >();
  expectTypeOf(
    full.abort.type,
  ).toEqualTypeOf<`[${string}] ${string} (Abort)`>();
  expectTypeOf(full.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, `[${string}] ${string} (Abort)`>
  >();
  expectTypeOf(full.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(full.dispatch).toEqualTypeOf<
    IQueryCreator<IMyQuery, `[${string}] ${string} (Dispatch)`>
  >();
  expectTypeOf(
    full.dispatch.type,
  ).toEqualTypeOf<`[${string}] ${string} (Dispatch)`>();
  expectTypeOf(full.dispatch).returns.toEqualTypeOf<
    IAction<IQueryProp<IMyQuery>, `[${string}] ${string} (Dispatch)`>
  >();
  expectTypeOf(full.dispatch).parameters.toEqualTypeOf<
    [IQueryProp<IMyQuery>]
  >();

  // Failure
  expectTypeOf(full.failure).toEqualTypeOf<
    IFailureCreator<`[${string}] ${string} (Failure)`>
  >();
  expectTypeOf(
    full.failure.type,
  ).toEqualTypeOf<`[${string}] ${string} (Failure)`>();
  expectTypeOf(full.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, `[${string}] ${string} (Failure)`>
  >();
  expectTypeOf(full.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(full.success).toEqualTypeOf<
    IPayloadCreator<IMyPayload, `[${string}] ${string} (Success)`>
  >();
  expectTypeOf(
    full.success.type,
  ).toEqualTypeOf<`[${string}] ${string} (Success)`>();
  expectTypeOf(full.success).returns.toEqualTypeOf<
    IAction<IPayloadProp<IMyPayload>, `[${string}] ${string} (Success)`>
  >();
  expectTypeOf(full.success).parameters.toEqualTypeOf<
    [IPayloadProp<IMyPayload>]
  >();
}
// createSet<IMyQuery, IMyPayload, TSource> => IFullSet
{
  const full = createSet<IMyQuery, IMyPayload, 'source'>('source', 'name');
  expectTypeOf(full).toEqualTypeOf<
    Readonly<IFullSet<IMyQuery, IMyPayload, 'source', string>>
  >();

  // Abort
  expectTypeOf(full.abort).toEqualTypeOf<
    IAbortCreator<`[source] ${string} (Abort)`>
  >();
  expectTypeOf(full.abort.type).toEqualTypeOf<`[source] ${string} (Abort)`>();
  expectTypeOf(full.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, `[source] ${string} (Abort)`>
  >();
  expectTypeOf(full.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(full.dispatch).toEqualTypeOf<
    IQueryCreator<IMyQuery, `[source] ${string} (Dispatch)`>
  >();
  expectTypeOf(
    full.dispatch.type,
  ).toEqualTypeOf<`[source] ${string} (Dispatch)`>();
  expectTypeOf(full.dispatch).returns.toEqualTypeOf<
    IAction<IQueryProp<IMyQuery>, `[source] ${string} (Dispatch)`>
  >();
  expectTypeOf(full.dispatch).parameters.toEqualTypeOf<
    [IQueryProp<IMyQuery>]
  >();

  // Failure
  expectTypeOf(full.failure).toEqualTypeOf<
    IFailureCreator<`[source] ${string} (Failure)`>
  >();
  expectTypeOf(
    full.failure.type,
  ).toEqualTypeOf<`[source] ${string} (Failure)`>();
  expectTypeOf(full.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, `[source] ${string} (Failure)`>
  >();
  expectTypeOf(full.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(full.success).toEqualTypeOf<
    IPayloadCreator<IMyPayload, `[source] ${string} (Success)`>
  >();
  expectTypeOf(
    full.success.type,
  ).toEqualTypeOf<`[source] ${string} (Success)`>();
  expectTypeOf(full.success).returns.toEqualTypeOf<
    IAction<IPayloadProp<IMyPayload>, `[source] ${string} (Success)`>
  >();
  expectTypeOf(full.success).parameters.toEqualTypeOf<
    [IPayloadProp<IMyPayload>]
  >();
}
// createSet<IMyQuery, IMyPayload, TSource, TName> => IFullSet
{
  const full = createSet<IMyQuery, IMyPayload, 'source', 'name'>(
    'source',
    'name',
  );
  expectTypeOf(full).toEqualTypeOf<
    Readonly<IFullSet<IMyQuery, IMyPayload, 'source', 'name'>>
  >();

  // Abort
  expectTypeOf(full.abort).toEqualTypeOf<
    IAbortCreator<'[source] name (Abort)'>
  >();
  expectTypeOf(full.abort.type).toEqualTypeOf<'[source] name (Abort)'>();
  expectTypeOf(full.abort).returns.toEqualTypeOf<
    IAction<IAbortProp, '[source] name (Abort)'>
  >();
  expectTypeOf(full.abort).parameters.toEqualTypeOf<[IAbortProp]>();

  // Dispatch
  expectTypeOf(full.dispatch).toEqualTypeOf<
    IQueryCreator<IMyQuery, `[source] name (Dispatch)`>
  >();
  expectTypeOf(full.dispatch.type).toEqualTypeOf<`[source] name (Dispatch)`>();
  expectTypeOf(full.dispatch).returns.toEqualTypeOf<
    IAction<IQueryProp<IMyQuery>, `[source] name (Dispatch)`>
  >();
  expectTypeOf(full.dispatch).parameters.toEqualTypeOf<
    [IQueryProp<IMyQuery>]
  >();

  // Failure
  expectTypeOf(full.failure).toEqualTypeOf<
    IFailureCreator<'[source] name (Failure)'>
  >();
  expectTypeOf(full.failure.type).toEqualTypeOf<'[source] name (Failure)'>();
  expectTypeOf(full.failure).returns.toEqualTypeOf<
    IAction<IFailureProp, '[source] name (Failure)'>
  >();
  expectTypeOf(full.failure).parameters.toEqualTypeOf<[IFailureProp]>();

  // Success
  expectTypeOf(full.success).toEqualTypeOf<
    IPayloadCreator<IMyPayload, '[source] name (Success)'>
  >();
  expectTypeOf(full.success.type).toEqualTypeOf<'[source] name (Success)'>();
  expectTypeOf(full.success).returns.toEqualTypeOf<
    IAction<IPayloadProp<IMyPayload>, '[source] name (Success)'>
  >();
  expectTypeOf(full.success).parameters.toEqualTypeOf<
    [IPayloadProp<IMyPayload>]
  >();
}
