
import { HttpClient, HttpParams } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ExternalService  {

    constructor(
        private http: HttpClient,
    ) {
       
    }

    /// Get address from geocode google api
    getGoogleAddress(country: string, zipCode: string): Observable<any> {
        let _httpParams = new HttpParams();
        let url : string = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zipCode}|country:${country}&key=AIzaSyDtRvGkjoltD8q2bWqttM_gX04ATGfrUQY`;

        return this.http.get(url, { params: _httpParams, observe: 'response' });
    }

}
