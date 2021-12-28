import { CdkStep, STEPPER_GLOBAL_OPTIONS, StepState, STEP_STATE } from '@angular/cdk/stepper';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMessage, errorMessages, GeneralDetails, Summary } from 'src/app/shared/models/beet-models';
import { beetService } from 'src/app/shared/services/beet.service';
import { BuildingenvelopedetailsComponent } from './buildingenvelopedetails/buildingenvelopedetails.component';
import { CO2EmissionsComponent } from './co2-emissions/co2-emissions.component';
import { GendetailsComponent } from './gendetails/gendetails.component';
import { HvacComponent } from './hvac/hvac.component';
import { LightingComponent } from './lighting/lighting.component';
import { PlugloadsComponent } from './plugloads/plugloads.component';
import { BeetreportComponent } from './beetreport/beetreport.component';
import { MatStepper } from '@angular/material/stepper';


export interface PlugLoadOptionsTable {
  plugloadops: string[];
  options?: string;
  quantity?: number;
}

export interface Rvalue {
  rValue?: number;
  rUnits?: string;
}

export interface Plugloads {
  pluLoadValue?: number;
  PlugLoadUnits?: string;
}

export interface Cooling {
  coolingEfficiency?: number;
  coolingUnits?: string;
}

export interface Efficiency {
  efficiencyValue?: number;
  efficiencyUnits?: string;
  equipName?: string;
}

