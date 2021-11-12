import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { DialogData, DistTransformer } from 'src/app/shared/models/models';
import { ToolsService } from 'src/app/shared/services/tools.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'distributed-transformer-dialog',
  templateUrl: './distribution-transformer-dialog.html',
  styleUrls: ['./distribution-transformer-dialog.scss']
})
export class DialogOverviewExampleDialog implements OnInit {

  DialogTransformerInputs: FormGroup;
  policyLevels: number[] = [1, 2];
  FireRegulation: String[] = ["Fire standard distribution power transformers", "Fire safer distribution power transformers"];
  errMessage: string;
  InvalidPowerInput: Boolean = true;
  inputValue: DistTransformer = {};

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) { 

    }

  ngOnInit(): void {
    if (this.data.action == 'Update') {
      this.DialogTransformerInputs = this.updateVariant(this.data.selectedTransformer);
    } else {
      this.DialogTransformerInputs = this.createVariant();
    }
  }

  createVariant(): FormGroup {
    return this.fb.group({
      Power: ['', Validators.compose([Validators.required, Validators.max(3149)])],
      Stock: ['', Validators.compose([Validators.required])],
      PlateEfficiency: ['', Validators.compose([Validators.required, Validators.max(100), Validators.min(0)])],
      Energy: ['', Validators.compose([Validators.required])],
      EnergyPrice: ['', Validators.compose([Validators.required])],
      PolicyLevel: ['', Validators.compose([Validators.required])],
      FireRegulation: ['', Validators.compose([Validators.required])],
      HighestVoltageValues: ['', Validators.compose([Validators.required])],
      DualVoltWindings: ['', Validators.compose([Validators.required])],
      Capex: ['', Validators.compose([Validators.required])],
    });
  }

  updateVariant(selectedTransformer: DistTransformer): FormGroup {
    return this.fb.group({
      Power: [selectedTransformer.Power, Validators.compose([Validators.required, Validators.max(3149)])],
      Stock: [selectedTransformer.Stock, Validators.compose([Validators.required])],
      PlateEfficiency: [selectedTransformer.PlateEfficiency, Validators.compose([Validators.required, Validators.max(100), Validators.min(0)])],
      Energy: [selectedTransformer.Energy, Validators.compose([Validators.required])],
      EnergyPrice: [selectedTransformer.EnergyPrice, Validators.compose([Validators.required])],
      PolicyLevel: [selectedTransformer.PolicyLevel, Validators.compose([Validators.required])],
      FireRegulation: [selectedTransformer.FireRegulation, Validators.compose([Validators.required])],
      HighestVoltageValues: [selectedTransformer.HighestVoltageValues, Validators.compose([Validators.required])],
      DualVoltWindings: [selectedTransformer.DualVoltWindings, Validators.compose([Validators.required])],
      Capex: [selectedTransformer.Capex, Validators.compose([Validators.required])],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  addToTable() {
    if (this.DialogTransformerInputs.valid) {
      var newrequestnumber;
      if (this.data.action == 'Update') {
        newrequestnumber = this.data.selectedTransformer.Requestnumber;
      }
      else {
        newrequestnumber = this.data.requestCount + 1;
      }
      this.inputValue = {
        Requestnumber: newrequestnumber,
        Power: this.DialogTransformerInputs.controls.Power.value,
        Stock: this.DialogTransformerInputs.controls.Stock.value,
        PlateEfficiency: this.DialogTransformerInputs.controls.PlateEfficiency.value,
        Energy: this.DialogTransformerInputs.controls.Energy.value,
        EnergyPrice: this.DialogTransformerInputs.controls.EnergyPrice.value,
        PolicyLevel: this.DialogTransformerInputs.controls.PolicyLevel.value,
        FireRegulation: this.DialogTransformerInputs.controls.FireRegulation.value,
        HighestVoltageValues: this.DialogTransformerInputs.controls.HighestVoltageValues.value,
        DualVoltWindings: this.DialogTransformerInputs.controls.DualVoltWindings.value,
        Capex: this.DialogTransformerInputs.controls.Capex.value,
      }
      if (this.DialogTransformerInputs.controls.FireRegulation.value == 'Fire safer distribution power transformers'
        && this.DialogTransformerInputs.controls.Power.value < 50) {
        this.InvalidPowerInput = true;
        this.errMessage = 'Power should be above 50KVa If FireRegulation is Fire Safer Distribution Transformer';
        return
      }
      this.dialogRef.close(this.inputValue);
    }
  }


}