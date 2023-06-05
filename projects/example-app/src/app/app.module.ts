import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { ExampleEffects } from './example-effects';
import { reducer } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducer, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictActionTypeUniqueness: true,
        strictActionWithinNgZone: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
      },
    }),
    EffectsModule.forRoot(ExampleEffects),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
