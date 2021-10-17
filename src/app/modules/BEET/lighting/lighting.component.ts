import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { beetService } from 'src/app/shared/services/beet.service';



export interface Lighting {
  Technology: string;
  Yearofinstallation: string;
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
  displayedColumns=["Technology","Yearofinstallation","LampPower","StockofFixtures","LumenOutput","Averagedailyworkinghours"];
    yearsList:string[]=["Older than 2018","2018 or newer"];
    displayYear:string="Older than 2018 ";



  constructor(private fb:FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      lightdetails: new FormControl('',Validators.required),
  });
  this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
}

 getStyleDisplay(index,div){
   return index%div==0
 }
 getenableyearofinstallation(startindex ,endindex, currentindex ){
   return currentindex >= startindex && currentindex <=endindex ;
 }
 dataSource: Lighting[] = [
  { Technology: '/assets/images/lighting/led.png', Yearofinstallation:'NA', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: 'NA', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: 'NA', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: 'NA', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: 'NA', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: 'NA', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  
  { Technology: '/assets/images/lighting/cfl.png', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},

  { Technology: '/assets/images/lighting/lfl.png', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},

  { Technology: '/assets/images/lighting/incandescent.png', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},

  { Technology: '/assets/images/lighting/hpmv.png', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},

  { Technology: '/assets/images/lighting/hpsv.png', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},

  { Technology: '/assets/images/lighting/metalhalide.png', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
  { Technology: '', Yearofinstallation: '', LampPower:null , StockofFixtures:null , LumenOutput: null,Averagedailyworkinghours: null},
];
}