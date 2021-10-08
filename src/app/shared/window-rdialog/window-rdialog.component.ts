import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-window-rdialog',
  templateUrl: './window-rdialog.component.html',
  styleUrls: ['./window-rdialog.component.scss']
})
export class WindowRdialogComponent implements OnInit {

  windowFrameType :string[]= ["Windows with wood or PVC-U frames","Windows with metal frames"];
  windowGlazingType:string[]=["single glazing","double glazing","tripole glazing"];
  gapBetweenPanes:string[]=["6mm","12mm","16mm or more"];
  thermalBreak:string[]=["0mm","4mm","8mm","12mm","16mm"];

  constructor(public dialogRef: MatDialogRef<WindowRdialogComponent>, 
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }


  createForm(): FormGroup {
    return this.fb.group({
      windowFrameType: ['', Validators.compose([Validators.required])],
      windowGlazingType: ['', Validators.compose([Validators.required])],
      gapBetweenPanes: ['', Validators.compose([Validators.required])],
      thermalBreak: ['', Validators.compose([Validators.required])],
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
