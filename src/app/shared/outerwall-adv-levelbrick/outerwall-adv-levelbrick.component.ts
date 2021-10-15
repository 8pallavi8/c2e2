import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


export interface materialElement {
  Esquema: string;
  material: string;
  Densidad: number;
  /* e: number;
  h: number;
  l: number;
  masa: number;
  R: number; */
}

@Component({
  selector: 'app-outerwall-adv-levelbrick',
  templateUrl: './outerwall-adv-levelbrick.component.html',
  styleUrls: ['./outerwall-adv-levelbrick.component.scss']
})
export class OuterwallAdvLevelbrickComponent implements OnInit {
  displayedColumns = [ 'Esquema', 'material', 'Densidad','selected'];
  
  selectedElement: materialElement;

  constructor(public dialogRef: MatDialogRef<OuterwallAdvLevelbrickComponent>) { }

  ngOnInit(): void {
  }

   R_DATA: materialElement[] = [
    {Esquema: 'Hydrogen', material: '', Densidad:1 ,}
  ];

  dataSource = this.R_DATA;


  onNoClick(): void {
    this.dialogRef.close();
  }
}
