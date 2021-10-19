import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class beetService {

    private selectedCountry = new ReplaySubject<string>(1);

    private generalDetail = new ReplaySubject<any>(1);
    constructor(private fb: FormBuilder, private http: HttpClient) {
    }

    setGeneralDetails(genralDetails: any) {
        this.generalDetail.next(genralDetails);
    }

    public getGeneralDetails(): ReplaySubject<any> {
        return this.generalDetail;
    }
    setSelectedCountry(country: string) {
        sessionStorage.setItem('selectedCountry', JSON.stringify(country));
        this.selectedCountry.next(country);
    }

    public getSelectedCountry(): ReplaySubject<string> {
        return this.selectedCountry
    }

    getCountries(): Observable<any> {
        return this.http.get(environment.baseUrl + ':9998/api/user/v1/getcountries');
    }

    getGeneralData(countyryCode: string): Observable<any> {
        let params = new HttpParams();
        params = params.append('countrycode', countyryCode);
        console.log(countyryCode)
        return this.http.get(environment.baseUrl + ':9998/api/user/v1/getgeneraldata', { params: params });
    }

    calculateRAir(countrycode: string, surfacecondition: string, thickness: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('countrycode', countrycode);
        params = params.append('surfacecondition', surfacecondition);
        params = params.append('thickness', 'thickness');
        return this.http.get(environment.baseUrl + ':9998/api/user/v1/calculaterair',)
    }


    postGeneralData(payload: any): Observable<any> {
        console.log(payload);
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/postgeneraldata', payload);
    }


    postcalculateRAir(payload: any): Observable<any>{
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculaterair', payload);
    }

    postcalculateAdvancedMaterial(payload: any): Observable<any>{
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateradvancedmaterial', payload);
    }


}