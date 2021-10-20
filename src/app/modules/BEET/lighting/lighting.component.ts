import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from 'src/app/shared/services/beet.service';


export interface Lighting {
  technology: string;
  lightingimagepath: string;
  Yearofinstallation?: string;
  LampPower?: number;
  StockofFixtures?: string;
  LumenOutput?: string;
  Averagedailyworkinghours?: number;
}


@Component({
  selector: 'app-lighting',
  templateUrl: './lighting.component.html',
  styleUrls: ['./lighting.component.scss']
})
export class LightingComponent implements OnInit {
  formgroup: FormGroup;
  selCountryCode: string;
  displayedColumns = ["technology", "lightingimagepath", "Yearofinstallation", "LampPower", "StockofFixtures", "LumenOutput", "Averagedailyworkinghours"];
  yearsList: string[] = ["Older than 2018", "2018 or newer"];
  displayYear: string = "Older than 2018 ";
  lightingOptions: Lighting[];
  lightingOptionsDataSource: MatTableDataSource<Lighting>


  constructor(private fb: FormBuilder, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      lightdetails: new FormControl('', Validators.required),
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      this.lightingOptions = res.success.lighting;
      console.log(this.lightingOptions);
      this.lightingOptionsDataSource = new MatTableDataSource(this.lightingOptions);

    });
  }

  getStyleDisplay(index, div) {
    return index % div == 0
  }
  getenableyearofinstallation(startindex, endindex, currentindex) {
    return currentindex >= startindex && currentindex <= endindex;
  }

}