import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-plugloadinputdialog',
  templateUrl: './plugloadinputdialog.component.html',
  styleUrls: ['./plugloadinputdialog.component.scss']
})
export class PlugloadinputdialogComponent implements OnInit {
  plugloadvaluesqft:number;
  plugloadvaluesqmt:number;


  constructor(public dialogRef: MatDialogRef<PlugloadinputdialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  enteredPlugLoad() {
    this.dialogRef.close(this.plugloadvaluesqft ? this.plugloadvaluesqft  : this.plugloadvaluesqmt);
  }
}
