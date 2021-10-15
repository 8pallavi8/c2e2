import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-outerwall-adv-level-air',
  templateUrl: './outerwall-adv-level-air.component.html',
  styleUrls: ['./outerwall-adv-level-air.component.scss']
})
export class OuterwallAdvLevelAirComponent implements OnInit {
  chamberSurfaceTypes:string[]=['Superficies de mediana o latanemitancia(caso general)','una o ambas superficies de baja emitancia']
  airLayerThicknessList:number[]=[5,10,20,50,60,70,80,90,100]

  OuterWallFG: FormGroup;
  constructor(public dialogRef: MatDialogRef<OuterwallAdvLevelAirComponent>,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.OuterWallFG = this.createForm();
  }
  createForm(): FormGroup {
    return this.fb.group({
      chamberSurface: ['', Validators.compose([Validators.required])],
      airLayerThickness: ['', Validators.compose([Validators.required])],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submitInput():void{
    this.dialogRef.close({"chamberSurface":this.OuterWallFG.controls['chamberSurface'].value ,"airLayerThickness":this.OuterWallFG.controls['airLayerThickness'].value });
  }
}
