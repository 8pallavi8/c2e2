import { Component, OnInit , Inject} from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { DialogData, DistTransformer } from 'src/app/shared/models/models';
import { ToolsService } from 'src/app/shared/services/tools.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from './newtransformer-dialog/distribution-transformer-dialog';
import {Location} from '@angular/common';

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
  public pieChartOptions: ChartOptions = {responsive: true,};
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  barChartOptions: ChartOptions ={responsive: true,};
  barChartLabels: Label[] = ['CO2 baseline', 'Final CO2 emissions'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [{ data: [], label: 'CO2 emissions' }];
  showForms: boolean = true;
  policyLevels: number[] = [1, 2];
  FireRegulation: String[] = ["Fire standard distribution power transformers", "Fire safer distribution power transformers"];
  submitted: boolean;
  errMessage: string;
  dataSource: any;
  inputTableDataSource : any ;
  countrylist: String[];
  highestVoltageValueslist: String[];
  dualVoltWindings: String[];
  inputDisplayedColumns: string[] = [
    'Power',
    'Stock',
    'PlateEfficiency',
    'Energy',
    'EnergyPrice',
    'PolicyLevel',
    'FireRegulation',
    'HighestVoltageValues',
    'DualVoltWindings',
    'Capex'
  ]
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

  DisTransformerInputs: FormGroup;
  forminputs: FormArray;
  InputValuesArr: DistTransformer[] = [];
  inputValues: DistTransformer[] = [];
  ctr = 0;
  
  constructor(private fb: FormBuilder, private toolService: ToolsService, public dialog: MatDialog, private _location: Location) { }

  backClicked() {
   /* this.showForms=true;
   this.inputValues=[];
   this.inputTableDataSource= []; */
   location.reload();
  } 

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
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '80%',
      autoFocus: false,
      maxHeight: '90vh',
      data: {highestVoltageValueslist: this.highestVoltageValueslist,
         dualVoltWindings: this.dualVoltWindings ,
         requestCount : this.inputValues.length}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result !== undefined){
        this.inputValues.push(result);
        const clonedInputValues = [...this.inputValues];
        this.inputTableDataSource = clonedInputValues;
      }
    });
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

  removeVariant(index): void {
    this.forminputs.removeAt(index);
    console.log(this.forminputs);
  }

  addNewTransformerVariant() {
    var transReq = {
      ReqTimeStamp: Date.now(),
      Country: this.DisTransformerInputs.get('Country').value,
      InputValuesArr: this.inputValues
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
      } 
      
      else {
        this.showForms = true;
      }
    });

    
  }
}