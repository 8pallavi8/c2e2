import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { environment } from "src/environments/environment";
import { Summary } from "../models/beet-models";

@Injectable({
    providedIn: 'root'
})
export class beetService {

    private selectedCountry = new ReplaySubject<string>(1);

    private generalDetail = new ReplaySubject<any>(1);

    private selectedProvince = new ReplaySubject<string>(1);

    private selectedBuildingType = new ReplaySubject<string>(1);

    private selectedBuildingSpaces = new ReplaySubject<string[]>(1);

    private buildingGrossArea = new ReplaySubject<number>(1);

    private buildingGrossAreaUnits = new ReplaySubject<string>(1);

    constructor(private fb: FormBuilder, private http: HttpClient) {
    }

    setGeneralDetails(genralDetails: any) {
        this.generalDetail.next(genralDetails);
    }

    public getGeneralDetails(): ReplaySubject<any> {
        return this.generalDetail;
    }

    public saveSummary(summary: Summary) {
        sessionStorage.setItem('summary', JSON.stringify(summary));
    }

    setSelectedCountry(country: string) {
        sessionStorage.setItem('selectedCountry', JSON.stringify(country));
        this.selectedCountry.next(country);
    }
    public getSelectedCountry(): ReplaySubject<string> {
        return this.selectedCountry
    }


    setSelectedProvince(province: string) {
        sessionStorage.setItem('selectedProvince', JSON.stringify(province));
        this.selectedProvince.next(province);
    }
    public getSelectedProvince(): ReplaySubject<string> {
        return this.selectedProvince
    }


    setSelectedbuildingType(buidlingType: string) {
        sessionStorage.setItem('selectedbuildingType', JSON.stringify(buidlingType));
        this.selectedBuildingType.next(buidlingType);
    }
    public getSelectedbuildingType(): ReplaySubject<string> {
        return this.selectedBuildingType
    }


    setSelectedbuildingSpaces(buidlingSpaces: string[]) {
        this.selectedBuildingSpaces.next(buidlingSpaces);
    }
    public getSelectedbuildingSpaces(): ReplaySubject<string[]> {
        return this.selectedBuildingSpaces
    }

    setBuildingGrossArea(grossarea: number) {
        this.buildingGrossArea.next(grossarea);
    }
    public getBuildingGrossArea(): ReplaySubject<number> {
        return this.buildingGrossArea
    }

    setBuildingGrossAreaUnits(grossareaunits: string) {
        this.buildingGrossAreaUnits.next(grossareaunits);
    }
    public getBuildingGrossAreaUnits(): ReplaySubject<string> {
        return this.buildingGrossAreaUnits
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


    postGeneralData(payload: any): Observable<any> {
        console.log(payload);
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/postgeneraldata', payload);
    }


    postcalculateRAir(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculaterair', payload);
    }

    postcalculateAdvancedMaterial(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateradvancedmaterial', payload);
    }


    postCalculateWindowR(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculaterwindow', payload);
    }


    postCalculateshgc(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateshgc', payload);
    }

    postCalculateOccupancyPeople(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateoccupancypeople', payload);
    }


    postCalculateOccupancyUnknown(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateoccupancyunknown', payload);
    }

    postCalculateEquipEfficiency(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateefficiency', payload);
    }


    postCalculateVentilationRate(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateventilationrate', payload);
    }

    postCalculateFuelEmissionFactor(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculatefuelemissionfactor', payload);
    }

    postCalculateLightingPower(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculatelightingpower', payload);
    }


    postCalculatePlugLoad(payload: any): Observable<any> {
        return this.http.post(environment.baseUrl + ':9998/api/user/v1/calculateplugloaddensity', payload);
    }





}