export function createType<TSource extends string, TName extends string>(
  source: TSource,
  name: TName,
): `[${TSource}] ${TName}` {
  return `[${source}] ${name}`;
}
