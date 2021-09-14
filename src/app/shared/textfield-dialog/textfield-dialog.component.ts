import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-textfield-dialog',
  templateUrl: './textfield-dialog.component.html',
  styleUrls: ['./textfield-dialog.component.scss']
})
export class TextfieldDialogComponent implements OnInit {
  
  displayedColumns=["unitsoptions","onsiteco2value"];

  constructor(
    public dialogRef: MatDialogRef<TextfieldDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
