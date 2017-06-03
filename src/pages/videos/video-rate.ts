import { Component } from '@angular/core';

import { App, NavController, ModalController, ViewController } from 'ionic-angular';



@Component({
  templateUrl: 'video-rate.html'
})
export class VideoRatePopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController
  ) { }

  support() {
    this.app.getRootNav().push('SupportPage');
    this.viewCtrl.dismiss();
  }

  close(url: string) {
    window.open(url, '_blank');
    this.viewCtrl.dismiss();
  }
}