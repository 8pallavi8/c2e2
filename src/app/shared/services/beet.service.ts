import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class beetService {


    constructor(private fb: FormBuilder, private http: HttpClient) {
    }

    getCountries(): Observable<any> {
        return this.http.get(environment.baseUrl + ':9998/api/user/v1/getcountries');
    }

    getGeneralData(countyryCode: string): Observable<any> {
        let params = new HttpParams();
        params=params.append('countrycode', countyryCode);
        console.log(countyryCode)
        return this.http.get(environment.baseUrl + ':9998/api/user/v1/getgeneraldata', { params: params });
    }

    postAnswer(countryid): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/postgeneraldata', countryid);
    }

}