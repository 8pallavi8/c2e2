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
	avgoperatinghrs?:number
}

export interface PlugLoadOptionsTable {
  plugloadops: string[];
  options?:string;
  quantity?: number;
}


@Component({
  selector: 'app-plugloads',
  templateUrl: './plugloads.component.html',
  styleUrls: ['./plugloads.component.scss']
})

export class PlugloadsComponent implements OnInit {
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
  displayOptBColumns = ["space","plugloadappliance","Yearofinstallation","Average Power","Connected stock of equipment","Average operating hours per day"];
  optcDataSource: MatTableDataSource<PlugLoadAvailableTable>;
  optbDataSource: MatTableDataSource<PlugLoadGuideTable>;
  plugloadOptionsDataSource:MatTableDataSource<PlugLoadOptionsTable>;
  plugloadoptions:PlugLoadOptionsTable[];
  grossAreaValue:number;
  grossAreaValueUnits:string;
  plugLoadItem: FormArray;
  plugLoadForms: FormGroup;


  constructor(private fb: FormBuilder, public dialog: MatDialog, private inputDialog: InputdialogService,
    private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      plugLoadArray: this.fb.array([]),
      plugLoadValueKnown: ['', Validators.compose([Validators.required])],
      plugLoadUnits: ['', Validators.compose([Validators.required])]
    }
    );
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      this.plugLoadPredefined = res.success.plugloadoptctable;
      this.plugLoadGuide = res.success.plugloadoptbtable;
      this.plugloadoptions=res.success.plugloadoperations;
      this.beetService.getBuildingGrossArea().subscribe(res => { this.grossAreaValue = res;});
      this.beetService.getBuildingGrossAreaUnits().subscribe(res => { this.grossAreaValueUnits = res;});
      this.plugloadOptionsDataSource=new MatTableDataSource(this.plugloadoptions);
      this.optbDataSource = new MatTableDataSource(this.plugLoadGuide);
      this.optcDataSource = new MatTableDataSource(this.plugLoadPredefined);
    });
  }


  onChangePlugLoadOption(event: MatRadioChange) {
    console.log(this.formgroup.get('plugLoadArray'));
    (<FormArray>this.formgroup.get('plugLoadArray')).clear()
    console.log("change : "+event.value);
    if (event.value == 1) {
      (<FormArray>this.formgroup.get('plugLoadArray')).push(this.fb.group({
        plugLoadValueKnown: ['', Validators.required],
        plugLoadUnits: ['', Validators.required],
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('plugLoadArray')).push(this.fb.group({
       plugloadsItems: this.fb.array([  this.createItem(this.plugLoadGuide[0])]),
      }));
      for (var plugloadguide of this.plugLoadGuide) {
        console.log(plugloadguide);
        (<FormArray>(<FormGroup>(<FormArray>this.formgroup.get('plugLoadArray')).at(0)).controls.plugloadsItems).push(this.createItem(plugloadguide));
      }

    } else if (event.value == 3) {
      (<FormArray>this.formgroup.get('plugLoadArray')).push(this.fb.group({
        plugLoadValueKnown: ['', Validators.required],
        plugLoadUnits: ['', Validators.required],
      }));
    }

    console.log((<FormArray>(<FormGroup>(<FormArray>this.formgroup.get('plugLoadArray')).at(0)).controls.plugloadsItems));
  }
  createItem(plugloadguide): FormGroup {
    return this.fb.group({
      space: plugloadguide.space,
      plugloadappliance: plugloadguide.plugloadappliance,
      yearofinstallation: plugloadguide.yearofinstallation,
      avgpowerwatts:plugloadguide.avgpowerwatts,
      totalareaft2:plugloadguide.stock,
      totalaream2:plugloadguide.avgoperatinghrs


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
    var payload: any = {
      "buildinggrossarea": this.grossAreaValue ,
      "buildinggrossareaunit": this.grossAreaValueUnits ,
      "plugloaddensitydata":this.plugLoadGuide
    }
    console.log(this.plugLoadGuide);
    console.log(payload);
    this.beetService.postCalculatePlugLoad(payload).subscribe(res => {
      console.log(res)
    });
  }



}
