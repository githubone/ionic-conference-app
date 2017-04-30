import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import * as exif from 'exif-js';
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
  private base64Image: string = PLACEHOLDER;
  private PLACEHOLDER: string = PLACEHOLDER;
  private coords: Coordinates = null;
  private locationLoading: boolean = false;
  private image: Blob = null;
  
  
  constructor(
    
    private navCtrl: NavController,
    private DomSanitizer: DomSanitizer,
    private platform: Platform,
    private camera: Camera
  ) {}

  savePicture() {
    if (this.image) {
      const metadata = { contentType: (this.image as any).type };

      const filename = `image-${new Date().getTime()}.jpg`;
      //this.photoStorage.uploadPicture(this.image, this.coords, filename, metadata)
       // .then(() => this.resetImage())
       // .catch(() => this.resetImage());
    }
  }

  resetImage() {
    this.coords = null;
    this.image = null;
    this.base64Image = this.PLACEHOLDER;
  }

  

  takePicture() {
    if (this.base64Image === this.PLACEHOLDER) {
      this.camera.getPicture({
        correctOrientation: true,
        targetWidth: 720,
        destinationType: this.camera.DestinationType.FILE_URI,
      }).then((fileData) => {
        this.locationLoading = true;
        return this.makeBlobFromFile(fileData);
      }).then((imageData) => {
        return this.rotateImage(imageData);
      }).then((rotatedData: Blob) => {
        this.image = rotatedData;
        const urlCreator = window.URL || (window as any).webkitURL;
        this.base64Image = urlCreator.createObjectURL(rotatedData);
        //this.getGeoCoords().then(coords => this.coords = coords);
      });
    } else {
      this.resetCoords();
      this.base64Image = this.PLACEHOLDER;
    }
  }

  

  resetCoords() {
    this.coords = null;
    this.image = null;
  }

  makeBlobFromFile(file:any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      (window as any).resolveLocalFileSystemURL(file, (fileEntry:any) => {
        fileEntry.file((resFile:any) => {
          const reader = new FileReader();
          reader.onloadend = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };
          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  rotateImage(imageBlob:any): Promise<Blob> {
    const urlCreator = window.URL || (window as any).webkitURL;
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        exif.getData(img, function () {
          let width = img.width,
              height = img.height,
              canvas = document.createElement('canvas'),
              ctx = canvas.getContext("2d"),
              srcOrientation = exif.getTag(this, "Orientation");

          if ([5,6,7,8].indexOf(srcOrientation) > -1) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: ctx.transform(1, 0, 0, 1, 0, 0);
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => resolve(blob))
        });
      }

      img.src = urlCreator.createObjectURL(imageBlob);
    });
  }
}