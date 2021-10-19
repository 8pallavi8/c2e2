import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from '../services/beet.service';
import { textfieldsdialogComponent } from '../textfieldsdialog/textfieldsdialog.component';

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
  dialog: any;
  

  constructor(public dialogRef: MatDialogRef<OuterwallRadvancedleveldialogComponent>,
    private fb: FormBuilder,
    private beetService:beetService,
    public innerDialogRef: MatDialogRef<textfieldsdialogComponent>) { }

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
      layers: ['', Validators.compose([Validators.required])],
    });
  }

  onChangeMaterial(event){
    console.log(event.value);
   let tempData = this.rvalueadvancedmaterialData.find(ele => ele.mainmaterial == event.value);
   console.log(tempData.otherdata);
   this.dataSource = new MatTableDataSource(tempData.otherdata);
  }


  selectedR(event: any, row:OtherData){
    this.openThicknessDialog();
    console.info("clicked", event);
    console.log(row.thermcalconductivityfrom);
    //this.dialogRef.close(row.thermcalconductivityfrom); 
  }

  public openThicknessDialog() {
    const dialogref = this.dialog.open(textfieldsdialogComponent, {
      width: '80%',
      autoFocus: false,
      maxHeight: '100vh',
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
    
    });
  }



  postcalculateAdvancedMaterial(): void {
    var payload: any = {
   
      "thermalconductivity": this.OuterWallAdvFG.controls.surfacecondition.value,
      "thickness": this.OuterWallAdvFG.controls.airLayerThickness.value
    }
    this.beetService.postcalculateRAir(payload).subscribe(res =>{
      console.log(res);
      this.onNoClick();
    })
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
