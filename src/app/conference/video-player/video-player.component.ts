import {Component, OnInit, ViewChild} from '@angular/core';
import {MediaStreamWithType} from '@voxeet/voxeet-web-sdk/types/models/MediaStream';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild("video") video: any;

  private videoStream: MediaStreamWithType;

  error = null;

  constructor() {}

  get stream() {
    return this.videoStream;
  }

  set stream(value: MediaStreamWithType) {
    this.videoStream = value;
    if (this.video) {
      if (this.videoStream != null && this.videoStream.getVideoTracks().length) {
        this.video.nativeElement.srcObject = this.videoStream;
        this.video.nativeElement.play();
        //ToDo hack to remove audio stream in video stream
        this.videoStream.getAudioTracks().forEach(track => {
          this.videoStream.removeTrack(track);
        });
      } else {
        this.video.nativeElement.srcObject = null;
      }
    }
  }

  ngOnInit(): void {

  }
}
