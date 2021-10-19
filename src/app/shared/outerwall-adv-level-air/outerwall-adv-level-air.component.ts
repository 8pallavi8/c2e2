import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { beetService } from '../services/beet.service';

@Component({
  selector: 'app-outerwall-adv-level-air',
  templateUrl: './outerwall-adv-level-air.component.html',
  styleUrls: ['./outerwall-adv-level-air.component.scss']
})
export class OuterwallAdvLevelAirComponent implements OnInit {
  surfaceemittance: string[];
  airLayerThicknessList: number[] = [5, 10, 20, 50, 60, 70, 80, 90, 100];
  selCountryCode: string;

  OuterWallFG: FormGroup;
  constructor(public dialogRef: MatDialogRef<OuterwallAdvLevelAirComponent>, private fb: FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.OuterWallFG = this.createForm();
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      this.surfaceemittance = res.success.airtabledropdown.surfaceemittance;
    });
  }
  createForm(): FormGroup {
    return this.fb.group({
      surfacecondition: ['', Validators.compose([Validators.required])],
      airLayerThickness: ['', Validators.compose([Validators.required])],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  postcalculateRAir(): void {
    var payload: any = {
      "countrycode": this.selCountryCode,
      "surfacecondition": this.OuterWallFG.controls.surfacecondition.value,
      "airLayerThickness": this.OuterWallFG.controls.airLayerThickness.value
    }
    this.beetService.postcalculateRAir(payload).subscribe(res =>{
      console.log(res);
      this.onNoClick();
    })
  }

}
