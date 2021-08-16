import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ToolsService {

    constructor(private http: HttpClient) {

    }
    sendDisTransformerDetails(transReq): Observable<any> {
        console.log(environment.baseUrl)
        return this.http.post( environment.baseUrl , transReq)
    }
    getTool1Inputs(): Observable<any> { 
        return this.http.get(environment.inputUrl)
    }
}