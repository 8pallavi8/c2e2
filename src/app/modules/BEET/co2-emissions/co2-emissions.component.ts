import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { beetService } from 'src/app/shared/services/beet.service';

export interface CO2EmissionsTable {
  co2emissionsunits: string[];
  defaultgridemissionfactor: number;
}

@Component({
  selector: 'app-co2-emissions',
  templateUrl: './co2-emissions.component.html',
  styleUrls: ['./co2-emissions.component.scss']
})
export class CO2EmissionsComponent implements OnInit {
  formgroup: FormGroup;
  co2emissionsunits: string[];
  selCountryCode: string;
  defaultPowerGridEmissionFactor: number;

  constructor(private fb: FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      powergenerationco2emmisions: [0, Validators.compose([Validators.required])],
      gridemissionsFactor:['', Validators.compose([Validators.required])],
      gridemissionsFactorUnits: ["kg/kWh", Validators.compose([Validators.required])],
      fuelEmissionFactor: [0, Validators.compose([Validators.required])],
      fuelEmissionFactorValue: [0, Validators.compose([Validators.required])],
      fuelEmissionFactorUnit: ['', Validators.compose([Validators.required])]
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res;});
    this.beetService.getGeneralDetails().subscribe(res => {
      console.log(res.success.co2emissionsunits);
      this.co2emissionsunits = res.success.co2emissionsunits;
      this.defaultPowerGridEmissionFactor = res.success.defaultgridemissionfactor;
    });
    if (sessionStorage.getItem('co2EmissionDetails') !== null) {
      var co2EmissionDetails = JSON.parse(sessionStorage.getItem('co2EmissionDetails'));
      if (co2EmissionDetails !== undefined || co2EmissionDetails !== null) {
        console.log("co2"+co2EmissionDetails);
        this.formgroup.patchValue(co2EmissionDetails); 
        console.log(this.formgroup);
      }
    }
  }


  
  defaultEmissionFactor() {
    this.formgroup.controls.gridemissionsFactor.patchValue(this.defaultPowerGridEmissionFactor);
  }


  postCalculateFuelEmissionFactor(): void {
    var payload: any = {
      "fuel": "Natural Gas"
    }
    this.beetService.postCalculateFuelEmissionFactor(payload).subscribe(res => {
      this.formgroup.controls.fuelEmissionFactorValue.patchValue(res.success.fuelemissionfactor);
      this.formgroup.controls.fuelEmissionFactorUnit.patchValue(res.success.fuelemissionfactorunit);
    })
  }

}