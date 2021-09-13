import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-textfield-dialog',
  templateUrl: './textfield-dialog.component.html',
  styleUrls: ['./textfield-dialog.component.scss']
})
export class TextfieldDialogComponent implements OnInit {
  unitslist=["kgCO2/mmbtu","lbsCO2/mmbtu","kgCO2/therm","lbsCO2/therm","kgCO2/kcal","lbsCO2/kcal","kgCO2/m3","lbsCO2/ft3","metrictonsCO2/Mcf"]
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
