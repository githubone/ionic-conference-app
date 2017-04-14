import { Component, AfterViewInit, OnInit,
OnDestroy, DoCheck, OnChanges,AfterContentInit,
AfterContentChecked, AfterViewChecked
} from '@angular/core';
import { NavController, AlertController, AlertOptions } from 'ionic-angular';
//import { NotificationPage } from '../notification/notification';
import { VideoModel } from './video.model';
import { VideoService } from '../../providers/video-service'
import { VideoDetailPage } from './video-detail';
import { Storage } from '@ionic/storage';
import { AlertService } from '../../providers/alert-service';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';

enum VideoTypes {
  all,
  music,
  comedy
}

enum VideosTypes {
  tv =0,
  music=1,
  comedy=2
}

@Component({
  selector: 'video-page',
  templateUrl: 'video.html'
})
export class VideoPage implements AfterViewInit, 
OnInit,OnDestroy,DoCheck, OnChanges, AfterContentChecked, AfterContentInit{
  queryText = '';
  videos: VideoModel[] = [];
  videoType: string = '0';
  pageTitleWithVideosTotal:string = '';
  constructor(
    private nav: NavController,
    private service: VideoService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private alertService: AlertService,
    private events: Events
  ) {
    this.storage.get("videos").then((storedVideos) => {
      if (storedVideos && storedVideos.length > 0) {
          this.updateVideosListing(); 
      } else {
        //this.storage.get("networkconnection").then((networkconnection) => {
          //if (networkconnection && networkconnection) {
            //this.alertService.showAlert({title: 'Connection Status',subTitle: 'Network connection detected !'})
            this.service.getVideosAsync()
            .subscribe((data: any) => {
                  //data.value
                  this.storage.set("videos", data ).then(()=> {
                  this.updateVideosListing();
              })
            },
            (res)=> this.alertService.showAlert({ title: 'Connection Issue. Try again later', subTitle: res }));  
          //} else {
           // this.alertService.showAlert({ title: 'Connection Status', subTitle: 'No //Network connection detected !' })
          //}
        //})
      }
    });

  }

  ngOnInit() {
    //console.log('init');
    // Properties are resolved and things like
    // this.mapWindow and this.mapControls
    // had a chance to resolve from the
    // two child components <map-window> and <map-controls>

   // update list from store when store changed
   this.events.subscribe("storechange",()=> {
    // console.log('store change')
     this.storage.get("videos").then((storeVideos)=> {
       if(storeVideos && storeVideos.length > 0){
         this.updateVideosListing(); 
       }
     })
   })
  }
  ngOnDestroy() {
      //console.log('destroy');
      // Speak now or forever hold your peace
  }
  ngDoCheck() {
      //console.log('check');
      // Custom change detection
  }
  ngOnChanges() {
      //  console.log('changes');
      // Called right after our bindings have been checked but only
      // if one of our bindings has changed.
      //
      // changes is an object of the format:
      // {
      //   'prop': PropertyUpdate
      // }
  }
  ngAfterContentInit() {
      // console.log('content init');
      // Component content has been initialized
  }
  ngAfterContentChecked() {
      //console.log('content checked');// Component content has been Checked
  }
  ngAfterViewInit() {
      //console.log('view init');
      // Component views are initialized
  }
  ngAfterViewChecked() {
      //console.log('after checked');// Component views have been checked
  }

  setPageTitleWithVideosTotal(){
    this.pageTitleWithVideosTotal = "Videos(" + this.videos.length + ")";
  }
 
 updateVideosListing() {
  //this.filterByVideoType();
   this.storage.get("videos").then((storedVideos) => {
      if (storedVideos && storedVideos.length > 0) {
               if(this.queryText.length == 0){
                    this.filterByVideosTypes(storedVideos);
                    return;
               }
               // filter based on subject and VideoType
              let filteredList = _.filter(storedVideos, (video: any) => {
                    return video.Subject.toUpperCase().indexOf(this.queryText.toUpperCase()) > -1 && video.VideoType == Number(this.videoType)
                })

                 _.map  (filteredList, (item: VideoModel)=> {
                    item.Thumbnail = "assets/img/videos/" + item.Thumbnail;
                })
                this.videos = filteredList;
                this.setPageTitleWithVideosTotal();
      } else {
      
          this.setPageTitleWithVideosTotal()
      }
   });
 }

 filterByVideosTypes(storedVideos:VideoModel[]){
    let filteredList = _.filter(storedVideos, (video: any) => {
                    return video.VideoType == Number(this.videoType);
             })
    _.map(filteredList, (item: VideoModel)=> {
      item.Thumbnail = "assets/img/videos/" + item.Thumbnail;
    })
    this.videos = filteredList;
    this.setPageTitleWithVideosTotal();
 }
 

  goto(val: string) {
    this.nav.push(VideoDetailPage, {
      subject: val
    })
    //this.nav.setRoot(VideoDetailPage);
  }

  remove(video:VideoModel){
       //console.log(video);
       //console.log(this.videos.length);
      _.remove(this.videos,(v:VideoModel)=> {
            return v.Name == video.Name;
      });

      //console.log(this.videos.length);
  }
  // favourite(video:VideoModel){
  //     //console.log(video);
  //     let videoToFavourite = _.find(this.videos, (v:VideoModel)=> {
  //         return v.Name == video.Name;
  //     });
  //     videoToFavourite.isFavourite = !videoToFavourite.isFavourite;
  // }

  
}

