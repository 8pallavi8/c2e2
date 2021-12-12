import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import { Label } from 'ng2-charts';
import { throwError } from 'rxjs';
import { ErrorMessage, errorMessages, GeneralDetails, Summary } from 'src/app/shared/models/beet-models';
import { beetService } from 'src/app/shared/services/beet.service';
import { BuildingenvelopedetailsComponent } from './buildingenvelopedetails/buildingenvelopedetails.component';
import { CO2EmissionsComponent } from './co2-emissions/co2-emissions.component';
import { GendetailsComponent } from './gendetails/gendetails.component';
import { HvacComponent } from './hvac/hvac.component';
import { LightingComponent } from './lighting/lighting.component';
import { PlugloadsComponent } from './plugloads/plugloads.component';
import html2canvas from 'html2canvas';



export interface PlugLoadOptionsTable {
  plugloadops: string[];
  options?: string;
  quantity?: number;
}
export interface CalculatedTables {
  parameter: string;
  baselinevalue: number;
  energyefficienctvalue: number;
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
  @ViewChild('pdfTable', {static: false})
  pdfTable: ElementRef;
  isGenerating:boolean= false;
  
  errorMessages: ErrorMessage[] = errorMessages;
  errFieldMessages: string[] = [];
  showTables: boolean = false;
  showText: boolean = false;
  showProgress: boolean = false;
  inputvaluestable: CalculatedTables[];
  inputvaluestableDataSource: MatTableDataSource<CalculatedTables>
  intermediatevaluestable: CalculatedTables[];
  intermediatevaluestabletableDataSource: MatTableDataSource<CalculatedTables>
  outputvaluestable: CalculatedTables[];
  outputvaluestableDataSource: MatTableDataSource<CalculatedTables>
  monthresultstable: CalculatedTables[];
  monthresultstabletableDataSource: MatTableDataSource<CalculatedTables>
  economizersavingstable: CalculatedTables[];
  economizersavingstableDataSource: MatTableDataSource<CalculatedTables>
  inputsforgraphtable: CalculatedTables[];
  inputsforgraphtableDataSource: MatTableDataSource<CalculatedTables>
  plugloadoptions: PlugLoadOptionsTable[] = [];
  summary: Summary;
  inputTableDataSource: any;
  heatingEfficiencyValue: Efficiency = {};
  coolingEfficiencyValue: Efficiency = {};
  outerWallR: Rvalue = {};
  roofR: Rvalue = {};
  windowR: Rvalue = {};
  wwrValue: number;
  coolingEquipValues: Cooling = {};
  plugLoadValue: Plugloads = {};
  userId: string;
  @ViewChild(GendetailsComponent) genDetailsComponent: GendetailsComponent;
  @ViewChild(BuildingenvelopedetailsComponent) buildingdetailsComponent: BuildingenvelopedetailsComponent;
  @ViewChild(LightingComponent) lightingDetailsComponent: LightingComponent;
  @ViewChild(CO2EmissionsComponent) co2EmissionsDetailsComponent: CO2EmissionsComponent;
  @ViewChild(HvacComponent) hvacDetailsComponent: HvacComponent;
  @ViewChild(PlugloadsComponent) plugLoaDetailsComponent: PlugloadsComponent;
  displayedColumns: string[] = ["Parameter", "Units", "Value"];
  dataSource: any;
  reportdatasource: any;
  isGeneralDetailsUpdated: boolean;
  heatingEfficiencyFinal: number;
  generalDetails: GeneralDetails;
  showTogglePlusIcon: boolean = true;
  showTogglePlusIconbase: boolean = true;
  showTogglePlusIconhvac: boolean = true;
  showTogglePlusIconlight: boolean = true;
  showTogglePlusIconplugload: boolean = true;
  submitResponse: any;
  summaryTable: { Parameter: string; Units: any; Value: any; }[];
  displayedColumnsinputvalues = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsintermediatevalues = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsoutputvalues = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsmonthlyresults = ["month", "peakkwbaseline", "kwhbaseline", "thermsbaseline", "ngcubicmeterbaseline", "peakkwees", "kwhees", "thermsees", "ngcubicmeterees"];
  displayedColumnseconomizersavings = ["parameter", "baselinevalue", "efficientvalue"];
  displayedColumnsinputsforgraph = ["parameter", "parameterfield", "baselinevalue", "efficientvalue"];
  @ViewChild('errMsg') errMsg: ElementRef;
  step = 0;
  barChartLabels: Label[] = ['Total Energy [kWh/m²]', 'Heating Energy [m³N.G/m²]', 'Electric [kWh/m²]', 'Electric Peak [kW/m²]', 'Total Cost [$/m²]'];
  barChartLabels2: Label[] = ['Heating', 'Cooling'];
  barChartLabels3: Label[] = ['Lights', 'Plugs', 'fans'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] =
    [{ data: [55, 60, 45, 45, 90], label: 'Base Line' },
    { data: [23, 67, 34, 67, 78], label: 'Energy Efficient Scenario' }];

