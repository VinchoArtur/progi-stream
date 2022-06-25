import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observer} from 'rxjs';
import {Participant} from '@voxeet/voxeet-web-sdk/types/models/Participant';
import {MediaStreamWithType} from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import {ConferenceService} from '../../services/conference/conference.service';
import {VideoPanelComponent} from '../video-panel/video-panel.component';
import Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import Peer from 'peerjs';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  @ViewChild(VideoPanelComponent) private videoPanel!: VideoPanelComponent;
  private streamObserver: Observer<{ peer: Participant, stream: MediaStreamWithType, eventType: string }> = null;

  conferenceId: string = null;
  conference: Conference = null;
  name: string = null;
  me: Participant = null;

  peerIdShare: string;
  peerId: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];

  error = null;

  audioActive = false;
  videoActive = false;
  shareScreenActive = false;
  private peer: any;

  constructor(private confService: ConferenceService,
              private route: ActivatedRoute,
              private router: Router) {
    this.initStreamObserver();
    this.peer = new Peer();
    this.getPeerId();
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

  get toggleShareScreen(): string {
    return !this.shareScreenActive ? 'screen_share' : 'stop_screen_share';
  }

  get toggleShareScreenButtonTitle(): string {
    return this.audioActive ? 'Share screen' : 'Stop share screen';
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
      next: ({peer, stream, eventType}) => {
        if (eventType === "streamAdded") {
          this.videoPanel.addParticipant(peer, stream);
        } else if (eventType === "streamUpdated") {
          this.videoPanel.updateParticipant(peer, stream);
        } else if (eventType === "ScreenShare") {
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

  async onToggleShareCastingClick() {
    if (this.shareScreenActive) {
      await this.confService.stopShare();
    } else {
      await this.confService.startShare()
    }
  }



  private getPeerId = () => {
    this.peer.on('open', (id) => {
      this.peerId = id;
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        this.lazyStream = stream;

        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });
      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    });
  }

  connectWithPeer(): void {
    this.callPeer(this.peerIdShare);
  }

  private callPeer(id: string): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;

      const call = this.peer.call(id, stream);
      call.on('stream', (remoteStream) => {
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });
    }).catch(err => {
      console.log(err + 'Unable to connect');
    });
  }

  private streamRemoteVideo(stream: any): void {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    document.getElementById('remote-video').append(video);
  }

  screenShare(): void {
    this.shareScreen();
  }

  private shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }

}
