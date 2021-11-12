import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from '../services/beet.service';


export interface materialElement {
  brickimg: string;
  material: string;
  density: string;
  emeasure: string;
  hmeasure: string;
  lmeasure: string;
  mass: number;
  rvalue: number; 
}



@Component({
  selector: 'app-outerwall-adv-levelbrick',
  templateUrl: './outerwall-adv-levelbrick.component.html',
  styleUrls: ['./outerwall-adv-levelbrick.component.scss']
})
export class OuterwallAdvLevelbrickComponent implements OnInit {
  displayedColumns = [ 'Esquema', 'Material', 'Densidad','e','h','l','masa','R','selected'];
  lastDisplayedCols = [ 'e','h','l'];
  rvaluewalladvancedData: materialElement[];
  dataSource: any;
  selectedElement: materialElement;
  

  constructor(public dialogRef: MatDialogRef<OuterwallAdvLevelbrickComponent>,private beetService: beetService) { }
  ngOnInit(): void {
    this.beetService.getGeneralDetails().subscribe(res => { 
      this.rvaluewalladvancedData=res.success.rvaluewalladvanced;
      this.dataSource = this.rvaluewalladvancedData;
    });
  }
 
  selectedR($event: any, row:materialElement){
    console.info("clicked", $event);
    this.dialogRef.close(row.rvalue); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
