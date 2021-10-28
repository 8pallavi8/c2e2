import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

export interface Rvalue {
  rValue?: number;
  rUnits?: string;
}


@Component({
  selector: 'app-beet',
  templateUrl: './beet.component.html',
  styleUrls: ['./beet.component.scss']
})
export class BEETComponent implements OnInit, AfterViewInit {
  inputTableDataSource: any;
  outerWallR: Rvalue = {};
  roofR: Rvalue = {};
  wwR: Rvalue = {};
  userId: string;
  @ViewChild(GendetailsComponent) genDetailsComponent: GendetailsComponent;
  @ViewChild(BuildingenvelopedetailsComponent) buildingdetailsComponent: BuildingenvelopedetailsComponent;
  @ViewChild(LightingComponent) lightingDetailsComponent: LightingComponent;
  @ViewChild(CO2EmissionsComponent) co2EmissionsDetailsComponent: CO2EmissionsComponent;
  /*@ViewChild(HvacComponent) hvacDetailsComponent: HvacComponent;
 @ViewChild(PlugloadsComponent) plugLoaDetailsComponent: PlugloadsComponent;
 */


  displayedColumns: string[] = ["Parameter", "Units", "Value"];

  dataSource: any;
  isGeneralDetailsUpdated: boolean;

  summaryTable: summary[];

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
    //console.log("UserName:", this.genDetailsComponent.genDetailsForm.controls.UserName.value);
    this.summaryTable = [
      { Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.userName.value },
      { Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.projectName.value },
      { Parameter: 'Country', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.country.value },
      { Parameter: 'Province', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.province.value },
      { Parameter: 'Location', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.location.value },
      { Parameter: 'Building type', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.buildingType.value },
      { Parameter: 'Building age', Units: 'Years', Value: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value },
      {Parameter: 'Building gross area', Units: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value },
      {Parameter: 'Building net occupiable area', Units: this.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value},
      { Parameter: 'No. of floors', Units: 'number', Value: this.genDetailsComponent.genDetailsForm.controls.noOfFloors.value },
      {Parameter: 'Occupancy hours per week', Units: 'hours per week',
        Value: this.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value},
      {Parameter: 'Occupant density', Units: 'square meter per person',
        Value: this.genDetailsComponent.genDetailsForm.controls.occupantDensity.value},
      {Parameter: 'Electricty cost', Units: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value},
      {Parameter: 'Fuel cost', Units: this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.fuelCost.value},
      {Parameter: 'Total lighting power', Units: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
        Value: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value},
      {Parameter: 'Lighting density', Units: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
        Value: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value},

      {
        Parameter: 'Power generation CO2 emissions / Grid emissions factor', Units: this.co2EmissionsDetailsComponent.formgroup.controls.gridemissionsFactorUnits.value,
        Value: this.co2EmissionsDetailsComponent.formgroup.controls.powergenerationco2emmisionsValue.value
      },
      {
        Parameter: 'On site CO2 emissions', Units: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorUnit.value,
        Value: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorValue.value
      },


    ];
    this.dataSource = new MatTableDataSource(this.summaryTable);
  }

  // saveGenDetails() {
  //   console.log(this.genDetailsComponent.genDetailsForm);
  //   if (this.genDetailsComponent.genDetailsForm.valid) {
  //     var payload: any = {
  //       //userid: this.userId,
  //       username: this.genDetailsComponent.genDetailsForm.controls.userName.value,
  //       projectname: this.genDetailsComponent.genDetailsForm.controls.projectName.value,
  //       country: this.genDetailsComponent.genDetailsForm.controls.country.value,
  //       province: this.genDetailsComponent.genDetailsForm.controls.province.value,
  //       location: this.genDetailsComponent.genDetailsForm.controls.location.value,
  //       buildingtype: this.genDetailsComponent.genDetailsForm.controls.buildingType.value,
  //       //buildingspaces: this.genDetailsComponent.genDetailsForm.controls.buildingSpaces.value,
  //       yearofconstruction: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value.toString(),
  //       buildinggrossareaunit: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
  //       netoccupiedarea: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value,
  //       buildinggrossarea: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value !== '' ? this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value : this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value * 1.1,
  //       nooffloors: this.genDetailsComponent.genDetailsForm.controls.Nooffloors.value,
  //       occupancyhrsperweek: this.genDetailsComponent.genDetailsForm.controls.Occupanyhoursperweek.value,
  //       occupancyknown: this.genDetailsComponent.genDetailsForm.controls.occupancyDensity.value == 2 ? true : false,
  //       noofpeopleoccupying: this.genDetailsComponent.genDetailsForm.controls.noOfPeopleOccupying.value,
  //       occupantdensity: this.genDetailsComponent.genDetailsForm.controls.occupantDensityKnown.value,
  //       occupantdensityunit: this.genDetailsComponent.genDetailsForm.controls.OoccupantDensityUnits.value,
  //       electricitycost: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value,
  //       electricitycostunit: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
  //       fuelcost: this.genDetailsComponent.genDetailsForm.controls.Fuelcost.value,
  //       fuelcostunit: this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
  //     }
  //     this.beetService.postGeneralData(payload).subscribe(res => {
  //       if (res.status == 'success') {
  //         console.log(res.success);
  //         this.isGeneralDetailsUpdated = true;
  //         this.userId = res.success;
  //         sessionStorage.setItem('userId', this.userId);
  //       }
  //     });
  //   }
  // }

  /*  saveBuildingDetails() {
     console.log(this.buildingdetailsComponent?.formgroup);
     if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 1) {
       this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallRKnown.value;
       this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.value;
     } else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 2) {
       this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.rvalue;
       this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.units;
     } else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 3) {
       this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rValueAdvanced.value;
       //this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.units
     }
     console.log(this.outerWallR);
 
   } */


}