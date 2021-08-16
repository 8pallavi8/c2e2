import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

import { DistTransformer } from 'src/app/shared/models/models';
import { ToolsService } from 'src/app/shared/services/tools.service';

export interface FinalTable {
  efficacy?: number;
  ll?: number;
  nl?: number;
  energyeffyincrease?: number;
  energy?: number;
  financial?: number;
  paybackperiod?: number;
  co2baseline?: number;
  co2savingston?: number;
  co2savingspercent?: number;
  finalco2emissions?: number;
}

export interface PieArray {
  label?: string;
  value?: number;
}

@Component({
  selector: 'app-dis-transformer',
  templateUrl: './distribution-transformer.component.html',
  styleUrls: ['./distribution-transformer.component.scss']
})
export class DisTransformerComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  barChartOptions: ChartOptions ={
    responsive: true,
  };
  barChartLabels: Label[] = ['CO2 baseline', 'Final CO2 emissions'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [], label: 'CO2 emissions' }
  ];
  
  showForms: boolean = true;
  DisTransformerInputs: FormGroup;
  forminputs: FormArray;
  InputValuesArr: DistTransformer[] = [];
  //countries: CountryCodes[] = ISO_3166_1_CODES;
  policyLevels: number[] = [1, 2];
  FireRegulation: String[] = ["Fire standard distribution power transformers", "Fire safer distribution power transformers"];
  submitted: boolean;
  errMessage: string;
  dataSource: any;
  countrylist: String[];
  highestVoltageValueslist: String[];
  dualVoltWindings: String[];
  displayedColumns: string[] = [
    'efficacy',
    'll',
    'nl',
    'energyeffyincrease',
    'energy',
    'financial',
    'paybackperiod',
    'co2baseline',
    'co2savingston',
    'co2savingspercent',
    'finalco2emissions'
  ];
  pieData: number[] = [];
  pieLabels: string[] = [];
  constructor(private fb: FormBuilder, private toolService: ToolsService) { }


  ngOnInit(): void {
    this.toolService.getTool1Inputs().subscribe(res => {
      console.log(res.Countries);
      this.countrylist = res.Countries;
      this.highestVoltageValueslist = res.HighestVoltageValues;
      this.dualVoltWindings = res.DualVoltWindings;
      console.log(this.highestVoltageValueslist);
    })

    this.DisTransformerInputs = this.fb.group({
      Country: ['', Validators.compose([Validators.required])],
      forminputs: this.fb.array([this.createVariant()])
    });
    // const ELEMENT_DATA: FinalTable[] = [
    //   {
    //     efficacy: 97.74,
    //     ll: 1135.071,
    //     nl: 92.78,
    //     energyeffyincrease: 4,
    //     energy: 29.99,
    //     financial: 3599.43,
    //     paybackperiod: 25.016,
    //     co2baseline: 158.88,
    //     co2savingston: 23.82,
    //     co2savingspercent: 14.99,
    //     finalco2emissions: 135.05
    //   },
    //   {
    //     efficacy: 99.15,
    //     ll: 11433.08,
    //     nl: 1692.06,
    //     energyeffyincrease: 16.65,
    //     energy: 33.31,
    //     financial: 3997.38,
    //     paybackperiod: 25.01,
    //     co2baseline: 158.88,
    //     co2savingston: 26.46,
    //     co2savingspercent: 16.65,
    //     finalco2emissions: 132.41
    //   },
    //   {
    //     efficacy: 99.29,
    //     ll: 19579.12,
    //     nl: 3093.73,
    //     energyeffyincrease: 16.817,
    //     energy: 33.63,
    //     financial: 4036.23,
    //     paybackperiod: 24.77,
    //     co2baseline: 158.88,
    //     co2savingston: 26.71,
    //     co2savingspercent: 16.81,
    //     finalco2emissions: 132.16
    //   }


    // ];
    //this.dataSource = ELEMENT_DATA;
  }

  createVariant(): FormGroup {
    return this.fb.group({
      Power: ['', Validators.compose([Validators.required])],
      Stock: ['', Validators.compose([Validators.required])],
      PlateEfficiency: ['', Validators.compose([Validators.required])],
      Energy: ['', Validators.compose([Validators.required])],
      EnergyPrice: ['', Validators.compose([Validators.required])],
      PolicyLevel: ['', Validators.compose([Validators.required])],
      FireRegulation: ['', Validators.compose([Validators.required])],
      HighestVoltageValues: ['', Validators.compose([Validators.required])],
      DualVoltWindings: ['', Validators.compose([Validators.required])],
      Capex: ['', Validators.compose([Validators.required])],
    });

  }

  addTransformerVariant(): void {
    this.forminputs = this.DisTransformerInputs.get('forminputs') as FormArray;
    if ((<FormArray>this.DisTransformerInputs.get('forminputs')).length <= 10) {
      this.forminputs.push(this.createVariant());
    } else {
      this.errMessage = 'Can not exceed 10 Inputs'
    }

    console.log(this.DisTransformerInputs);
  }

  removeVariant(index): void {
    this.forminputs.removeAt(index);
    console.log(this.forminputs);
  }

  addNewTransformerVariant() {
    console.log('form value: ', (<FormArray>this.DisTransformerInputs.get('forminputs')).length);
    this.InputValuesArr = [];
    if (this.DisTransformerInputs.valid) {
      for (let i = 0; i < (<FormArray>this.DisTransformerInputs.get('forminputs')).length; i++) {
        console.log((<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).value);
        var formInput: DistTransformer = {
          Requestnumber: i + 1,
          Power: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.Power.value,
          Stock: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.Stock.value,
          PlateEfficiency: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.PlateEfficiency.value,
          Energy: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.Energy.value,
          EnergyPrice: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.EnergyPrice.value,
          PolicyLevel: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.PolicyLevel.value,
          FireRegulation: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.FireRegulation.value,
          HighestVoltageValues: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.HighestVoltageValues.value,
          DualVoltWindings: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.DualVoltWindings.value,
          Capex: (<FormGroup>(<FormArray>this.DisTransformerInputs.get('forminputs')).controls[i]).controls.Capex.value
        }
        this.InputValuesArr.push(formInput);
      }
      var transReq = {
        ReqTimeStamp: Date.now(),
        Country: this.DisTransformerInputs.get('Country').value,
        InputValuesArr: this.InputValuesArr
      }

      this.toolService.sendDisTransformerDetails(transReq).subscribe(res => {
        console.log(res);
        if (res.status == 'success') {
          var finalOutValues: FinalTable[] = [];
          res.success.finalvalues.forEach(ele => {
            console.log(ele);
            finalOutValues.push(ele);
          });
          finalOutValues.push({
            efficacy: res.success.totalfinalvalues.totalefficacy,
            ll: res.success.totalfinalvalues.totalll,
            nl: res.success.totalfinalvalues.totalnl,
            energyeffyincrease: res.success.totalfinalvalues.totalenergyeffyincrease,
            energy: res.success.totalfinalvalues.totalenergy,
            financial: res.success.totalfinalvalues.totalfinancial,
            paybackperiod: res.success.totalfinalvalues.totalpaybackperiod,
            co2baseline: res.success.totalfinalvalues.totalco2baseline,
            co2savingston: res.success.totalfinalvalues.totalco2savingston,
            co2savingspercent: res.success.totalfinalvalues.totalco2savingspercent,
            finalco2emissions: res.success.totalfinalvalues.totalfinalco2emissions,
          });
          this.barChartData.forEach(ele => {
            ele.data.push(res.success.totalfinalvalues.totalco2baseline);
            ele.data.push(res.success.totalfinalvalues.totalfinalco2emissions);
          })
          this.dataSource = finalOutValues;
          for (let i = 0; i < finalOutValues.length - 1; i++) {
            var calEnergy = (finalOutValues[i].energy / finalOutValues[finalOutValues.length - 1].energy) * 100;
            this.pieChartLabels.push('E' + i);
            this.pieChartData.push(Math.round(calEnergy * 10) / 10);
          }
        
          this.barChartData.push()
          console.log(this.dataSource, this.pieLabels, this.pieData);
          this.showForms = false;
        } else {
          this.showForms = true;
        }
      });
      //console.log(this.InputValuesArr);
    } else {
      this.submitted = true;
    }
  }
}