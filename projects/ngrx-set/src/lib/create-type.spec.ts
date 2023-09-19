import { createType } from './create-type';

describe(createType.name, () => {
  it(`should create a 'type'`, () => {
    const expected = '[source] name';
    const result = createType('source', 'name');

    expect(result).toBe(expected);
  });
});
