import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { VideoModel } from './video.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Events, PopoverController } from 'ionic-angular';
 import {VideoRatePopoverPage} from '../videos/video-rate';

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
    isPlaying: boolean = false;
    videoStatusDisplay = "Play"
    constructor(
        public nav: NavController,
        public navParams: NavParams,
        public storage: Storage,
        public alertCtrl: AlertController,
        public events: Events,
        public inAppBrowser: InAppBrowser,
        public popOver: PopoverController
    ) {
       
        let subject = this.navParams.get("subject");
        this.storage.get("videos").then((storedVideos) => {
            if (storedVideos) {
                // filter based on subject
                this.filteredVideos = _.filter(storedVideos, (video: any) => {
                    return video.Subject === subject;
                })
            }
            //console.log(this.filteredVideos);
            this.videoCtrlSrc = "assets/video/" + this.filteredVideos[0].Name;
            this.videoPosterSrc = "assets/img/videos/" + this.filteredVideos[0].Poster;
            this.filteredVideo = this.filteredVideos[0];
            this.favVisible = this.filteredVideo.isFavourite;
        }); 
    }

    playVideo(event: any) {
        if(this.isPlaying) {
             this.videoCtrl.nativeElement.pause();
             this.videoStatusDisplay = "Play";
        } else {
             this.videoCtrl.nativeElement.play();
              this.videoStatusDisplay = "Pause";
        }
       
       this.isPlaying = ! this.isPlaying;
    }
   
    goToTwitter(){
       this.inAppBrowser.create("https://twitter.com/mavecuk", '_blank')
    }

    rateVideo(event:Event){
      let popover = this.popOver.create(VideoRatePopoverPage);
      popover.present({ev:event});
    }

    toggleFavourite(){
        this.favVisible = !this.favVisible;
        this.filteredVideo.isFavourite =  this.favVisible;
        this.updateStorage()
    }
    updateStorage(){
        this.storage.get("videos").then((storedVideos)=>{
            if(storedVideos){
             
               let videoToUpdate =  _.find(storedVideos, (video: any) => {
                    return video.Subject === this.filteredVideo.Subject;
                })
                var index = _.indexOf(storedVideos, videoToUpdate);
                
                if(index !== -1) {

                    storedVideos.splice(index,1, this.filteredVideo)  
                    // update storage with changed video item
                    this.storage.set("videos", storedVideos).then(()=> {
                    // tell whoever who wants to know storage has changed
                    this.events.publish("storechange");
                });
                }         
            }
        })
    }
}