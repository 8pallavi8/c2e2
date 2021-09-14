import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-co2-emissions',
  templateUrl: './co2-emissions.component.html',
  styleUrls: ['./co2-emissions.component.scss']
})
export class CO2EmissionsComponent implements OnInit {
  formgroup: FormGroup;
  hasonsiteCO2Emission:boolean=false;
  haspowergenerationCO2emission:boolean=false;
  unitslist = ["kgCO2/mmbtu","lbsCO2/mmbtu","kgCO2/therm","lbsCO2/therm","kgCO2/kcal","lbsCO2/kcal","kgCO2/m3","lbsCO2/ft3","metrictonsCO2/Mcf"];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      powergenerationco2emmisions: ['', Validators.compose([Validators.required])],
      onsiteco2emmisions: ['', Validators.compose([Validators.required])]
    }
    )
  }

  showonsiteCO2emission(state:boolean):void{
    if (state == true) 
    this.hasonsiteCO2Emission = true;
    else
    this.hasonsiteCO2Emission = false;
  }

  showpowergenerationCO2emission(state:boolean):void{
    if (state == true) 
    this.haspowergenerationCO2emission = true;
    else
    this.haspowergenerationCO2emission = false;
  }


}
