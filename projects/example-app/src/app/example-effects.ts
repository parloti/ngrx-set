import { Inject, Injectable, InjectionToken, isDevMode } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, type Action } from '@ngrx/store';
import {
  REGISTERED_CREATOR_SETS_TOKEN,
  catchFailure,
  onExhaustMap,
  onSwitchMap,
  pluckError,
  pluckPayload,
  pluckQuery,
  pluckReason,
} from 'ngrx-set';
import {
  delay,
  filter,
  ignoreElements,
  map,
  merge,
  of,
  pairwise,
  take,
  tap,
} from 'rxjs';
import { creators } from './store';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  public get(body: string) {
    return of({ data: body }).pipe(delay(1000));
  }
}

type IInjected<TToken> = TToken extends InjectionToken<infer TInjected>
  ? TInjected
  : never;

@Injectable()
export class ExampleEffects extends class {
  constructor(
    protected readonly actions$: Actions,
    protected readonly creatorSets: IInjected<
      typeof REGISTERED_CREATOR_SETS_TOKEN
    >,
  ) {}
} {
  constructor(
    actions$: Actions,
    @Inject(REGISTERED_CREATOR_SETS_TOKEN)
    creatorSets: IInjected<typeof REGISTERED_CREATOR_SETS_TOKEN>,
    private readonly store$: Store,
    private readonly exampleService: ExampleService,
  ) {
    super(actions$, creatorSets);
  }

  example1_dispatch_switch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(creators.full2.dispatch),
      pluckQuery(),
      onSwitchMap(
        query =>
          this.exampleService.get(query.body).pipe(
            map(payload => creators.full2.success({ payload })),

            catchFailure(creators.full2.failure),
          ),
        () =>
          this.store$.dispatch(creators.full2.abort({ reason: 'switched' })),
      ),
    ),
  );

  example2_success$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(creators.full2.success),
        pluckPayload(),
        tap(payload => console.log(payload.data)),
      ),
    { dispatch: false },
  );

  example3_failure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(creators.full2.failure),
        pluckError(),
        tap(error => console.log(error)),
      ),
    { dispatch: false },
  );

  example4_abort$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(creators.full2.abort),
        pluckReason(),
        tap(reason => console.log(reason)),
      ),
    { dispatch: false },
  );

  example5_dispatch_exhaust$ = createEffect(() =>
    this.actions$.pipe(
      ofType(creators.full2.dispatch),
      pluckQuery(),
      onExhaustMap(
        query =>
          this.exampleService.get(query.body).pipe(
            map(payload => creators.full2.success({ payload })),

            catchFailure(creators.full2.failure),
          ),
        () =>
          this.store$.dispatch(creators.full2.abort({ reason: 'exhausting' })),
      ),
    ),
  );

  example6_loading$ = createEffect(() => {
    const loads$ = this.creatorSets.map(creator => {
      const setReference = creator.dispatch.type;
      const start$ = this.actions$.pipe(
        ofType(creator.dispatch),
        map(() => creators.loading({ [setReference]: true })),
      );
      const end$ = this.actions$.pipe(
        ofType(creator.success, creator.failure, creator.abort),
        map(() => creators.loading({ [setReference]: false })),
      );
      return merge(start$, end$);
    });

    return merge(...loads$);
  });

  example6_guard$ = createEffect(
    () => {
      const SEQ_ERR_MSG = 'Actions in a set cannot be triggered sequentially.';
      const OUT_ORD_ERR_MSG =
        'Actions of a set must be triggered in the following order "dispatch" -> "success" | "failure" | "abort".';

      const throwError = (msg: string, curr: Action, prev?: Action) => {
        const error = new Error(msg);
        console.error(error, '\n', { curr, prev });
        throw error;
      };

      const throwSeqError = (curr: Action, prev?: Action) =>
        throwError(SEQ_ERR_MSG, curr, prev);

      const throwOutOfOrderError = (curr: Action, prev?: Action) =>
        throwError(OUT_ORD_ERR_MSG, curr, prev);

      const guards$ = this.creatorSets.map(set => {
        const start$ = this.actions$.pipe(ofType(set.dispatch));
        const end$ = this.actions$.pipe(
          ofType(set.success, set.failure, set.abort),
        );
        const through$ = merge(start$, end$).pipe(filter(isDevMode));
        const guardFirst$ = through$.pipe(
          take(1),
          ofType(set.success, set.failure, set.abort),
          tap(throwOutOfOrderError),
        );
        const guardSequence$ = through$.pipe(
          pairwise(),
          tap(([prev, curr]) => {
            if (prev.type === curr.type) {
              throwSeqError(curr, prev);
            }
            if (
              prev.type !== set.dispatch.type &&
              curr.type !== set.dispatch.type
            ) {
              throwOutOfOrderError(curr, prev);
            }
          }),
        );

        const guard$ = merge(guardFirst$, guardSequence$).pipe(
          ignoreElements(),
        );
        return guard$;
      });

      return merge(...guards$);
    },
    { dispatch: false },
  );
}
