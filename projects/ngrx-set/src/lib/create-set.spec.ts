import { TestBed } from '@angular/core/testing';
import {
  createSet,
  provideRegisteredCreatorSets,
  REGISTERED_CREATOR_SETS_TOKEN,
} from './create-set';

describe(createSet.name, () => {
  it(`should create a set of creators`, () => {
    const set = createSet('source', 'name');

    expect(set.dispatch.type).toBe('[source] name (Dispatch)');
    expect(set.success.type).toBe('[source] name (Success)');
    expect(set.failure.type).toBe('[source] name (Failure)');
    expect(set.abort.type).toBe('[source] name (Abort)');
  });

  it(`should create factory of a set of creators`, () => {
    const set = createSet()('source', 'name');

    expect(set.dispatch.type).toBe('[source] name (Dispatch)');
    expect(set.success.type).toBe('[source] name (Success)');
    expect(set.failure.type).toBe('[source] name (Failure)');
    expect(set.abort.type).toBe('[source] name (Abort)');
  });

  it(`should inject all created sets`, () => {
    const set = createSet('source', 'name');
    TestBed.configureTestingModule({});
    const register = TestBed.inject(REGISTERED_CREATOR_SETS_TOKEN);

    expect(register).toContain(set);
  });

  it(`should provide register`, () => {
    const provider = provideRegisteredCreatorSets();

    expect(provider.provide).toBe(REGISTERED_CREATOR_SETS_TOKEN);
    TestBed.configureTestingModule({});
    const register = TestBed.inject(REGISTERED_CREATOR_SETS_TOKEN);

    expect(provider.useFactory()).toBe(register);
  });
});
