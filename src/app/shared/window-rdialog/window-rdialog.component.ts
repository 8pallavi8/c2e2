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
  gapBetweenPanes:string[]=["6mm","12mm","16mm or more"];
  thermalBreak:string[]=["0mm","4mm","8mm","12mm","16mm"];
  windowRFG:FormGroup;
  windowRData:windowR[];
  glazingList:string[];

  constructor(public dialogRef: MatDialogRef<WindowRdialogComponent>, 
    private fb:FormBuilder,private beetService: beetService) { }

  ngOnInit(): void {
    this.windowRFG= this.fb.group({
      windowFrameType: ['', Validators.compose([Validators.required])],
      windowGlazingType: ['', Validators.compose([Validators.required])],
      gapBetweenPanes: ['', Validators.compose([Validators.required])],
      thermalBreak: ['', Validators.compose([Validators.required])],
    });

    this.beetService.getGeneralDetails().subscribe(res => { 
      // console.log("building Envelop "+JSON.stringify(res.success.rvaluewindows));
      this.windowRData=res.success.rvaluewindows;
      console.log(this.windowRData[0].glazing);
    });
  }

  onFrameType(event){
    console.log(event.value);
    this.glazingList = this.windowRData.find(ele => ele.frametype == event.value).glazing;
    console.log(this.glazingList)
  }

    onNoClick(): void {
    this.dialogRef.close();
  }

}
