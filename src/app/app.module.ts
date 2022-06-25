import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ConferenceService} from './services/conference/conference.service';
import {ConferenceModule} from './conference/conference.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ConferenceModule,
    BrowserAnimationsModule
  ],
  providers: [
    ConferenceService,
    {
      provide: APP_INITIALIZER,
      useFactory: (svc: ConferenceService) => () => svc.initialize(),
      deps: [ConferenceService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
