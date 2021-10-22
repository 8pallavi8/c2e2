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
  hasonsiteCO2Emission: boolean = false;
  haspowergenerationCO2emission: boolean = false;
  co2emissionsunits: string[];
  selCountryCode: string;
  defaultPowerGridEmissionFactor: number;

  constructor(private fb: FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      powergenerationco2emmisions: [0, Validators.compose([Validators.required])],
      emissionsFactorUnits: ["kg/kWh", Validators.compose([Validators.required])],
      onsiteco2emmisions: [0, Validators.compose([Validators.required])],
      onsiteco2emmisionsValue: [0, Validators.compose([Validators.required])],
      units: ['', Validators.compose([Validators.required])],
      powergenerationco2emmisionsValue:['', Validators.compose([Validators.required])]
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      console.log(res.success.co2emissionsunits);
      this.co2emissionsunits = res.success.co2emissionsunits;
      this.defaultPowerGridEmissionFactor = res.success.defaultgridemissionfactor;

    });
  }

  defaultEmissionFactor() {
    this.formgroup.controls['powergenerationco2emmisionsValue'].setValue(this.defaultPowerGridEmissionFactor);
    console.log(this.formgroup.controls.powergenerationco2emmisions.value)
  }


  postCalculateFuelEmissionFactor(): void {
    var payload: any = {
      "fuel": "Natural Gas"
    }
    this.beetService.postCalculateFuelEmissionFactor(payload).subscribe(res => {
      console.log(res.success);
    })
  }
}
