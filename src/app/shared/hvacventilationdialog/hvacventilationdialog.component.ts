import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-hvacventilationdialog',
  templateUrl: './hvacventilationdialog.component.html',
  styleUrls: ['./hvacventilationdialog.component.scss']
})
export class HvacventilationdialogComponent implements OnInit {
  ventilationcubicmt:number;
  ventilationcubicft:number;

  constructor(public dialogRef: MatDialogRef<HvacventilationdialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  enteredPlugLoad() {
    this.dialogRef.close(this.ventilationcubicmt ? this.ventilationcubicmt  : this.ventilationcubicft);
  }
}