  barChartData2: ChartDataSets[] = [{ data: [55, 60], label: 'Base Line' },
  { data: [23, 67], label: 'Enerygy Efficient Scenario' }];

  barChartData3: ChartDataSets[] = [{ data: [55, 60, 89], label: 'Base Line' },
  { data: [23, 67, 89], label: 'Enerygy Efficient Scenario' }];

  barChartOptions: ChartOptions = { responsive: true, };
  isLoading: boolean = true;



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
    this.showSummary();
    this.onSaveGenDetails();
    this.onPlugLoadDetails();
    this.onSaveLightingDetails();
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
    var selectedcountryname = sessionStorage.getItem('selectedCountryName');
    this.summaryTable = [
      //{ Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.userName.value },
      //{ Parameter: 'Assessment name', Units: null, Value: this.genDetailsComponent.genDetailsForm.controls.projectName.value },
      { Parameter: 'Country', Units: null, Value: selectedcountryname },
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
      { Parameter: 'Solar Heat Gain Coefficient (SHGC) window', Units: '', Value: this.buildingdetailsComponent.formgroup.controls.SHGCknown.value.toFixed(2) },
      { Parameter: 'Window to wall ratio', Units: '%', Value: this.wwrValue.toFixed(2) },
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
        Value: this.hvacDetailsComponent.formgroup.controls.infiltrationValue.value.toFixed(2)
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

  backClicked() {
    this.showTables = false;
  }


  postDataGenerateReport() {
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
      if(this.hvacDetailsComponent.formgroup.get(field) instanceof FormArray){
        (<FormArray>this.hvacDetailsComponent.formgroup.get(field)).controls.forEach((element, index) => {
          Object.keys((<FormGroup>element).controls).forEach(subfield => {
              if((<FormGroup>element).get(subfield).invalid){
                this.errorMessages.forEach(ele => {
                  if (ele.key == subfield) {
                    this.errFieldMessages.push(ele.errMessage);
                  }
                });
              }
          } );
        });
      }
      else if(this.buildingdetailsComponent.formgroup.get(field) instanceof FormArray){
        (<FormArray>this.buildingdetailsComponent.formgroup.get(field)).controls.forEach((element, index) => {
          Object.keys((<FormGroup>element).controls).forEach(subfield => {
              if((<FormGroup>element).get(subfield).invalid){
                this.errorMessages.forEach(ele => {
                  if (ele.key == subfield) {
                    this.errFieldMessages.push(ele.errMessage);
                  }
                });
              }
          } );
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
      if(this.hvacDetailsComponent.formgroup.get(field) instanceof FormArray){
        (<FormArray>this.hvacDetailsComponent.formgroup.get(field)).controls.forEach((element, index) => {
          Object.keys((<FormGroup>element).controls).forEach(subfield => {
              if((<FormGroup>element).get(subfield).invalid){
                this.errorMessages.forEach(ele => {
                  if (ele.key == subfield) {
                    this.errFieldMessages.push(ele.errMessage);
                  }
                });
              }
          } );
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
      this.postBeetPayload();
    }

  }

  postBeetPayload() {
    // try{
    this.showProgress = true;
    var selectedcountryname = sessionStorage.getItem('selectedCountryName');
    if (this.genDetailsComponent.genDetailsForm.valid) {
      try {
        this.plugloadoptions = [];
        (<FormArray>this.plugLoaDetailsComponent.formgroup.get('plugLoadOptionsArray')).controls.forEach((element, index) => {
          var optionsplugload: any = {
            operation: (<FormGroup>element).controls.operation.value,
            operationresponse: (<FormGroup>element).controls.operationresponse.value,
            quantity: (<FormGroup>element).controls.quantity.value,
          }
          this.plugloadoptions.push(optionsplugload);
        });

        var payload: any = {
          //username: this.genDetailsComponent.genDetailsForm.controls.userName.value,
          //projectname: this.genDetailsComponent.genDetailsForm.controls.projectName.value,
          country: selectedcountryname,
          province: this.genDetailsComponent.genDetailsForm.controls.province.value,
          location: this.genDetailsComponent.genDetailsForm.controls.location.value,
          buildingtype: this.genDetailsComponent.genDetailsForm.controls.buildingType.value,
          buildingspaces: this.genDetailsComponent.genDetailsForm.controls.buildingSpaces.value,
          // yearofconstruction: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value.toString(),
          nooffloors: this.genDetailsComponent.genDetailsForm.controls.noOfFloors.value,
          occupancyhrsperweek: this.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value,
          buildinggrossarea: Number(this.genDetailsComponent.genDetailsForm.controls.buildingGrossArea.value),
          buildinggrossareaunit: this.genDetailsComponent.genDetailsForm.controls.grossAreaUnits.value,
          netoccupiedarea: this.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value,
          netoccupiedareaunit: this.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
          occupantdensity: Number(this.genDetailsComponent.genDetailsForm.controls.occupantDensityKnown.value),
          occupantdensityunit: this.genDetailsComponent.genDetailsForm.controls.occupantDensityUnits.value,
          electricitycost: this.genDetailsComponent.genDetailsForm.controls.electricityCost.value,
          electricitycostunit: this.genDetailsComponent.genDetailsForm.controls.electricityUnits.value,
          fuelcost: this.genDetailsComponent.genDetailsForm.controls.fuelCost.value,
          fuelcostunit: this.genDetailsComponent.genDetailsForm.controls.fuelUnits.value,
          rvaluewall: Number(this.outerWallR.rValue),
          rvaluewallunit: this.outerWallR.rUnits,
          rvalueroof: Number(this.roofR.rValue),
          rvalueroofunit: this.roofR.rUnits,
          rvaluewindow: Number(this.windowR.rValue),
          rvaluewindowunit: this.windowR.rUnits,
          shgc: Number(this.buildingdetailsComponent.formgroup.controls.SHGCknown.value),
          windowtowallratio: this.wwrValue,
          windowtowallratiounit: '%',
          totallightingpower: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value,
          totallightingpowerunit: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
          lightingdensity: Number(this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value),
          lightingdensityunit: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
          totalpower: this.lightingDetailsComponent.LightningDetailsForm.controls.totalPower.value,
          heatingequipment: this.heatingEfficiencyValue.equipName,
          heatingefficiency: this.heatingEfficiencyValue.efficiencyValue,
          heatingefficiencyunit: this.heatingEfficiencyValue.efficiencyUnits,
          coolingequipment: this.coolingEfficiencyValue.equipName,
          coolingefficiency: this.coolingEfficiencyValue.efficiencyValue,
          coolingefficiencyunit: this.coolingEfficiencyValue.efficiencyUnits,
          ventilationrate: Number(this.hvacDetailsComponent.formgroup.controls.ventilationValue.value),
          ventilationrateunit: this.hvacDetailsComponent.formgroup.controls.ventilationUnits.value,
          infiltrationrate: Number(this.hvacDetailsComponent.formgroup.controls.infiltrationValue.value),
          infiltrationrateunit: this.hvacDetailsComponent.formgroup.controls.infiltrationUnits.value,
          economizer: this.hvacDetailsComponent.formgroup.controls.economizer.value,
          avgindoortemperature: Number(this.hvacDetailsComponent.formgroup.controls.avgIndoorAirTemp.value),
          avgindoortemperatureunit: this.hvacDetailsComponent.formgroup.controls.avgIndoorAirTempUnit.value,
          controllerhvaccompressors: this.hvacDetailsComponent.formgroup.controls.hvacCompressorInstalled.value,
          controllerhvacfans: this.hvacDetailsComponent.formgroup.controls.hvacFansandBlowersInstalled.value,
          plugloaddensity: this.plugLoaDetailsComponent.formgroup.controls.plugLoadValueKnown.value,
          plugloaddensityunit: this.plugLoaDetailsComponent.formgroup.controls.plugLoadUnits.value,
          plugloadoperations: this.plugloadoptions,
          gridemissionsfactor: this.co2EmissionsDetailsComponent.formgroup.controls.gridemissionsFactor.value,
          gridemissionsfactorunit: this.co2EmissionsDetailsComponent.formgroup.controls.gridemissionsFactorUnits.value,
          onsiteemissions: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorValue.value,
          onsiteemissionsunit: this.co2EmissionsDetailsComponent.formgroup.controls.fuelEmissionFactorUnit.value,
        }
        console.log(payload);
        this.beetService.postDataGenerateReport(payload).subscribe(res => {
          try {
            console.log(res.success);
            this.submitResponse = res.success;

            const heatingObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Heating'))[0]
            const heating_baseline = heatingObj.baselinevalue;
            const heating_energyeffval = heatingObj.energyefficienctvalue;


            const coolingObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Cooling'))[0]
            const cooling_baseline = coolingObj.baselinevalue;
            const cooling_energyeffval = coolingObj.energyefficienctvalue;


            this.barChartData2 = [{ data: [heating_baseline, cooling_baseline], label: 'Base Line' },
            { data: [heating_energyeffval, cooling_energyeffval], label: 'Enerygy Efficient Scenario' }];


            const totalEnergyObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Total Energy [kWh/m²]'))[0]
            const totalEnergy_baseline = totalEnergyObj.baselinevalue;
            const totalEnergy_energyeffval = totalEnergyObj.energyefficienctvalue;


            const heatingEnergyObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Heating Energy [m³N.G/m²]'))[0]
            console.log(heatingEnergyObj);
            const heatingEnergy_baseline = heatingEnergyObj.baselinevalue;
            const heatingEnergy_energyeffval = heatingEnergyObj.energyefficienctvalue;

            const electricPeakObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Electric Peak [kW/m²]'))[0]
            const electricPeak_baseline = electricPeakObj.baselinevalue;
            const electricPeak_energyeffval = electricPeakObj.energyefficienctvalue;


            const electricObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Heating Energy [m³N.G/m²]'))[0]
            const electric_baseline = electricObj.baselinevalue;
            const electric_energyeffval = electricObj.energyefficienctvalue;

            const totalCostObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Total Cost [$/m²]'))[0]
            const totalCost_baseline = totalCostObj.baselinevalue;
            const totalCost_energyeffval = totalCostObj.energyefficienctvalue;


            this.barChartData = [{ data: [totalEnergy_baseline, heatingEnergy_baseline, electric_baseline, electricPeak_baseline, totalCost_baseline], label: 'Base Line' },
            { data: [totalEnergy_energyeffval, heatingEnergy_energyeffval, electric_energyeffval, electricPeak_energyeffval, totalCost_energyeffval], label: 'Enerygy Efficient Scenario' }];

            const lightsObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Lights'))[0]
            const lights_baseline = lightsObj.baselinevalue;
            const lights_energyeffval = lightsObj.energyefficienctvalue;


            const plugsObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Plugs'))[0]
            const plugs_baseline = plugsObj.baselinevalue;
            const plugs_energyeffval = plugsObj.energyefficienctvalue;

            const fansObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Fans'))[0]
            const fans_baseline = fansObj.baselinevalue;
            const fans_energyeffval = fansObj.energyefficienctvalue;


            this.barChartData3 = [{ data: [lights_baseline, plugs_baseline, fans_baseline], label: 'Base Line' },
            { data: [lights_energyeffval, plugs_energyeffval, fans_energyeffval], label: 'Enerygy Efficient Scenario' }];
            this.showProgress = false;
            this.showTables = true;

            /*  if (res.status == 'success') {
              console.log(res.success);
              this.isGeneralDetailsUpdated = true;
              this.userId = res.success;
              sessionStorage.setItem('userId', this.userId);
            } */
          } catch (e) {
            console.log(e);
            this.showProgress = false;
            this.showTables = false;
            throwError(e);
          }

        });
      } catch (e) {
        console.log(e);
        this.showProgress = false;
        this.showTables = false;
      }

    }

  }
  saveBuildingDetails() {
    console.log(this.buildingdetailsComponent?.formgroup);
    if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 1) {
      if (this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallRKnown.value != '') {
        this.outerWallR.rValue = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallRKnown.value.toFixed(2);
        this.outerWallR.rUnits = this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.outerwallrUnits.value;
      } else {
        this.outerWallR.rValue = 0;
      }
    }
    else if (this.buildingdetailsComponent?.formgroup.controls.outerwallr.value == 2) {
      console.log(this.buildingdetailsComponent?.formgroup.get('outerWallArray')['controls'][0].controls.rimages.value.rvalue );
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
      }else {
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
  showHiddenText() {
    this.showText = !this.showText;
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
  toggleButtonShowIcon() {
    this.showTogglePlusIcon = !this.showTogglePlusIcon;
  }

  toggleButtonShowIconbase() {
    this.showTogglePlusIconbase = !this.showTogglePlusIconbase;
  }

  toggleButtonShowhvac() {
    this.showTogglePlusIconhvac = !this.showTogglePlusIconhvac;
  }

  toggleButtonShowlight() {
    this.showTogglePlusIconlight = !this.showTogglePlusIconlight;
  }

  toggleButtonShowplugload() {
    this.showTogglePlusIconplugload = !this.showTogglePlusIconplugload;
  }
  Goback() {
    this.showTables = false;
  }


  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async getPDF(){
    this.isGenerating = true;
    this.showTogglePlusIcon = false ;
    this.showTogglePlusIconbase =false;
    this.showTogglePlusIconhvac=false;
    this.showTogglePlusIconlight=false;
    this.showTogglePlusIconplugload = false;

    await this.delay(3000);
    let general  = document.getElementById('general-section');
    let baseline = document.getElementById('baseline-potential');
    let hvac = document.getElementById('hvac');
    let lightining = document.getElementById('lightining');
    
    var pdf = new jsPDF('p', 'pt', [1200,1800]);

    this.generateCanvas(pdf,general,40,false);
    this.generateCanvas(pdf,baseline,40,false); 
    this.generateCanvas(pdf,hvac,40,true); 
    this. isGenerating= false;
    //this.generateCanvas(pdf,lightining,40,true); 
  };

  generateCanvas(pdf,sectionDiv, top_left_margin,savePDF){
    var HTML_Width = sectionDiv.offsetWidth;
    var HTML_Height = sectionDiv.offsetHeight;
    console.log("HTML Weight height "+HTML_Width+"    "+HTML_Height);
    var PDF_Width = HTML_Width+(top_left_margin*2);
    var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;
    
    var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
    html2canvas(sectionDiv).then(function(canvas) {
      canvas.getContext('2d');
      console.log(canvas.height+"  "+canvas.width);
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
              if(savePDF != true){
                  pdf.addPage()
              }
              if(savePDF == true){
                pdf.save("Beet-Report.pdf");
              }
        }); 

       
  }
} 


