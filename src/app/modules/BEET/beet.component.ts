import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralDetails, Summary } from 'src/app/shared/models/beet-models';
import { beetService } from 'src/app/shared/services/beet.service';
import { BuildingenvelopedetailsComponent } from './buildingenvelopedetails/buildingenvelopedetails.component';
import { CO2EmissionsComponent } from './co2-emissions/co2-emissions.component';
import { GendetailsComponent } from './gendetails/gendetails.component';
import { HvacComponent } from './hvac/hvac.component';
import { LightingComponent } from './lighting/lighting.component';
import { PlugloadsComponent } from './plugloads/plugloads.component';


export interface Rvalue {
  rValue?: number;
  rUnits?: string;
}

export interface Plugloads {
  pluLoadValue?: number;
  PlugLoadUnits?: string;
}

export interface Cooling{
  coolingEfficiency?: number;
  coolingUnits?: string;
}


export interface Efficiency{
  efficiencyValue?: number;
  efficiencyUnits?:string;
}


@Component({
  selector: 'app-beet',
  templateUrl: './beet.component.html',
  styleUrls: ['./beet.component.scss']
})
export class BEETComponent implements OnInit, AfterViewInit {
  summary: Summary;
  inputTableDataSource: any;
  heatingEfficiencyValue: Efficiency={};
  coolingEfficiencyValue: Efficiency ={};
  outerWallR: Rvalue = {};
  roofR: Rvalue = {};
  windowR: Rvalue = {};
  wwrValue: number;
  coolingEquipValues:Cooling={};
  plugLoadValue: Plugloads ={};
  userId: string;
  @ViewChild(GendetailsComponent) genDetailsComponent: GendetailsComponent;
  @ViewChild(BuildingenvelopedetailsComponent) buildingdetailsComponent: BuildingenvelopedetailsComponent;
  @ViewChild(LightingComponent) lightingDetailsComponent: LightingComponent;
  @ViewChild(CO2EmissionsComponent) co2EmissionsDetailsComponent: CO2EmissionsComponent;
  @ViewChild(HvacComponent) hvacDetailsComponent: HvacComponent;
  @ViewChild(PlugloadsComponent) plugLoaDetailsComponent: PlugloadsComponent;
  displayedColumns: string[] = ["Parameter", "Units", "Value"];
  dataSource: any;
  isGeneralDetailsUpdated: boolean;
  heatingEfficiencyFinal:number;
  generalDetails: GeneralDetails;
  summaryTable: { Parameter: string; Units: any; Value: any; }[];
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
    console.log(event.selectedIndex)
    if (event.selectedIndex == 6) {
      this.saveBuildingDetails();
      this.saveHVACDetails();
      this.showSummary();
    }
  }

  onSaveGenDetails(){

    // this.generalDetails = {
    //  username: this.genDetailsComponent.genDetailsForm.controls.userName.value,
    //  projectname: this.genDetailsComponent.genDetailsForm.controls.projectName.value,
    //  country: this.genDetailsComponent.genDetailsForm.controls.country.value,
    //  province: this.genDetailsComponent.genDetailsForm.controls.province.value,
    //  location: this.genDetailsComponent.genDetailsForm.controls.location.value,
    //  buildingtype: this.genDetailsComponent.genDetailsForm.controls.buildingType.value,
    //  buildingspaces: this.genDetailsComponent.genDetailsForm.controls.buildingSpaces.value,
    //  yearofconstruction: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value,
    //  buildinggrossarea: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value,
    //  buildinggrossareaunit: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
    //  netoccupiedarea: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value,
    //  netoccupiedareaunit: this.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
    //  nooffloors:this.genDetailsComponent.genDetailsForm.controls.noOfFloors.value,
    //  occupancyhrsperweek: this.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value,
    //  occupantdensity: this.genDetailsComponent.genDetailsForm.controls.occupantDensity.value,
    //  occupantdensityunit: this.genDetailsComponent.genDetailsForm.controls.occupantDensityUnits.value,
    //  electricitycost: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value,
    //  electricitycostunit: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
    //  fuelcost: this.genDetailsComponent.genDetailsForm.controls.fuelCost.value,
    //  fuelcostunit:this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
    // }
    // this.summary = {
    //   generaldetails: this.generalDetails
    // }
    // this.beetService.saveSummary(this.summary);
     localStorage.setItem('generalDetails', JSON.stringify(this.genDetailsComponent.genDetailsForm.value))
  }

  onSaveBuildingEnvDetails(){
    localStorage.setItem('buildingEnvDetails', JSON.stringify(this.buildingdetailsComponent.formgroup.value))
  }

  onSaveLightingDetails(){
    localStorage.setItem('lightingDetails', JSON.stringify(this.lightingDetailsComponent.LightningDetailsForm.value))
    localStorage.setItem('lightingOptions', JSON.stringify(this.lightingDetailsComponent.lightingOptions));
  }
  
  showSummary() {
    console.log("UserName:", this.genDetailsComponent.genDetailsForm.controls.UserName.value);
    this.summaryTable = [
       { Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.userName.value },
       { Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.projectName.value },
       { Parameter: 'Country', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.country.value },
       { Parameter: 'Province', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.province.value },
       { Parameter: 'Location', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.location.value },
       { Parameter: 'Building type', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.buildingType.value },
       { Parameter: 'Building age', Units: 'Years', Value: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value },
       {
         Parameter: 'Building gross area', Units: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
         Value: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value
       },
       {
         Parameter: 'Building net occupiable area', Units: this.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
         Value: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value
       },
       { Parameter: 'No. of floors', Units: 'number', Value: this.genDetailsComponent.genDetailsForm.controls.noOfFloors.value },
       {
         Parameter: 'Occupancy hours per week', Units: 'hours per week',
         Value: this.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value
       },
      {
         Parameter: 'Occupant density', Units: this.genDetailsComponent.genDetailsForm.controls.occupantDensityUnits.value,
         Value: this.genDetailsComponent.genDetailsForm.controls.occupantDensity.value
       },
       {
         Parameter: 'Electricty cost', Units: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
         Value: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value
       },
       {
         Parameter: 'Fuel cost', Units: this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
         Value: this.genDetailsComponent.genDetailsForm.controls.fuelCost.value
       },
       { Parameter: 'Thermal Resistance (R value) wall', Units: this.outerWallR.rUnits, Value: this.outerWallR.rValue },
       { Parameter: 'Thermal Resistance (R value) roof', Units: this.roofR.rUnits, Value: this.roofR.rValue },
       { Parameter: 'Thermal Resistance (R value) window', Units: this.windowR.rUnits, Value: this.windowR.rValue },
       { Parameter: 'Solar Heat Gain Coefficient (SHGC) window', Units: '', Value: this.buildingdetailsComponent.formgroup.controls.SHGCknown.value },
       { Parameter: 'Window to wall ratio', Units: '%', Value: this.wwrValue },
       { Parameter: 'Total lighting power', Units: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
         Value: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value},
       { Parameter: 'Lighting density', Units: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
         Value: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value},
       {Parameter: 'Heating efficiency', Units: '%',Value: this.heatingEfficiencyValue.efficiencyValue},
       {Parameter: 'Air conditioning efficiency/performance', Units: this.coolingEquipValues.coolingUnits,
         Value: this.coolingEquipValues.coolingEfficiency },
         {Parameter: 'Ventilation rate', Units: this.hvacDetailsComponent.formgroup.controls.ventilationUnits.value,
         Value: this.hvacDetailsComponent.formgroup.controls.ventilationKnown.value},
         {Parameter: 'Infiltration rate', Units: this.hvacDetailsComponent.formgroup.controls.infiltrationUnits.value,
         Value: this.hvacDetailsComponent.formgroup.controls.infiltrationknown.value},
          {Parameter: 'Plug load density', Units: this.plugLoaDetailsComponent.formgroup.controls.plugLoadUnits.value,
         Value: this.plugLoaDetailsComponent.formgroup.controls.plugLoadValueKnown.value}, 
       {Parameter: 'Power generation CO2 emissions / Grid emissions factor', Units: this.co2EmissionsDetailsComponent.formgroup.controls.gridemissionsFactorUnits.value,
         Value: this.co2EmissionsDetailsComponent.formgroup.controls.powergenerationco2emmisionsValue.value},
       {Parameter: 'On site CO2 emissions', Units: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorUnit.value,
         Value: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorValue.value},
     ];
     this.dataSource = new MatTableDataSource(this.summaryTable);
  }

  postData() {
     if (this.genDetailsComponent.genDetailsForm.valid) {
       var payload: any = {
         username: this.genDetailsComponent.genDetailsForm.controls.userName.value,
         projectname: this.genDetailsComponent.genDetailsForm.controls.projectName.value,
         country: this.genDetailsComponent.genDetailsForm.controls.country.value,
         province: this.genDetailsComponent.genDetailsForm.controls.province.value,
         location: this.genDetailsComponent.genDetailsForm.controls.location.value,
         buildingtype: this.genDetailsComponent.genDetailsForm.controls.buildingType.value,
         buildingspaces: this.genDetailsComponent.genDetailsForm.controls.buildingSpaces.value,
         yearofconstruction: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value.toString(),
         nooffloors: this.genDetailsComponent.genDetailsForm.controls.noOfFloors.value ,
         occupancyhrsperweek: this.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value,
         buildinggrossarea: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value,
         buildinggrossareaunit: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
         netoccupiedarea: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value,
         netoccupiedareaunit: this.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
        occupantdensity: this.genDetailsComponent.genDetailsForm.controls.occupantDensity.value,
        occupantdensityunit: this.genDetailsComponent.genDetailsForm.controls.occupantDensityUnits.value,
         electricitycost: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value,
         electricitycostunit: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
         fuelcost: this.genDetailsComponent.genDetailsForm.controls.fuelCost.value,
         fuelcostunit: this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
         rvaluewall: this.outerWallR.rUnits, Value: this.outerWallR.rValue,
         rvaluewallunit: this.outerWallR.rValue ,
         rvalueroof:  this.roofR.rUnits,
         rvalueroofunit: this.roofR.rValue,
         rvaluewindow :  this.windowR.rUnits,
         rvaluewindowunit: this.windowR.rValue,
         shgc: this.buildingdetailsComponent.formgroup.controls.SHGCknown.value,
         windowtowallratio :  '%',
         windowtowallratiounit: this.wwrValue ,
         totallightingpower:this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value ,
         totallightingpowerunit: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
         lightingdensity: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value,
         lightingdensityunit: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
         totalpower:  this.lightingDetailsComponent.formgroup.controls.totalPower.value,


         heatingequipment: this.wwrValue ,
         heatingefficiency:this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value ,
         heatingefficiencyunit: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
         coolingequipment: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value,
         coolingefficiency: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
         coolingefficiencyunit:  this.lightingDetailsComponent.formgroup.controls.totalPower.value,
         ventilationrate: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value,
         ventilationrateunit: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
         infiltrationrate:  this.lightingDetailsComponent.formgroup.controls.totalPower.value,
         infiltrationrateunit:  this.lightingDetailsComponent.formgroup.controls.totalPower.value,

       }
       /* this.beetService.postGeneralData(payload).subscribe(res => {
         if (res.status == 'success') {
           console.log(res.success);
           this.isGeneralDetailsUpdated = true;
           this.userId = res.success;
           sessionStorage.setItem('userId', this.userId);
         }
       }); */
     }
   } 

  saveBuildingDetails() {
    console.log(this.buildingdetailsComponent?.formgroup);
    if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 1) {
      this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallRKnown.value;
      this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 2) {
      this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.rvalue;
      this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.units;
    } else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 3) {
      this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rValueAdvanced.value;
      this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.units
    }
    console.log(this.outerWallR);
    console.log(this.outerWallR.rUnits);

    if (this.buildingdetailsComponent?.formgroup.controls.roofr.value == 1) {
      this.roofR.rValue = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofRKnown.value;
      this.roofR.rUnits = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofrUnits.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.roofr.value == 2) {
      this.roofR.rValue = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofrimages.value.rvalue;
      this.roofR.rUnits = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofrimages.value.units;
    } else if (this.buildingdetailsComponent?.formgroup.controls.roofr.value == 3) {
      this.roofR.rValue = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.rValueAdvanced.value;
      this.roofR.rUnits = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.outerwallrUnits.units
    }

    if (this.buildingdetailsComponent?.formgroup.controls.windowr.value == 1) {
      this.windowR.rValue = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowRKnown.value;
      this.windowR.rUnits = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowrUnits.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.windowr.value == 2) {
      this.windowR.rValue = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowRCaluclated.value;
      this.windowR.rUnits = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.roofrimages.value.units;
    }

    if (this.buildingdetailsComponent?.formgroup.controls.wwr.value == 1) {
      this.wwrValue = this.buildingdetailsComponent?.formgroup.get('wwrArray')['controls'][0].controls.wwrKnown.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.wwr.value == 2) {
      this.wwrValue = this.buildingdetailsComponent?.formgroup.get('wwrArray')['controls'][0].controls.wwrGuide.value;
    }
  }


  saveHVACDetails(){
    if (this.hvacDetailsComponent?.formgroup.controls.heatefficiency.value == 1) {
      this.heatingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatefficiencyKnown.value;

      console.log(this.heatingEfficiencyValue.efficiencyValue)
    } else if (this.hvacDetailsComponent?.formgroup.controls.heatefficiency.value == 2) {
      this.heatingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatefficiency.value;
    console.log(this.heatingEfficiencyValue.efficiencyValue )
    }


    if (this.hvacDetailsComponent?.formgroup.controls.airconditioning.value == 1) {
      this.coolingEquipValues.coolingEfficiency = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyValue.value;
      this.coolingEquipValues.coolingUnits = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyParameter.value;
    } else if (this.hvacDetailsComponent?.formgroup.controls.airconditioning.value == 2) {
      this.coolingEquipValues.coolingEfficiency = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyValue.value;
      this.coolingEquipValues.coolingUnits = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyUnits.value;
      //this.coolingEquipValues.coolingUnits = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.rimages.value.units;
    }
  }

}