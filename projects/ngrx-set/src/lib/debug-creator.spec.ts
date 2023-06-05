import { type ActionCreator, createAction, props } from '@ngrx/store';
import { debugCreator } from './debug-creator';

describe(debugCreator.name, () => {
  it(`should have creator 'type'`, () => {
    const creator = createAction('some creator type');
    const expected = creator.type;
    const delegate = debugCreator(creator);
    const result = delegate.type;
    expect(result).toBe(expected);
  });

  it(`should delegate call`, () => {
    const creatorSpy = jasmine.createSpy(
      'creator spy',
    ) as jasmine.Spy<ActionCreator> & ActionCreator;
    const delegate = debugCreator(creatorSpy);
    const props = Object.freeze({
      key: 'value',
    });

    delegate(props);

    expect(creatorSpy).toHaveBeenCalledOnceWith(props);
  });

  it(`should not change the creator`, () => {
    const creator = createAction('source', props<{ error: string }>());
    const original = creator({ error: 'error' });
    const surrogate = debugCreator(creator)({ error: 'error' });
    expect(original).toEqual(surrogate);
  });
});
