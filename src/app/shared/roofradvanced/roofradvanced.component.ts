import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { beetService } from '../services/beet.service';



export interface RvalueRoofAdvanced {
  foamimg: string;
  hdimension: number;
  ldimension: string;
  uwinter: number;
  usummer: number;
  rwinter: number;
  rsummer: number;
}

@Component({
  selector: 'app-roofradvanced',
  templateUrl: './roofradvanced.component.html',
  styleUrls: ['./roofradvanced.component.scss']
})
export class RoofradvancedComponent implements OnInit {
  displayedColumns = [ 'Tipo de fojado', 'h', 'L','Invierno','Verano','Invierno(w)','Verano(s)','select'];
  lastDisplayedCols = [ 'h', 'L','Invierno','Verano','Invierno(w)','Verano(s)'];
  rValueRoofAdvancedData: RvalueRoofAdvanced[];
  dataSource: any;
  selectedElement: RvalueRoofAdvanced;

  constructor(public dialogRef: MatDialogRef<RoofradvancedComponent>,private beetService: beetService) { }

  ngOnInit(): void {
    this.beetService.getGeneralDetails().subscribe(res => { 
      this.rValueRoofAdvancedData=res.success.rvalueroofadvanced;
      this.dataSource = this.rValueRoofAdvancedData;
    });
  }

  selectedR($event: any, row:RvalueRoofAdvanced){
    console.info("clicked", $event);
    this.dialogRef.close(row.rwinter); 
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
