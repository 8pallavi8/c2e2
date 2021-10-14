import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BEETSummary } from "../models/models";

@Injectable({
    providedIn: 'root'
})
export class ToolsService {


    constructor(private fb: FormBuilder,private http: HttpClient) {
   
    }
    sendDisTransformerDetails(transReq): Observable<any> {
        console.log(environment.baseUrl)
        return this.http.post( environment.baseUrl+':9999/api/v1/tool1' , transReq)
    }
    getTool1Inputs(): Observable<any> { 
        return this.http.get(environment.baseUrl+':9999/api/v1/getddvalues')
    }
}