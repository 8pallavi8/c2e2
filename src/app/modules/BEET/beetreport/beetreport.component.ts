import { Component, OnInit } from '@angular/core';
import { BuildingenvelopedetailsComponent } from '../buildingenvelopedetails/buildingenvelopedetails.component';
import { CO2EmissionsComponent } from '../co2-emissions/co2-emissions.component';
import { GendetailsComponent } from '../gendetails/gendetails.component';
import { HvacComponent } from '../hvac/hvac.component';
import { LightingComponent } from '../lighting/lighting.component';
import { PlugloadsComponent } from '../plugloads/plugloads.component';
import { beetService } from 'src/app/shared/services/beet.service';
import { BEETComponent } from '../beet.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Color, Label } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BeetreportpdfComponent } from 'src/app/shared/beetreportpdf/beetreportpdf.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-beetreport',
  templateUrl: './beetreport.component.html',
  styleUrls: ['./beetreport.component.scss']
})
export class BeetreportComponent implements OnInit {
  showTogglePlusIcon: boolean = true;
  showTogglePlusIconbase: boolean = true;
  showTogglePlusIconhvac: boolean = true;
  showTogglePlusIconlight: boolean = true;
  showTogglePlusIconplugload: boolean = true;
  showTogglePlusIconAssump: boolean = true;
  isGenerating: boolean = false;
  genDetailsComponent: GendetailsComponent;
  buildingdetailsComponent: BuildingenvelopedetailsComponent;
  lightingDetailsComponent: LightingComponent;
  co2EmissionsDetailsComponent: CO2EmissionsComponent;
  hvacDetailsComponent: HvacComponent;
  plugLoaDetailsComponent: PlugloadsComponent;
  beetComponent: BEETComponent;
  formAvailable: boolean = false;
  showProgress: boolean = false;
  wwrValue: number;
  barChartLabels: Label[] = ['Total Energy [kWh/m²]', 'Heating Energy [m³N.G/m²]', 'Electric [kWh/m²]', 'Electric Peak [kW/m²]', 'Total Cost [$/m²]'];
  barChartLabels2: Label[] = ['Heating', 'Cooling'];
  barChartLabels3: Label[] = ['Lights', 'Plugs', 'fans'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  inputchildvalud: any = 0;
  barChartOptionsperformance: ChartOptions = {
    responsive: true,
    legend: { display: false },
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: true },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'ARS/year'
        }
      }]
    }
  };

  barChartColors: Color[] = [
    {
      backgroundColor: '#FF7D00'
    },
    {
      backgroundColor: '#3cd070'
    }
  ];
  barChartData: { data: any[]; label: string; }[];
  barChartData2: { data: any[]; label: string; barThickness: number; }[];
  barChartData3: { data: any[]; label: string; barThickness: number }[];
  submitResponse: any;
  showPDFView: boolean = false;
  beetReportForm: FormGroup;
  pdfInputForm = new FormControl();
  debug: string = 'false';
  debugPayload: string;


  constructor(private route:ActivatedRoute , private beetService: beetService, public dialog: MatDialog,
    private fb: FormBuilder,) { }
  ngOnInit(): void {
    this.beetReportForm = this.fb.group({
      userName: [''],
      projectName: [''],
      yearOfConstruction: [''],
    });;
    this.showProgress = true;
    this.debug = this.route.snapshot.queryParamMap.get("debug")
    this.route.queryParamMap.subscribe(queryParams => {
      this.debug = queryParams.get("debug")
    })

  }

  selectionChange(event: StepperSelectionEvent) {
    console.log(event.selectedStep.label);
  }

  onToggleChange(event) {
    console.log(this.pdfInputForm.value);
  } 

  ngAfterViewInit() {
    this.showProgress = true;
    this.formAvailable = false;
    this.beetComponent = this.beetService.getBEETParentComponent();
    console.log(this.beetComponent);
    this.genDetailsComponent = this.beetComponent.genDetailsComponent;
    this.buildingdetailsComponent = this.beetComponent.buildingdetailsComponent;
    this.plugLoaDetailsComponent = this.beetComponent.plugLoaDetailsComponent;
    this.lightingDetailsComponent = this.beetComponent.lightingDetailsComponent;
    this.hvacDetailsComponent = this.beetComponent.hvacDetailsComponent;
    this.co2EmissionsDetailsComponent = this.beetComponent.co2EmissionsDetailsComponent;
    // this.formAvailable = true;
  }

  async postBeetPayload() {
    // try{
    this.showProgress = true;
    this.showPDFView = false;

    // this.delay(5000);

    var selectedcountryname = sessionStorage.getItem('selectedCountryName');
    if (this.genDetailsComponent.genDetailsForm.valid) {
      try {
        this.beetComponent.plugloadoptions = [];
        (<FormArray>this.plugLoaDetailsComponent.formgroup.get('plugLoadOptionsArray')).controls.forEach((element, index) => {
          var optionsplugload: any = {
            operation: (<FormGroup>element).controls.operation.value,
            operationresponse: (<FormGroup>element).controls.operationresponse.value,
            quantity: (<FormGroup>element).controls.quantity.value,
          }
          this.beetComponent.plugloadoptions.push(optionsplugload);
        });

        var payload: any = {
          //username: this.genDetailsComponent.genDetailsForm.controls.userName.value,
          //projectname: this.genDetailsComponent.genDetailsForm.controls.projectName.value,
          country: selectedcountryname,
          province: this.genDetailsComponent.genDetailsForm.controls.province.value,
          location: this.genDetailsComponent.genDetailsForm.controls.location.value,
          buildingtype: this.genDetailsComponent.genDetailsForm.controls.buildingType.value,
          buildingspaces: this.genDetailsComponent.genDetailsForm.controls.buildingSpaces.value,
          //yearofconstruction: this.genDetailsComponent.genDetailsForm.controls.yearOfConstruction.value.toString(),
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
          rvaluewall: Number(this.beetComponent.outerWallR.rValue),
          rvaluewallunit: this.beetComponent.outerWallR.rUnits,
          rvalueroof: Number(this.beetComponent.roofR.rValue),
          rvalueroofunit: this.beetComponent.roofR.rUnits,
          rvaluewindow: Number(this.beetComponent.windowR.rValue),
          rvaluewindowunit: this.beetComponent.windowR.rUnits,
          shgc: Number(this.buildingdetailsComponent.formgroup.controls.SHGCknown.value),
          windowtowallratio: this.wwrValue,
          windowtowallratiounit: '%',
          totallightingpower: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerValue.value,
          totallightingpowerunit: this.lightingDetailsComponent.LightningDetailsForm.controls.totalLightingPowerUnit.value,
          lightingdensity: Number(this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityValue.value),
          lightingdensityunit: this.lightingDetailsComponent.LightningDetailsForm.controls.lightingPowerDensityUnit.value,
          totalpower: this.lightingDetailsComponent.LightningDetailsForm.controls.totalPower.value,
          heatingequipment: this.beetComponent.heatingEfficiencyValue.equipName,
          heatingefficiency: this.beetComponent.heatingEfficiencyValue.efficiencyValue,
          heatingefficiencyunit: this.beetComponent.heatingEfficiencyValue.efficiencyUnits,
          coolingequipment: this.beetComponent.coolingEfficiencyValue.equipName,
          coolingefficiency: this.beetComponent.coolingEfficiencyValue.efficiencyValue,
          coolingefficiencyunit: this.beetComponent.coolingEfficiencyValue.efficiencyUnits,
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
          plugloadoperations: this.beetComponent.plugloadoptions,
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
            console.log(this.submitResponse);

            const heatingObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Heating'))[0]
            const heating_baseline = heatingObj.baselinevalue;
            const heating_energyeffval = heatingObj.energyefficienctvalue;

            const coolingObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Cooling'))[0]
            const cooling_baseline = coolingObj.baselinevalue;
            const cooling_energyeffval = coolingObj.energyefficienctvalue;

            this.barChartData2 = [{ data: [heating_baseline, cooling_baseline], label: 'Base Line', barThickness: 30 },
            { data: [heating_energyeffval, cooling_energyeffval], label: 'Enerygy Efficient Scenario', barThickness: 30 }];
            this.submitResponse.barChartData2 = this.barChartData2;
            const totalEnergyObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Total Energy [kWh/m²]'))[0]
            const totalEnergy_baseline = totalEnergyObj.baselinevalue;
            const totalEnergy_energyeffval = totalEnergyObj.energyefficienctvalue;

            const heatingEnergyObj = res.success.graphinputs.filter(p => p.parameter.includes('Performance Indices [metrics]') && p.parameterfield.includes('Heating Energy [m³N.G/m²]'))[0]
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
            this.submitResponse.barChartData = this.barChartData;
            const lightsObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Lights'))[0]
            const lights_baseline = lightsObj.baselinevalue;
            const lights_energyeffval = lightsObj.energyefficienctvalue;

            const plugsObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Plugs'))[0]
            const plugs_baseline = plugsObj.baselinevalue;
            const plugs_energyeffval = plugsObj.energyefficienctvalue;

            const fansObj = res.success.graphinputs.filter(p => p.parameter.includes('Energy Cost') && p.parameterfield.includes('Fans'))[0]
            const fans_baseline = fansObj.baselinevalue;
            const fans_energyeffval = fansObj.energyefficienctvalue;

            this.barChartData3 = [{ data: [lights_baseline, plugs_baseline, fans_baseline], label: 'Base Line', barThickness: 30 },
            { data: [lights_energyeffval, plugs_energyeffval, fans_energyeffval], label: 'Enerygy Efficient Scenario', barThickness: 30 }];

            this.submitResponse.barChartData3 = this.barChartData3;

            this.showProgress = false;
            this.formAvailable = true

          } catch (e) {
            this.showProgress = false;
            this.formAvailable = true
            // this.showTables = false;
            throwError(e);
          }
        });
      } catch (e) {
        console.log(e);
        this.showProgress = false;
        //this.showTables = false;
      }
    }
    this.showProgress = false;
    this.formAvailable = true
    if(this.debug == 'true'){
      this.debugPayload = JSON.stringify(payload);
    }
   
  }

  generatePdf() {
    console.log(this.submitResponse);

    this.showPDFView = true;

    const dialogref = this.dialog.open(BeetreportpdfComponent, {
      width: '90%',
      maxWidth:"100%",
      autoFocus: false,
      maxHeight: '100vh',
      data: this.submitResponse
    });
    dialogref.afterClosed().subscribe(result => {
    });
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  toggleButtonShowAssump() {
    this.showTogglePlusIconAssump = !this.showTogglePlusIconAssump;
  }
  
}


