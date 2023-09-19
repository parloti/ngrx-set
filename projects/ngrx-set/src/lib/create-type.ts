/**
 * Creates the `type` of a set of creators.
 * @template TSource The action source type.
 * @template TName The action set name type.
 * @param source - Origin, from where the action is triggered.
 * @param name - The name of the creator set.
 * @returns The formated name of the creator set.
 */
export function createType<TSource extends string, TName extends string>(
  source: TSource,
  name: TName,
): `[${TSource}] ${TName}` {
  return `[${source}] ${name}`;
}
