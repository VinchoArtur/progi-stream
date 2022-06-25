import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-create-conference',
  templateUrl: './create-conference.component.html',
  styleUrls: ['./create-conference.component.scss']
})
export class CreateConferenceComponent {
  conferenceId = null;
  conferenceForm = this.formBuilder.group({
    alias: '',
    pinCode: '',
    dolbyVoice: true,
    liveRecording: false,
    rtcpMode: 'average',
    videoCodec: 'H264'
  });

  constructor(
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  async onSubmit(): Promise<void> {
    // Process checkout data here
    this.conferenceId = uuid();
    await this.storage.save({id: this.conferenceId, options: this.conferenceForm.value});
  }

  onJoinClick() {
    this.router.navigate(['/join-conference', { id: this.conferenceId }]);
  }
}
