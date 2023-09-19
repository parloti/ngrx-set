import { expectTypeOf } from 'expect-type';
import { createPayloadSetCurry, createSetCurry } from './create-set-curry';
import type { IFullSet, IPayloadSet, IQuerySet } from './icreator-set';

interface IMyQuery {
  body: string;
}
interface IMyPayload {
  data: string;
}

// createSetCurry<IMyQuery>() => IQuerySetCurry<IMyQuery>
{
  const query = createSetCurry<IMyQuery>()('source', 'name');
  expectTypeOf(query).toEqualTypeOf<
    Readonly<IQuerySet<IMyQuery, 'source', 'name'>>
  >();
  expectTypeOf(query).toEqualTypeOf<
    Readonly<IQuerySet<IMyQuery, 'source', 'name'>>
  >();
}

// createSetCurry<undefined, IMyPayload>() => IPayloadSetCurry<IMyPayload>
{
  const payload = createSetCurry<undefined, IMyPayload>()('source', 'name');
  expectTypeOf(payload).toEqualTypeOf<
    Readonly<IPayloadSet<IMyPayload, 'source', 'name'>>
  >();
}

// createSetCurry<IMyQuery, IMyPayload>() => IFullSetCurry<IMyQuery, IMyPayload>
{
  const payload = createSetCurry<IMyQuery, IMyPayload>()('source', 'name');
  expectTypeOf(payload).toEqualTypeOf<
    Readonly<IFullSet<IMyQuery, IMyPayload, 'source', 'name'>>
  >();
}

// createPayloadSetCurry<IMyPayload>() => IPayloadSetCurry<IMyPayload>
{
  const payload = createPayloadSetCurry<IMyPayload>()('source', 'name');
  expectTypeOf(payload).toEqualTypeOf<
    Readonly<IPayloadSet<IMyPayload, 'source', 'name'>>
  >();
}
