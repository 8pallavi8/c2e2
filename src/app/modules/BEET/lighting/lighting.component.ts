import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { beetService } from 'src/app/shared/services/beet.service';



export interface Lighting {
  name: string;
  Yearofinstallation: number;
  LampPower: number;
  StockofFixtures: string;
  LumenOutput: string;
  Averagedailyworkinghours: number;
}


@Component({
  selector: 'app-lighting',
  templateUrl: './lighting.component.html',
  styleUrls: ['./lighting.component.scss']
})
export class LightingComponent implements OnInit {
  formgroup: FormGroup;
  selCountryCode: string;
  constructor(private fb:FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      lightdetails: new FormControl('',Validators.required),
  });
  this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
}
}