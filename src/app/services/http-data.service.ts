import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {

  url: string = 'https://api-cors-proxy-dz.herokuapp.com/https://api.service24gps.com/api/v1/';
  // url: string = 'api/v1/';

  headers = new HttpHeaders({
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Allow-Headers': 'date,server,x-powered-by,access-control-allow-methods,access-control-allow-credentials,access-control-allow-origin,cache-control,expires,vary,content-encoding,content-length,connection,content-type,x-final-url',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    // 'Cookie': 'PHPSESSID=6vnjk5nuqdcbd'
    // "Cookie": "PHPSESSID=bg52nmn3ccrfe0tavdi34t4s5j"
  });
  
  constructor(
    private http: HttpClient
  ) {

    
  }

  

  getToken( form: FormGroup ) {

    let fd = new FormData();
    fd.append("apikey", "c4db80de426bfb6f779895354de17e1c");
    fd.append("username", "veneto");
    fd.append("password", "veneto33");
    fd.append("token", "");
    const body = {
        'apikey': 'c4db80de426bfb6f779895354de17e1c',
        'token': '',
        'username': 'veneto',
        'password': 'veneto33'
    }
    
    console.log(JSON.stringify(body))
    return this.http.post(this.url+'gettoken', form.value, {headers: this.headers} );
  }
  getData(){
    const body = {
      apikey: 'c4db80de426bfb6f779895354de17e1c',
      token: 'Dcd9/z24Z1k1i56V43zlDiV8qq8yR2ugCFDw0WSiuCVMPOEG/jD8e8aHRjFyKlmf',
      UseUTCDate: 1,
      sensores: 1
    }

    return this.http.post(this.url+'getdata', body, {headers: this.headers});
  }
}
