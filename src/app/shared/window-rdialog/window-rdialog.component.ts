import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-window-rdialog',
  templateUrl: './window-rdialog.component.html',
  styleUrls: ['./window-rdialog.component.scss']
})
export class WindowRdialogComponent implements OnInit {

  windowFrameType = ["Windows with wood or PVC-U frames","Windows with metal frames"];
 
  constructor(public dialogRef: MatDialogRef<WindowRdialogComponent>) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