@Component({
  selector: 'app-beet',
  templateUrl: './beet.component.html',
  styleUrls: ['./beet.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class BEETComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfTable', { static: false })
  outerWallR: Rvalue = {};
  roofR: Rvalue = {};
  windowR: Rvalue = {};
  wwrValue: number;
  errorMessages: ErrorMessage[] = errorMessages;
  errFieldMessages: string[] = [];
  //showTables: boolean = false;
  showReportProgress: boolean = false;
  plugloadoptions: PlugLoadOptionsTable[] = [];
  summary: Summary;
  inputTableDataSource: any;
  heatingEfficiencyValue: Efficiency = {};
  coolingEfficiencyValue: Efficiency = {};
  coolingEquipValues: Cooling = {};
  plugLoadValue: Plugloads = {};
  userId: string;
  @ViewChild(GendetailsComponent) genDetailsComponent: GendetailsComponent;
  @ViewChild(BuildingenvelopedetailsComponent) buildingdetailsComponent: BuildingenvelopedetailsComponent;
  @ViewChild(LightingComponent) lightingDetailsComponent: LightingComponent;
  @ViewChild(CO2EmissionsComponent) co2EmissionsDetailsComponent: CO2EmissionsComponent;
  @ViewChild(HvacComponent) hvacDetailsComponent: HvacComponent;
  @ViewChild(PlugloadsComponent) plugLoaDetailsComponent: PlugloadsComponent;
  @ViewChild(BeetreportComponent) beetReportComponent: BeetreportComponent;
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('errMsg') errMsg: ElementRef;
  displayedColumns: string[] = ["Parameter", "Units", "Value"];
  dataSource: any;
  isGeneralDetailsUpdated: boolean;
  generalDetails: GeneralDetails;
  submitResponse: any;
  selectedcountryname:string;
  summaryTable: { Parameter: string; Units: any; Value: any; }[];
  displayedColumnsinputvalues = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsintermediatevalues = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsoutputvalues = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsmonthlyresults = ["month", "peakkwbaseline", "kwhbaseline", "thermsbaseline", "ngcubicmeterbaseline", "peakkwees", "kwhees", "thermsees", "ngcubicmeterees"];
  displayedColumnseconomizersavings = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsinputsforgraph = ["parameter", "parameterfield", "baselinevalue", "efficientvalue"];
  step = 0;
  disableReport: boolean = false;
 

  constructor(private beetService: beetService, private cd: ChangeDetectorRef, private modalService: NgbModal) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('userId') !== null) {
      this.userId = sessionStorage.getItem('userId');
    }
    this.beetService.setBEETParentComponent(this);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  selectionStepperChange(event) {
    this.saveBuildingDetails();
    this.saveHVACDetails();
    this.onSaveLightingDetails();
    this.onSaveGenDetails();
    this.onPlugLoadDetails();
    this.onSaveLightingDetails();
    this.showSummary();
    if(event.selectedIndex == 7){
      this.postDataGenerateReport(true);
    }
  }

  onSaveGenDetails() {
    sessionStorage.setItem('generalDetails', JSON.stringify(this.genDetailsComponent.genDetailsForm.value))
    console.log(this.genDetailsComponent.genDetailsForm.value);
  }

  onSaveBuildingEnvDetails() {
    sessionStorage.setItem('buildingEnvDetails', JSON.stringify(this.buildingdetailsComponent.formgroup.value))
  }

  onSaveLightingDetails() {
    sessionStorage.setItem('lightingDetails', JSON.stringify(this.lightingDetailsComponent.LightningDetailsForm.value))
    sessionStorage.setItem('lightingOptions', JSON.stringify(this.lightingDetailsComponent.lightingOptions));
  }

  onHvacDetails() {
    sessionStorage.setItem('hvacDetails', JSON.stringify(this.hvacDetailsComponent.formgroup.value))
  }

  onPlugLoadDetails() {
    sessionStorage.setItem('plugloadDetails', JSON.stringify(this.plugLoaDetailsComponent.formgroup.getRawValue()))
  }

  onCo2EmissionsDetails() {
    sessionStorage.setItem('co2EmissionDetails', JSON.stringify(this.co2EmissionsDetailsComponent.formgroup.value))
  }

  showSummary() {
    console.log("show summary ");
    this.selectedcountryname = sessionStorage.getItem('selectedCountryName');
    this.summaryTable = [
      //{ Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.userName.value },
      //{ Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.projectName.value },
      { Parameter: 'Country', Units: null, Value: this.selectedcountryname },
      { Parameter: 'Province', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.province.value },
      { Parameter: 'Location', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.location.value },
      { Parameter: 'Building type', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.buildingType.value },
      //{ Parameter: 'Building age', Units: 'Years', Value: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value },
      /* {
        Parameter: 'Building gross area', Units: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value
      }, */
      {
        Parameter: 'Total built up area', Units: this.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value.toFixed(2)
      },
      { Parameter: 'No. of floors', Units: 'number', Value: this.genDetailsComponent.genDetailsForm.controls.noOfFloors.value },
      {
        Parameter: 'Occupancy hours per week', Units: 'hours per week',
        Value: this.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value
      },
      {
        Parameter: 'Occupant density', Units: this.genDetailsComponent.genDetailsForm.controls.occupantDensityUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.occupantDensityKnown.value.toFixed(2)
      },
      {
        Parameter: 'Electricty cost', Units: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value.toFixed(2)
      },
      {
        Parameter: 'Fuel cost', Units: this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
        Value: this.genDetailsComponent.genDetailsForm.controls.fuelCost.value.toFixed(2)
      },
      { Parameter: 'Thermal Resistance (R value) wall', Units: this.outerWallR.rUnits, Value: this.outerWallR.rValue },
      { Parameter: 'Thermal Resistance (R value) roof', Units: this.roofR.rUnits, Value: this.roofR.rValue },
      { Parameter: 'Thermal Resistance (R value) window', Units: this.windowR.rUnits, Value: this.windowR.rValue },
      { Parameter: 'Solar Heat Gain Coefficient (SHGC) window', Units: '', Value: this.buildingdetailsComponent.formgroup.controls.SHGCknown.value },
      { Parameter: 'Window to wall ratio', Units: '%', Value: this.wwrValue },
      {
        Parameter: 'Total lighting power', Units: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
        Value: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value
      },
      {
        Parameter: 'Lighting density', Units: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
        Value: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value
      },
      {
        Parameter: 'Heating efficiency', Units: this.heatingEfficiencyValue.efficiencyUnits,
        Value: this.heatingEfficiencyValue.efficiencyValue.toFixed(2)
      },
      {
        Parameter: 'Air conditioning efficiency/performance', Units: this.coolingEfficiencyValue.efficiencyUnits,
        Value: this.coolingEfficiencyValue.efficiencyValue.toFixed(2)
      },
      {
        Parameter: 'Ventilation rate', Units: this.hvacDetailsComponent.formgroup.controls.ventilationUnits.value,
        Value: this.hvacDetailsComponent.formgroup.controls.ventilationValue.value.toFixed(2)
      },
      {
        Parameter: 'Infiltration rate', Units: this.hvacDetailsComponent.formgroup.controls.infiltrationUnits.value,
        Value: this.hvacDetailsComponent.formgroup.controls.infiltrationValue.value
      },
      {
        Parameter: 'Plug load density', Units: this.plugLoaDetailsComponent.formgroup.controls.plugLoadUnits.value,
        Value: this.plugLoaDetailsComponent.formgroup.controls.plugLoadValueKnown.value.toFixed(2)
      },
      {
        Parameter: 'Power generation CO2 emissions / Grid emissions factor', Units: this.co2EmissionsDetailsComponent.formgroup.controls.gridemissionsFactorUnits.value,
        Value: this.co2EmissionsDetailsComponent.formgroup.controls.gridemissionsFactor.value.toFixed(2)
      },
      {
        Parameter: 'On site CO2 emissions', Units: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorUnit.value,
        Value: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorValue.value.toFixed(2)
      },
    ];
    this.dataSource = new MatTableDataSource(this.summaryTable);

  }

  async postDataGenerateReport(disablestep:boolean) {
    this.errFieldMessages = [];
    Object.keys(this.genDetailsComponent.genDetailsForm.controls).forEach(field => {
      //const control = this.genDetailsComponent.genDetailsForm.get(field);
      if (this.genDetailsComponent.genDetailsForm.get(field).invalid) {
        this.errorMessages.forEach(ele => {
          if (ele.key == field) {
            this.errFieldMessages.push(ele.errMessage);
          }
        });
      }
    });
    Object.keys(this.buildingdetailsComponent.formgroup.controls).forEach(field => {
      if (this.hvacDetailsComponent.formgroup.get(field) instanceof FormArray) {
        (<FormArray>this.hvacDetailsComponent.formgroup.get(field)).controls.forEach((element, index) => {
          Object.keys((<FormGroup>element).controls).forEach(subfield => {
            if ((<FormGroup>element).get(subfield).invalid) {
              this.errorMessages.forEach(ele => {
                if (ele.key == subfield) {
                  this.errFieldMessages.push(ele.errMessage);
                }
              });
            }
          });
        });
      }
      else if (this.buildingdetailsComponent.formgroup.get(field) instanceof FormArray) {
        (<FormArray>this.buildingdetailsComponent.formgroup.get(field)).controls.forEach((element, index) => {
          Object.keys((<FormGroup>element).controls).forEach(subfield => {
            if ((<FormGroup>element).get(subfield).invalid) {
              this.errorMessages.forEach(ele => {
                if (ele.key == subfield) {
                  this.errFieldMessages.push(ele.errMessage);
                }
              });
            }
          });
        });
      }
      else if (this.buildingdetailsComponent.formgroup.get(field).invalid) {
        this.errorMessages.forEach(ele => {
          if (ele.key == field) {
            this.errFieldMessages.push(ele.errMessage);
          }
        });
      }
    });

    Object.keys(this.hvacDetailsComponent.formgroup.controls).forEach(field => {
      if (this.hvacDetailsComponent.formgroup.get(field) instanceof FormArray) {
        (<FormArray>this.hvacDetailsComponent.formgroup.get(field)).controls.forEach((element, index) => {
          Object.keys((<FormGroup>element).controls).forEach(subfield => {
            if ((<FormGroup>element).get(subfield).invalid) {
              this.errorMessages.forEach(ele => {
                if (ele.key == subfield) {
                  this.errFieldMessages.push(ele.errMessage);
                }
              });
            }
          });
        });
      }
      else if (this.hvacDetailsComponent.formgroup.get(field).invalid) {
        this.errorMessages.forEach(ele => {
          if (ele.key == field) {
            this.errFieldMessages.push(ele.errMessage);
          }
        });
      }
    });

    Object.keys(this.plugLoaDetailsComponent.formgroup.controls).forEach(field => {
      if (this.plugLoaDetailsComponent.formgroup.get(field).invalid) {
        this.errorMessages.forEach(ele => {
          if (ele.key == field) {
            this.errFieldMessages.push(ele.errMessage);
          }
        });
      }
    });

    Object.keys(this.co2EmissionsDetailsComponent.formgroup.controls).forEach(field => {
      if (this.co2EmissionsDetailsComponent.formgroup.get(field).invalid) {
        this.errorMessages.forEach(ele => {
          if (ele.key == field) {
            this.errFieldMessages.push(ele.errMessage);
          }
        });
      }
    });

    if (this.errFieldMessages.length > 0) {
      this.modalService.open(this.errMsg, {
        backdropClass: 'light-green-backdrop',
        size: 'md', scrollable: true
      });
    }
    else {
      this.showReportProgress = true;
      this.beetReportComponent.showProgress == false;
      this.beetReportComponent.postBeetPayload();
      await this.delay(5000);
      this.showReportProgress = false;
      //this.disableReport=disablestep;
      this.myStepper.selectedIndex = 7;
    }

  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  saveBuildingDetails() {
    this.outerWallR={};
    if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 1) {
      if (this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallRKnown.value != '') {
        this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallRKnown.value.toFixed(2);
        this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.value;
      } else {
        this.outerWallR.rValue = 0;
      }
    }
    else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 2) {
      if (this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.rvalue != '') {
        this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.rvalue.toFixed(2);
        this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.units;
      } else {
        this.outerWallR.rValue = 0;
      }
    } else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 3) {
      if (this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rValueAdvanced.value != '') {
        this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rValueAdvanced.value.toFixed(2);
        this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.value;
      } else {
        this.outerWallR.rValue = 0;
      }
    }


    if (this.buildingdetailsComponent?.formgroup.controls.roofr.value == 1) {
      this.roofR.rValue = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofRKnown.value.toFixed(2);
      this.roofR.rUnits = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofrUnits.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.roofr.value == 2) {
      this.roofR.rValue = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofrimages.value.rvalue.toFixed(2);
      this.roofR.rUnits = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.roofrimages.value.units;
    } else if (this.buildingdetailsComponent?.formgroup.controls.roofr.value == 3) {
      this.roofR.rValue = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.rValueAdvanced.value.toFixed(2);
      this.roofR.rUnits = this.buildingdetailsComponent?.formgroup.get('roofrArray')['controls'][0].controls.outerwallrUnits.units
    }

    if (this.buildingdetailsComponent?.formgroup.controls.windowr.value == 1) {
      this.windowR.rValue = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowRKnown.value.toFixed(2);
      this.windowR.rUnits = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowrUnits.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.windowr.value == 2) {
      this.windowR.rValue = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowRCaluclated.value.toFixed(2);
      this.windowR.rUnits = this.buildingdetailsComponent?.formgroup.get('windowrArray')['controls'][0].controls.windowRCaluclatedUnits.value;
    }

    if (this.buildingdetailsComponent?.formgroup.controls.wwr.value == 1) {
      this.wwrValue = this.buildingdetailsComponent?.formgroup.get('wwrArray')['controls'][0].controls.wwrKnown.value;
    } else if (this.buildingdetailsComponent?.formgroup.controls.wwr.value == 2) {
      this.wwrValue = this.buildingdetailsComponent?.formgroup.get('wwrArray')['controls'][0].controls.wwrGuide.value;
    }
  }
  saveHVACDetails() {
    if (this.hvacDetailsComponent?.formgroup.controls.heatefficiency.value == 1) {
      this.heatingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatefficiencyKnown.value;
      this.heatingEfficiencyValue.efficiencyUnits = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatEfficiencyUnits.value;
      this.heatingEfficiencyValue.equipName = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatEquipmentName.value;

    } else if (this.hvacDetailsComponent?.formgroup.controls.heatefficiency.value == 2) {
      this.heatingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatefficiency.value;
      this.heatingEfficiencyValue.efficiencyUnits = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatEfficiencyUnits.value;
      this.heatingEfficiencyValue.equipName = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatEquipmentName.value;

    } else if (this.hvacDetailsComponent?.formgroup.controls.heatefficiency.value == 3) {
      this.heatingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatefficiency.value;
      this.heatingEfficiencyValue.efficiencyUnits = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatEfficiencyUnits.value;
      this.heatingEfficiencyValue.equipName = this.hvacDetailsComponent?.formgroup.get('heatefficiencyArray')['controls'][0].controls.heatEquipmentName.value;
    }

    if (this.hvacDetailsComponent?.formgroup.controls.airconditioning.value == 1) {
      this.coolingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyValue.value;
      this.coolingEfficiencyValue.efficiencyUnits = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyParameter.value;
      this.coolingEfficiencyValue.equipName = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.coolingEquipmentName.value;

    } else if (this.hvacDetailsComponent?.formgroup.controls.airconditioning.value == 2) {
      this.coolingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyValue.value;
      this.coolingEfficiencyValue.efficiencyUnits = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyUnits.value;
      this.coolingEfficiencyValue.equipName = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.coolingEquipmentName.value;
    }
    else if (this.hvacDetailsComponent?.formgroup.controls.airconditioning.value == 3) {
      this.coolingEfficiencyValue.efficiencyValue = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyValue.value;
      this.coolingEfficiencyValue.efficiencyUnits = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.acEfficiencyUnits.value;
      this.coolingEfficiencyValue.equipName = this.hvacDetailsComponent?.formgroup.get('coolefficiencyArray')['controls'][0].controls.coolingEquipmentName.value;
    }
  }

} 