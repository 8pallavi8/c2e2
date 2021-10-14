import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-outerwall-adv-levelbrick',
  templateUrl: './outerwall-adv-levelbrick.component.html',
  styleUrls: ['./outerwall-adv-levelbrick.component.scss']
})
export class OuterwallAdvLevelbrickComponent implements OnInit {
  displayedColumns = [ 'weight', 'symbol','selected'];
  
  selectedElement: PeriodicElement;

  constructor(public dialogRef: MatDialogRef<OuterwallAdvLevelbrickComponent>) { }

  ngOnInit(): void {
  }

   ELEMENT_DATA: PeriodicElement[] = [
    {  name: 'Hydrogen', weight: 1.0079, symbol: 'H',position: 1 },
    {  name: 'Helium', weight: 4.0026, symbol: 'He' ,position: 2},
    {  name: 'Lithium', weight: 6.941, symbol: 'Li',position: 3 },
  ];

  dataSource = this.ELEMENT_DATA;



  onNoClick(): void {
    this.dialogRef.close();
  }
}
