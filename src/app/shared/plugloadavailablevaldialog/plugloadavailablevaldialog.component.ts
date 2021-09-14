import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-plugloadavailablevaldialog',
  templateUrl: './plugloadavailablevaldialog.component.html',
  styleUrls: ['./plugloadavailablevaldialog.component.scss']
})
export class PlugloadavailablevaldialogComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<PlugloadavailablevaldialogComponent>) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
