import { AlertController, AlertOptions } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
    constructor(private alertCtrl:AlertController){}

extend(...args: any[]): any {
    const newObj:any= { };
    for (const obj of args) {
        for (const key in obj) {
            //copy all the fields
            newObj[key] = obj[key];
        }
    }
    return newObj;
};

showAlert(options: AlertOptions){
    let defaultOption = {
        buttons: ["Done"]
    }
    let alertOptions = this.extend(options,defaultOption)
    let alert = this.alertCtrl.create(alertOptions)
    alert.present();
    }
}