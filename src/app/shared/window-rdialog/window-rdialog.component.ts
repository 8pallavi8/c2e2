import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { beetService } from '../services/beet.service';


export interface windowR {
  frametype: string;
  glazing: string[];
}

@Component({
  selector: 'app-window-rdialog',
  templateUrl: './window-rdialog.component.html',
  styleUrls: ['./window-rdialog.component.scss']
})
export class WindowRdialogComponent implements OnInit {

  /* Frametype :string[]= ["Windows with wood or PVC-U frames","Windows with metal frames"];
  Glazing:string[]=["single glazing","double glazing","tripole glazing"]; */
  gapBetweenPanes:string[]=["6 mm","12 mm","16 mm or more"];
  thermalBreak:string[]=["0 mm","4 mm","8 mm","12 mm","16 mm"];
  thermalBreakOriginal:string[]=["0 mm","4 mm","8 mm","12 mm","16 mm"];
  thermalBreakNotApplicable : string[] = ["Not Applicable"];
  windowRFG:FormGroup;
  windowRData:windowR[];
  glazingList:string[];
  selCountryCode:string;

  constructor(public dialogRef: MatDialogRef<WindowRdialogComponent>, 
    private fb:FormBuilder,private beetService: beetService) { }

  ngOnInit(): void {
    this.windowRFG= this.fb.group({
      windowFrameType: ['', Validators.compose([Validators.required])],
      windowGlazingType: ['', Validators.compose([Validators.required])],
      gapBetweenPanes: ['', Validators.compose([Validators.required])],
      thermalBreak: ['', Validators.compose([Validators.required])],
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => { 
      // console.log("building Envelop "+JSON.stringify(res.success.rvaluewindows));
      this.windowRData=res.success.rvaluewindows;
      console.log(this.windowRData[0].glazing);
    });
  }

  onFrameType(event){
    console.log(event.value);
    this.glazingList = this.windowRData.find(ele => ele.frametype == event.value).glazing;
    if(event.value == 'Windows with wood or PVC-U frames'){
        this.thermalBreak = this.thermalBreakNotApplicable;
    }else {
        this.thermalBreak = this.thermalBreakOriginal;
    }
    console.log(this.glazingList)
  }


  postCalculateWindowR(): void {
   
    var payload: any = {
      "countrycode": this.selCountryCode,
      "frametype": this.windowRFG.controls.windowFrameType.value,
      "glazingtype":this.windowRFG.controls.windowGlazingType.value,
      "gapbtwpanes":this.windowRFG.controls.gapBetweenPanes.value,
      "thermalbreak":this.windowRFG.controls.thermalBreak.value,
    }
    console.log(payload);
    this.beetService.postCalculateWindowR(payload).subscribe(res =>{
      console.log("windowR"+res);
      this.dialogRef.close(res.success);
    })
  }

    onNoClick(): void {
    this.dialogRef.close();
  }

}
