import { Component, OnInit } from '@angular/core';
import {ConferenceService} from '../../services/conference/conference.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  constructor(private confService: ConferenceService) {}

  ngOnInit(): void {}

  get participants() {
    return this.confService.all.filter(user => user.type === 'user');
  }

}
