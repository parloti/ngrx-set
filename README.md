# NgRxSet

It simplifies the creation of actions for asynchronous requests that can succeed, fail or be aborted.

## Usage

```ts
const set = createSet('source', 'name');
store.dispatch(set.dispatch());
store.dispatch(set.success());
store.dispatch(set.failure());
store.dispatch(set.abort());
```

## Examples

More examples at:

[store.ts#creators](projects/example-app/src/app/store.ts#L17)

[example-effects.ts](projects/example-app/src/app/example-effects.ts)

## API

### IAbortCreator

Creator to be used when the request is aborted.

`type IAbortCreator<TType extends string = string>`

`abort({ reason: 'reason' });`

### IFailureCreator

Creator to be used when the request fails.

`type IFailureCreator<TType extends string = string>`

`failure({ error: 'error' });`

### IQueryCreator

Creator to be used when submitting a query to trigger the request.

`type IQueryCreator<TQuery, TType extends string = string>`

`dispatch({ query: TQuery });`

### IPayloadCreator

Creator to be used when receiving the request payload.

`type IPayloadCreator<TPayload, TType extends string = string>`

`success({ payload: TPayload });`

### IEmptyCreator

Creator to be used without passing data.

`type IEmptyCreator<TType extends string>`

`dispatch();`
`success();`

### ICreatorSet

A set of creators related to a request.

```
interface ICreatorSet<
  TDispatch extends ICreator<object, string> | IEmptyCreator<string>,
  TSuccess extends ICreator<object, string> | IEmptyCreator<string>,
  TReasonType extends string = string,
  TErrorType extends string = string,
> {
  abort: IAbortCreator<TReasonType>;
  dispatch: TDispatch;
  failure: IFailureCreator<TErrorType>;
  success: TSuccess;
}
```

#### ICreatorSet aliases

When neither dispatch nor success carry data.

```
type IEmptySet<
  TSource extends string = string,
  TName extends string = string,
> = ICreatorSet<
  IEmptyCreator<IDispatchType<`${IType<TSource, TName>}`>>,
  IEmptyCreator<ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;

createSet('source', 'name'): IEmptySet<"source", "name">;
```

When the dispatch action carries data but success does not.

```
type IQuerySet<
  TQuery,
  TSource extends string,
  TName extends string,
> = ICreatorSet<
  IQueryCreator<TQuery, IDispatchType<`${IType<TSource, TName>}`>>,
  IEmptyCreator<ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;

createSet<IQuery>('source', 'name'): IQuerySet<IMyQuery, string, string>;
createSet<IQuery, 'source', 'name'>('source', 'name'): IQuerySet<IQuery, "source", "name">;
createSetCurry<IQuery>()('source', 'name'): IQuerySet<IQuery, "source", "name">;
```

When the dispatch action does not carry data but success does.

```
type IPayloadSet<
  TPayload,
  TSource extends string,
  TName extends string,
> = ICreatorSet<
  IEmptyCreator<IDispatchType<`${IType<TSource, TName>}`>>,
  IPayloadCreator<TPayload, ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;

createSet<void, IPayload>('source', 'name'): IPayloadSet<IPayload, string, string>;
createSet<void, IPayload, 'source', 'name'>('source', 'name'): IPayloadSet<IPayload, "source", "name">
createSetCurry<void, IPayload>()('source', 'name'): IPayloadSet<IPayload, "source", "name">;
createPayloadSetCurry<IPayload>()('source', 'name'): IPayloadSet<IPayload, "source", "name">;
```

When both the dispatch and success actions carry data.

```
type IFullSet<
  TQuery,
  TPayload,
  TSource extends string,
  TName extends string,
> = ICreatorSet<
  IQueryCreator<TQuery, IDispatchType<`${IType<TSource, TName>}`>>,
  IPayloadCreator<TPayload, ISuccessType<`${IType<TSource, TName>}`>>,
  IAbortType<`${IType<TSource, TName>}`>,
  IFailureType<`${IType<TSource, TName>}`>
>;

createSet<IQuery, IPayload>('source', 'name'): IFullSet<IQuery, IPayload, string, string>>;
createSet<IQuery, IPayload, 'source', 'name'>('source', 'name'): IFullSet<IQuery, IPayload, "source", "name">;
createSetCurry<IQuery, IPayload>()('source', 'name'): IFullSet<IQuery, IPayload, "source", "name">;
```

## Support

If you like `ngrx-set`, please support it:

- [with a star on GitHub](https://github.com/parloti/ngrx-set)
- [with a tweet](https://twitter.com/intent/tweet?text=Check%20ngrx-set%20package%20%23angular%20%23rxjs%20%23ngrx%26url%3Dhttps%3A%2F%2Fgithub.com%2Fparloti%2Fngrx-set)

Thank you!

P.S. If you need help, feel free to

- Contact me on [twitter](https://twitter.com/parloti) or [linkedin](https://www.linkedin.com/in/parloti/)
- [Open an issue](https://github.com/parloti/ngrx-set/issues)
