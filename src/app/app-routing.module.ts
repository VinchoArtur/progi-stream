import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WelcomPageConferenceComponent} from './conference/welcom-page-conference/welcom-page-conference.component';
import {CreateConferenceComponent} from './conference/create-conference/create-conference.component';
import {JoinConferenceComponent} from './conference/join-conference/join-conference.component';
import {ConferenceComponent} from './conference/conference-component/conference.component';

const routes: Routes = [
  {path: '', component: WelcomPageConferenceComponent},
  {path: 'welcome-page', component: WelcomPageConferenceComponent},
  {path: 'create-conference', component: CreateConferenceComponent},
  {path: 'join-conference', component: JoinConferenceComponent},
  {path: 'conference', component: ConferenceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
