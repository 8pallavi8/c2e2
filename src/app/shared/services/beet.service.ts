import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class beetService {


    constructor(private fb: FormBuilder,private http: HttpClient) {
    }
    /* postRegistration(): Observable<any> {
        return this.http.post( environment.registrationUrl)
    }
     getQuestion(params): Observable<any> { 
        return this.http.get(environment.questionUrl,params);
    }
    postAnswer(answer): Observable<any> {
        return this.http.post( environment.answerUrl , answer);
    }  */
}