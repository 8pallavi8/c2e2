import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from 'src/app/shared/services/beet.service';
import { ToolsService } from 'src/app/shared/services/tools.service';
import { BuildingenvelopedetailsComponent } from './buildingenvelopedetails/buildingenvelopedetails.component';
import { CO2EmissionsComponent } from './co2-emissions/co2-emissions.component';
import { GendetailsComponent } from './gendetails/gendetails.component';
import { HvacComponent } from './hvac/hvac.component';
import { LightingComponent } from './lighting/lighting.component';
import { PlugloadsComponent } from './plugloads/plugloads.component';


export interface summary {
  Parameter: string;
  Units: string;
  Value: string;

}


@Component({
  selector: 'app-beet',
  templateUrl: './beet.component.html',
  styleUrls: ['./beet.component.scss']
})
export class BEETComponent implements OnInit, AfterViewInit {
  inputTableDataSource: any;
  userId: string;
  @ViewChild(GendetailsComponent) genDetailsComponent: GendetailsComponent;
  @ViewChild(BuildingenvelopedetailsComponent) buildingdetailsComponent: BuildingenvelopedetailsComponent;
  /* @ViewChild(LightingComponent) lightingDetailsComponent: LightingComponent;
  @ViewChild(HvacComponent) hvacDetailsComponent: HvacComponent;
  @ViewChild(PlugloadsComponent) plugLoaDetailsComponent: PlugloadsComponent;
  @ViewChild(CO2EmissionsComponent) co2EmissionsDetailsComponent: CO2EmissionsComponent; */
  

  displayedColumns: string[] = ["Parameter", "Units", "Value"];
  summaryTable: summary[];
  dataSource: any;
  isGeneralDetailsUpdated: boolean;
  constructor(private beetService: beetService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('userId') !== null) {
      this.userId = sessionStorage.getItem('userId');
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  selectionStepperChange(event) {
    if (event.selectedIndex == 6) {
      this.showSummary();
    }
  }

  showSummary() {
    console.log("UserName:", this.genDetailsComponent.genDetailsForm.controls.UserName.value);
    this.summaryTable = [
      { Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.UserName.value },
      { Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.ProjectName.value },
      { Parameter: 'Country', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.Country.value },
      { Parameter: 'Province', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.Province.value },
      { Parameter: 'Location', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.Location.value },
      { Parameter: 'Building type', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.Buildingtype.value },
      { Parameter: 'Building age', Units: 'Years', Value: this.genDetailsComponent.genDetailsForm.controls.Yearofconstruction.value },
      { Parameter: 'Building gross area', Units: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value, Value: this.genDetailsComponent.genDetailsForm.controls.Buildinggrossarea.value },
      { Parameter: 'Building net occupiable area', Units: this.genDetailsComponent.genDetailsForm.controls.netunits.value, Value: this.genDetailsComponent.genDetailsForm.controls.Netoccupiedfloorarea.value },
      { Parameter: 'No. of floors', Units: 'number', Value: this.genDetailsComponent.genDetailsForm.controls.Nooffloors.value },
      { Parameter: 'Occupancy hours per week', Units: 'hours per week', Value: this.genDetailsComponent.genDetailsForm.controls.Occupanyhoursperweek.value },
      { Parameter: 'Occupant density', Units: 'square meter per person', Value: this.genDetailsComponent.genDetailsForm.controls.occupancyValue.value },
      { Parameter: 'Electricty cost', Units: this.genDetailsComponent.genDetailsForm.controls.units.value, Value: this.genDetailsComponent.genDetailsForm.controls.Electricitycost.value },
      { Parameter: 'Fuel cost', Units: this.genDetailsComponent.genDetailsForm.controls.fuelunits.value, Value: this.genDetailsComponent.genDetailsForm.controls.Fuelcost.value }
    ];
    this.dataSource = new MatTableDataSource(this.summaryTable);
  }

  saveGenDetails() {
    console.log(this.genDetailsComponent.genDetailsForm);
    if (this.genDetailsComponent.genDetailsForm.valid) {
      var payload: any = {
        userid: this.userId,
        username: this.genDetailsComponent.genDetailsForm.controls.userName.value,
        projectname: this.genDetailsComponent.genDetailsForm.controls.projectName.value,
        country: this.genDetailsComponent.genDetailsForm.controls.country.value,
        province: this.genDetailsComponent.genDetailsForm.controls.province.value,
        location: this.genDetailsComponent.genDetailsForm.controls.location.value,
        buildingtype: this.genDetailsComponent.genDetailsForm.controls.buildingType.value,
        buildingspaces: this.genDetailsComponent.genDetailsForm.controls.buildingSpaces.value,
        yearofconstruction: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value.toString(),
        buildinggrossareaunit: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
        netoccupiedarea: this.genDetailsComponent.genDetailsForm.controls.Netoccupiedfloorarea.value,
        buildinggrossarea: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value !== '' ? this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value : this.genDetailsComponent.genDetailsForm.controls.Netoccupiedfloorarea.value * 1.1,
        nooffloors: this.genDetailsComponent.genDetailsForm.controls.Nooffloors.value,
        occupancyhrsperweek: this.genDetailsComponent.genDetailsForm.controls.Occupanyhoursperweek.value,
        occupancyknown: this.genDetailsComponent.genDetailsForm.controls.occupancyDensity.value == 2 ? true : false,
        noofpeopleoccupying: this.genDetailsComponent.genDetailsForm.controls.noOfPeopleOccupying.value,
        occupantdensity: this.genDetailsComponent.genDetailsForm.controls.occupantDensityKnown.value,
        occupantdensityunit: this.genDetailsComponent.genDetailsForm.controls.OoccupantDensityUnits.value,
        electricitycost: this.genDetailsComponent.genDetailsForm.controls.Electricitycost.value,
        electricitycostunit: this.genDetailsComponent.genDetailsForm.controls.electricityunits.value,
        fuelcost: this.genDetailsComponent.genDetailsForm.controls.Fuelcost.value,
        fuelcostunit: this.genDetailsComponent.genDetailsForm.controls.fuelunits.value,
      }
      this.beetService.postGeneralData(payload).subscribe(res => {
        if (res.status == 'success') {
          console.log(res.success);
          this.isGeneralDetailsUpdated = true;
          this.userId = res.success;
          sessionStorage.setItem('userId', this.userId);
        }
      });
    }

  }


}