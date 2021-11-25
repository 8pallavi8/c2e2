import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from 'src/app/shared/services/beet.service';
import { BEETComponent } from '../beet.component';


export interface Lighting {
  technology: string;
  lightingimagepath: string;
  yearofinstallation?: string;
  lamppower?: number;
  fixtures?: string;
  lumenoutput?: string;
  avgdailyworkinghours?: number;
}

@Component({
  selector: 'app-lighting',
  templateUrl: './lighting.component.html',
  styleUrls: ['./lighting.component.scss']
})
export class LightingComponent implements OnInit {
 
  selCountryCode: string;
  grossAreaValue:number;
  grossAreaValueUnits:string;
  displayedColumns = ["technology", "lightingimagepath", "Yearofinstallation", "LampPower", "StockofFixtures", "LumenOutput", "Averagedailyworkinghours"];
  yearsList: string[] = ["Older than 2018", "2018 or newer"];
  displayYear: string = "Older than 2018 ";
  lightingOptions: Lighting[];
  lightingOptionsDataSource: MatTableDataSource<Lighting>
  LightningDetailsForm: FormGroup;
  beetComponent:BEETComponent;
 

  constructor(private fb: FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
     this.LightningDetailsForm = this.fb.group({
      lightingPowerDensityValue: [, Validators.required],
      totalLightingPowerUnit: ['', Validators.required],
      totalLightingPowerValue: [, Validators.required],
      lightingPowerDensityUnit: ['', Validators.required],
      totalPower:[]
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res;});
    this.beetComponent= this.beetService.getBEETParentComponent();


    if(sessionStorage.getItem('lightingOptions') !== 'undefined'){
      this.lightingOptions = JSON.parse(sessionStorage.getItem('lightingOptions'));
      this.lightingOptionsDataSource = new MatTableDataSource(this.lightingOptions);
    } 
    else{
      this.beetService.getGeneralDetails().subscribe(res => {
        this.lightingOptions = res.success.lighting;
        this.lightingOptionsDataSource = new MatTableDataSource(this.lightingOptions);
      });
    }

    if(sessionStorage.getItem('lightingDetails') !== null){
      this.LightningDetailsForm.patchValue(JSON.parse(sessionStorage.getItem('lightingDetails')));
    }
  }

  getStyleDisplay(index, div) {
    return index % div == 0
  }
  getenableyearofinstallation(startindex, endindex, currentindex) {
    return currentindex >= startindex && currentindex <= endindex;
  }

  postCalculateLightingPower(): void {
   var payload: any = {
       "countrycode": this.selCountryCode,
       "buildinggrossarea": Number(this.beetComponent.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value),
       "buildinggrossareaunit":this.beetComponent.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
       "lightingdata":this.lightingOptions
   }
     this.beetService.postCalculateLightingPower(payload).subscribe(res => {
   
       this.LightningDetailsForm.controls.totalLightingPowerValue.patchValue(res.success.totallightingpower);
       this.LightningDetailsForm.controls.totalLightingPowerUnit.patchValue(res.success.totallightingpowerunit);
       this.LightningDetailsForm.controls.lightingPowerDensityValue.patchValue(res.success.lightingpowerdensity.toFixed(2));
       this.LightningDetailsForm.controls.lightingPowerDensityUnit.patchValue(res.success.lightingpowerdensityunit);
       this.LightningDetailsForm.controls.totalPower.patchValue(res.success.totalpower);
     });
       
  }



}