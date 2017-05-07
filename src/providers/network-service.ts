import { Network} from '@ionic-native/network';
import { Injectable} from '@angular/core';
import { AlertController, AlertOptions } from 'ionic-angular';
//import { AlertSerivce } from '../alert-service';
// unable to use AlertService in constructor of this //service

@Injectable()
export class NetworkService {
    private disconnected: boolean = false;
    constructor(
        private alertCtrl:AlertController,
        private network: Network
        ) {
            
        }

    public registerNetwork() {
        debugger;
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
             debugger;
             this.showAlert({title: 'Connection Status',subTitle: 'No connection.. !'})
        });
        
        // stop disconnect watch
        //disconnectSubscription.unsubscribe();

        let connectSubscription = 
          this.network.onConnect().subscribe(()=> {
              debugger;
              this.showAlert({title: 'Connection Status',subTitle: 'Connection establish..!'})
        })
        
        // stop connect watch
        //connectSubscription.unsubscribe();
    }
    private extend(...args: any[]): any {
        const newObj:any= { };
        for (const obj of args) {
            for (const key in obj) {
                //copy all the fields
                newObj[key] = obj[key];
            }
        }
        return newObj;
    };

    private showAlert(options: AlertOptions){
        let defaultOption = {
            buttons: ["Done"]
        }
        let alertOptions = this.extend(options,defaultOption)
        let alert = this.alertCtrl.create(alertOptions)
        alert.present();
    }
}
        

