import { expectTypeOf } from 'expect-type';
import { IFullSet, IPayloadSet, IQuerySet } from './create-set';
import { createPayloadSetCurry, createSetCurry } from './create-set-curry';

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

// createSetCurry<void, IMyPayload>() => IPayloadSetCurry<IMyPayload>
{
  const payload = createSetCurry<void, IMyPayload>()('source', 'name');
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
