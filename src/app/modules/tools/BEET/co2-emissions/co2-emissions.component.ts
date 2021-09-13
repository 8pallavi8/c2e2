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
