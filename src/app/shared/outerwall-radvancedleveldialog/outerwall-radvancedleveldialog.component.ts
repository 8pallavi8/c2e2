import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from '../services/beet.service';

export interface AdvancedMaterialTable {
  mainmaterial?:string;
  otherdata?:OtherData[];
}

export interface OtherData{
  mainmaterialcategory?: string;
  subcategory1?: string;
  subcategory2?: string;
  bulkdensity?: string;
  thermcalconductivityfrom?: number;
  thermcalconductivityto?: number;
}

@Component({
  selector: 'app-outerwall-radvancedleveldialog',
  templateUrl: './outerwall-radvancedleveldialog.component.html',
  styleUrls: ['./outerwall-radvancedleveldialog.component.scss']
})

export class OuterwallRadvancedleveldialogComponent implements OnInit {
  displayedColumns:string[]=["MATERIAL SUB-CATEGORY 1","MATERIAL SUB-CATEGORY 2","DENSIDAD APARENTE","CONDUCTIVIDAD TERMICA","CONDUCTIVIDAD TERMICA(to)","selected","THICKNESS"];
  OuterWallAdvFG:FormGroup;
  rvalueadvancedmaterialData:AdvancedMaterialTable[];
  otherTableData:OtherData[];
  dataSource:any;
  

  constructor(public dialogRef: MatDialogRef<OuterwallRadvancedleveldialogComponent>,
    private fb: FormBuilder,private beetService:beetService) { }

  ngOnInit(): void {
    this.beetService.getGeneralDetails().subscribe(res => { 
      //console.log("building Envelop "+JSON.stringify(res.success.buildingdata));
      this.rvalueadvancedmaterialData=res.success.advancedmaterialtable;

    });
    this.OuterWallAdvFG=this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      elements: ['', Validators.compose([Validators.required])],
      layers: ['', Validators.compose([Validators.required])]

    });
  }

  onChangeMaterial(event){
    console.log(event.value);
   let tempData = this.rvalueadvancedmaterialData.find(ele => ele.mainmaterial == event.value);
   console.log(tempData.otherdata);
   this.dataSource = new MatTableDataSource(tempData.otherdata);
  }


  selectedR($event: any, row:OtherData){
    console.info("clicked", $event);
    console.log(row.thermcalconductivityfrom);
    this.dialogRef.close(row.thermcalconductivityfrom); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
