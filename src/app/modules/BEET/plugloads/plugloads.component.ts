import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { PlugloadavailablevaldialogComponent } from 'src/app/shared/plugloadavailablevaldialog/plugloadavailablevaldialog.component';
import { PlugloadinputdialogComponent } from 'src/app/shared/plugloadinputdialog/plugloadinputdialog.component';
import { beetService } from 'src/app/shared/services/beet.service';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { isObjectLiteralElement } from 'typescript';

export interface OPTIONS {
  operations: string;
  options: string;
  quantity: number;
}

export interface PlugLoadAvailableTable {
  select?: number;
  buildingtype: string;
  avgpplwperft2: number;
  avgpplwperm2: number;
  totalareaft2: number;
  totalaream2: number;
}

export interface PlugLoadGuideTable {
  space: string;
  plugloadappliance: string;
  yearofinstallation?: "",
  avgpowerwatts?: number,
  stock?: number,
  avgoperatinghrs?: number
}

export interface PlugLoadOptionsTable {
  plugloadops: string[];
  options?: string;
  quantity?: number;
}


@Component({
  selector: 'app-plugloads',
  templateUrl: './plugloads.component.html',
  styleUrls: ['./plugloads.component.scss']
})

export class PlugloadsComponent implements OnInit {
  submitted: boolean = false;
  formgroup: FormGroup;
  displayedColumns = ['plugloadops', 'options', 'quantity'];
  selectionOptions = ['Yes', 'No', 'NA'];
  plugloadvalue: number;
  plugLoadUnits: string = 'watts per square meter';
  dialogref: any;
  selCountryCode: string;
  selecteditems: string[];
  plugLoadPredefined: PlugLoadAvailableTable[];
  plugLoadGuide: PlugLoadGuideTable[];
  selectedElement: PlugLoadAvailableTable;
  displayOPTCColumns = ["select", "buildingtype", "avgpplwperft2", "avgpplwperm2", "totalareaft2", "totalaream2"];
  displayOptBColumns = ["space", "plugloadappliance", "Yearofinstallation", "Average Power", "Connected stock of equipment", "Average operating hours per day"];
  optcDataSource: MatTableDataSource<PlugLoadAvailableTable>;
  optbDataSource: MatTableDataSource<PlugLoadGuideTable>;
  plugloadOptionsDataSource: MatTableDataSource<PlugLoadOptionsTable>;
  plugloadoptions: PlugLoadOptionsTable[];
  grossAreaValue: number;
  grossAreaValueUnits: string;
  plugLoadItems: FormArray = this.fb.array([]);
  plugLoadForms: FormGroup;


  constructor(private fb: FormBuilder, public dialog: MatDialog, private inputDialog: InputdialogService,
    private beetService: beetService) { }


  ngOnInit(): void {
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      plugLoadArray: this.fb.array([]),
    }
    );
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      this.plugLoadPredefined = res.success.plugloadoptctable;
      this.plugLoadGuide = res.success.plugloadoptbtable;
      this.plugloadoptions = res.success.plugloadoperations;
      this.beetService.getBuildingGrossArea().subscribe(res => { this.grossAreaValue = res; });
      this.beetService.getBuildingGrossAreaUnits().subscribe(res => { this.grossAreaValueUnits = res; });
      this.plugloadOptionsDataSource = new MatTableDataSource(this.plugloadoptions);
      this.optbDataSource = new MatTableDataSource(this.plugLoadGuide);
      this.optcDataSource = new MatTableDataSource(this.plugLoadPredefined);
    });
  }


  onChangePlugLoadOption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('plugLoadArray')).removeAt(0);
    if (event.value == 1) {
      (<FormArray>this.formgroup.get('plugLoadArray')).push(this.fb.group({
        plugLoadValueKnown: ['', Validators.required],
        plugLoadUnits: ['', Validators.required],
      }));
    } else if (event.value == 2) {

      for (var plugloadguide of this.plugLoadGuide) {
        this.plugLoadItems.push(this.createItem(plugloadguide));
        console.log(this.plugLoadItems);
      }
      (<FormArray>this.formgroup.get('plugLoadArray')).push(this.plugLoadItems);
      
    } else if (event.value == 3) {
      (<FormArray>this.formgroup.get('plugLoadArray')).push(this.fb.group({
        plugLoadValueKnown: ['', Validators.required],
        plugLoadUnits: ['', Validators.required],
      }));
    }

    console.log(this.formgroup.get('plugLoadArray')['controls'][0].controls[0].controls.avgoperatinghrs.value);
  }
  createItem(plugloadguide): FormGroup {
    console.log(plugloadguide);
    return this.fb.group({
      space: [{ value: plugloadguide.space, disabled: true }],
      plugloadappliance: [{ value: plugloadguide.plugloadappliance, disabled: true }],
      yearofinstallation: [plugloadguide.yearofinstallation],
      avgpowerwatts: [plugloadguide.avgpowerwatts],
      stock: [plugloadguide.stock],
      avgoperatinghrs: [plugloadguide.avgoperatinghrs]
    });
  }
  onChangeAvailbePlugLoad(event) {
    if (event.value == 3) {
      console.log(event);

    }
  }

  selectedPlugload($event: any, row: PlugLoadAvailableTable) {
    this.formgroup.controls.plugLoadValueKnown.patchValue(row.avgpplwperm2);
    console.log("clicked", $event);
    console.log(row);
  }

  calculatePlugLoad(): void {
    if (this.formgroup.valid) {
      var plugLoadArray: PlugLoadGuideTable[] = [];
      console.log(this.formgroup.get('plugLoadArray')['controls'][0].controls);
      for (var plugloadgroup of this.formgroup.get('plugLoadArray')['controls'][0].controls) {
        console.log(plugloadgroup.controls.yearofinstallation.value);
          if(plugloadgroup.controls.plugloadappliance.value != '' && plugloadgroup.controls.space.value != '') {
            var plugLoadGuide: PlugLoadGuideTable = {
              space: plugloadgroup.controls.space.value,
              plugloadappliance: plugloadgroup.controls.plugloadappliance.value,
              yearofinstallation: plugloadgroup.controls.yearofinstallation.value,
              avgpowerwatts: Number(plugloadgroup.controls.avgpowerwatts.value),
              stock: Number(plugloadgroup.controls.stock.value),
              avgoperatinghrs: Number(plugloadgroup.controls.avgoperatinghrs.value)
            }
            plugLoadArray.push(plugLoadGuide);
            console.log("data"+plugLoadGuide.toString());
        }
      }
      var payload: any = {
        "buildinggrossarea": Number(this.grossAreaValue),
        "buildinggrossareaunit": this.grossAreaValueUnits,
        "plugloaddensitydata": plugLoadArray
      }
      this.beetService.postCalculatePlugLoad(payload).subscribe(res => {
        console.log(res)
      });
    } else {
      this.submitted = true;
    }
    console.log(this.formgroup, this.formgroup.valid)

  }



}
