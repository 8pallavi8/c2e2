import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { beetService } from 'src/app/shared/services/beet.service';

@Component({
  selector: 'app-co2-emissions',
  templateUrl: './co2-emissions.component.html',
  styleUrls: ['./co2-emissions.component.scss']
})
export class CO2EmissionsComponent implements OnInit {
  formgroup: FormGroup;
  hasonsiteCO2Emission: boolean = false;
  haspowergenerationCO2emission: boolean = false;
  co2emissionsunits:string[];
  selCountryCode: string;
  constructor(private fb: FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      powergenerationco2emmisions: ['', Validators.compose([Validators.required])],
      onsiteco2emmisions: ['', Validators.compose([Validators.required])],
      units: ['', Validators.compose([Validators.required])],
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      // console.log("building Envelop "+JSON.stringify(res.success.buildingdata));
      this.co2emissionsunits = res.success.co2emissionsunits;
    });


  }

  showonsiteCO2emission(state: boolean): void {
    if (state == true)
      this.hasonsiteCO2Emission = true;
    else
      this.hasonsiteCO2Emission = false;
  }


  showpowergenerationCO2emission(state: boolean): void {
    if (state == true)
      this.haspowergenerationCO2emission = true;
    else
      this.haspowergenerationCO2emission = false;
  }
}
