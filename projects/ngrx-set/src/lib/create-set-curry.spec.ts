import { createPayloadSetCurry, createSetCurry } from './create-set-curry';

describe(createSetCurry.name, () => {
  it(`should create a set of creators`, () => {
    const set = createSetCurry()('source', 'name');

    expect(set.dispatch.type).toBe('[source] name (Dispatch)');
    expect(set.success.type).toBe('[source] name (Success)');
    expect(set.failure.type).toBe('[source] name (Failure)');
    expect(set.abort.type).toBe('[source] name (Abort)');
  });
});

describe(createPayloadSetCurry.name, () => {
  it(`should create a set of creators`, () => {
    const set = createPayloadSetCurry()('source', 'name');

    expect(set.dispatch.type).toBe('[source] name (Dispatch)');
    expect(set.success.type).toBe('[source] name (Success)');
    expect(set.failure.type).toBe('[source] name (Failure)');
    expect(set.abort.type).toBe('[source] name (Abort)');
  });
});
