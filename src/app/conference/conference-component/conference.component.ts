import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observer} from 'rxjs';
import {Participant} from '@voxeet/voxeet-web-sdk/types/models/Participant';
import {MediaStreamWithType} from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import {ConferenceService} from '../../services/conference/conference.service';
import {VideoPanelComponent} from '../video-panel/video-panel.component';
import Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  @ViewChild(VideoPanelComponent) private videoPanel! : VideoPanelComponent;
  private streamObserver: Observer<{ peer: Participant, stream: MediaStreamWithType, eventType: string }> = null;

  conferenceId: string = null;
  conference: Conference = null;
  name: string = null;
  me: Participant = null;

  error = null;

  audioActive = false;
  videoActive = false;

  constructor(private confService: ConferenceService,
              private route: ActivatedRoute,
              private router: Router) {
    this.initStreamObserver();
  }

  get toggleAudioButtonTitle(): string {
    return this.audioActive ? 'Mute Audio' : 'Unmute Audio';
  }

  get toggleAudioButtonIcon(): string {
    return this.audioActive ? 'voice_over_off' : 'record_voice_over';
  }

  get toggleVideoButtonTitle(): string {
    return this.videoActive ? 'Disable Video' : 'Enable Video';
  }

  get toggleVideoButtonIcon(): string {
    return this.videoActive ? 'videocam_off' : 'videocam';
  }

  async ngOnInit(): Promise<void> {
    // read conference id and participant name from URI
    this.conferenceId = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');

    try {
      // create conference or join to existing
      const conf = await this.confService.join(
        this.conferenceId,
        this.name,
        this.streamObserver
      );
      this.conference = conf;

      this.audioActive = true;
      this.videoActive = false;

      this.me = this.confService.me;
    } catch (err) {
      this.error = err;
    }
  }

  private initStreamObserver() {
    this.streamObserver = {
      next: ({ peer, stream, eventType }) => {
        if (eventType === "streamAdded") {
          this.videoPanel.addParticipant(peer, stream);
        } else if (eventType === "streamUpdated") {
          this.videoPanel.updateParticipant(peer, stream);
        } else {
          this.videoPanel.removeParticipant(peer);
        }
      },
      error: (errorMessage) => {
        this.error = errorMessage;
      },
      complete: () => {
      }
    };
  }

  async onToggleAudioClick() {
    if (this.audioActive) {
      await this.confService.stopAudio();
    } else {
      await this.confService.startAudio();
    }

    this.audioActive = !this.audioActive;
  }

  async onToggleVideoClick() {
    if (this.videoActive) {
      await this.confService.stopVideo();
    } else {
      await this.confService.startVideo();
    }

    this.videoActive = !this.videoActive;
  }

  async onLeaveClick() {
    await this.confService.leave();
    await this.router.navigate(['/']);
  }

}
