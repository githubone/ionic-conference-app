import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VideoService {
     dataUrl:string = //'http://mavesodatav4.azurewebsites.net/odata/Issues';
     'assets/data/videos.json';
    videos:any[] = [];
    constructor(private http: Http) {
    }

    getVideosAsync(){

         return this.http.get(this.dataUrl)
           .map(res=> res.json())
           .catch((err:any)=> this.handleError(err))
           //.catch((error:any)=> Observable.throw(error.json(),error) || 'server error')
    }

    handleError(error:Response | any):Observable<any>{
      let errmessage  = '';
      if(error instanceof Response){
       errmessage = `${error.status}-${error.statusText ||''}-${error.url || '' }`;
      }else {
        errmessage  = error.message? error.message : error.toString();
      }

      return Observable.throw(errmessage);
    }

}