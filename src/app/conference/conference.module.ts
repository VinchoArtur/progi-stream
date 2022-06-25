import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConferenceComponent} from './conference-component/conference.component';
import {WelcomPageConferenceComponent} from './welcom-page-conference/welcom-page-conference.component';
import {CreateConferenceComponent} from './create-conference/create-conference.component';
import {JoinConferenceComponent} from './join-conference/join-conference.component';
import {VideoPanelComponent} from './video-panel/video-panel.component';
import {VideoPanelDirective} from './directive/video-panel.directive';
import {VideoPlayerComponent} from './video-player/video-player.component';
import {ParticipantsComponent} from './participants/participants.component';
import {MatIconModule} from '@angular/material/icon';
import {TopBarComponent} from './top-bar/top-bar.component';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    ConferenceComponent,
    WelcomPageConferenceComponent,
    CreateConferenceComponent,
    JoinConferenceComponent,
    VideoPanelComponent,
    VideoPanelDirective,
    VideoPlayerComponent,
    ParticipantsComponent,
    TopBarComponent,
  ],
  exports: [
    TopBarComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        FormsModule
    ]
})
export class ConferenceModule {
}
