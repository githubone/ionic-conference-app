import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { VideoModel } from './video.model';
import { File } from 'ionic-native';
import { InAppBrowser } from 'ionic-native';

declare var cordova: any;

@Component({
    templateUrl: 'video-detail.html'
})

export class VideoDetailPage {
    @ViewChild('videoControl') videoCtrl: ElementRef;
    localVideos: string[];
    queryText = 'search..';
    filteredVideos: VideoModel[] = [];
    filteredVideo:VideoModel = new VideoModel();
    videoCtrlSrc: string = '';
    videoPosterSrc:string= '';
    favVisible: boolean = true;
    constructor(
        public nav: NavController,
        public navParams: NavParams,
        public storage: Storage,
        public alertCtrl: AlertController
    ) {
       
        let subject = this.navParams.get("subject");
        this.storage.get("videos").then((storedVideos) => {
            if (storedVideos) {
                // filter based on subject
                this.filteredVideos = _.filter(storedVideos, (video: any) => {
                    return video.Subject === subject;
                })
            }
            console.log(this.filteredVideos);
            this.videoCtrlSrc = "assets/video/" + this.filteredVideos[0].Name;
            this.videoPosterSrc = "assets/img/videos/" + this.filteredVideos[0].Poster;
            this.filteredVideo = this.filteredVideos[0];
        });
       
        
    }

    playVideo(event: any) {
        this.videoCtrl.nativeElement.play();
    }

    goToTwitter(){
        new InAppBrowser('https://twitter.com/BBC','_blank');
    }

    toggleFavourite(){
        this.favVisible = !this.favVisible;
    }

    
}