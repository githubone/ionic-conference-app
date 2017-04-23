import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

const PLACEHOLDER: string = 'assets/img/photo/placeholder.png';
/**
 * Generated class for the Photo page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  private base64Image:string = PLACEHOLDER;
  private placeHolder:string = PLACEHOLDER;

  constructor(private navCtrl: NavController, 
  private navParams: NavParams,
  private camera: Camera,
  private DomSanitizer: DomSanitizer
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Photo');
  }

   takePicture() {
      this.camera.getPicture({
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
        }).then((imageData:any) => {
          this.base64Image = 'data:image/jpeg;base64,' + imageData;
        }, (err:any) => {
          console.error(err);
      });
}

}
