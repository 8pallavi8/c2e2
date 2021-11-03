import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  plugLoadSimpleGroupForm:FormGroup;


  constructor(private fb: FormBuilder, public dialog: MatDialog, private inputDialog: InputdialogService,
    private beetService: beetService) { }


  ngOnInit(): void {
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      plugLoadValueKnown: ['', Validators.required],
      plugLoadUnits: ['', Validators.required],
      plugLoadArray: this.fb.array([]),
    });
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
    //(<FormArray>this.formgroup.get('plugLoadArray')).removeAt(0);
   if (event.value == 2) {



      
      for (var plugloadguide of this.plugLoadGuide) {
        plugloadguide.stock = 0;
        (<FormArray>this.formgroup.get('plugLoadArray')).push(this.createItem(plugloadguide));
        //console.log(this.plugLoadItems);
      }

      (<FormArray>this.formgroup.get('plugLoadArray')).controls.forEach((element, index) => {
        //console.log(element, index);
        if ((<FormGroup>element).controls.space.value !== '') {
          (<FormGroup>element).controls.space.disable();
        }
        if ((<FormGroup>element).controls.plugloadappliance.value !== '') {
          (<FormGroup>element).controls.plugloadappliance.disable();
        }
      }); 
      //(<FormArray>this.formgroup.get('plugLoadArray')).push(this.plugLoadItems);

    }

    //console.log(this.formgroup.get('plugLoadArray')['controls'][0].controls[0].controls.avgoperatinghrs.value);
  }
  createItem(plugloadguide): FormGroup {
    console.log(plugloadguide);
    return this.fb.group({
      space: [plugloadguide.space],
      plugloadappliance: [plugloadguide.plugloadappliance],
      yearofinstallation: [plugloadguide.yearofinstallation],
      avgpowerwatts: [plugloadguide.avgpowerwatts],
      stock: [plugloadguide.stock, Validators.required],
      avgoperatinghrs: [plugloadguide.avgoperatinghrs]
    });
  }
  onChangeAvailbePlugLoad(event) {
    if (event.value == 3) {
      console.log(event);
    }
  }

  selectedPlugload($event: any, row: PlugLoadAvailableTable) {
    //(<FormGroup> (<FormArray>this.formgroup.get('plugLoadArray')).at(0)).controls.plugLoadValueKnown.patchValue(row.avgpplwperm2)
    this.formgroup.controls.plugLoadValueKnown.patchValue(row.avgpplwperm2);
    this.formgroup.controls.plugLoadUnits.setValue('watts per square meter');
    console.log("clicked", $event);
    console.log(row);
  }

  calculatePlugLoad(): void {
 
      var plugLoadArray: PlugLoadGuideTable[] = [];
      (<FormArray>this.formgroup.get('plugLoadArray')).controls.forEach((element, index) => {
        if ((<FormGroup>element).controls.plugloadappliance.value != '' && ((<FormGroup>element).controls.space.value != '')) {
          var plugLoadGuide: PlugLoadGuideTable = {
            space: (<FormGroup>element).controls.space.value,
            plugloadappliance: (<FormGroup>element).controls.plugloadappliance.value,
            yearofinstallation: (<FormGroup>element).controls.yearofinstallation.value,
            avgpowerwatts: Number((<FormGroup>element).controls.avgpowerwatts.value),
            stock: Number((<FormGroup>element).controls.stock.value),
            avgoperatinghrs: Number((<FormGroup>element).controls.avgoperatinghrs.value)
          }
          plugLoadArray.push(plugLoadGuide);
        }
      }); 
      var payload: any = {
        "buildinggrossarea": Number(this.grossAreaValue),
        "buildinggrossareaunit": this.grossAreaValueUnits,
        "plugloaddensitydata": plugLoadArray
      }
      this.beetService.postCalculatePlugLoad(payload).subscribe(res => {
       this.formgroup.controls.plugLoadValueKnown.patchValue(res.success.pluloaddensity);
        this.formgroup.controls.plugLoadUnits.patchValue(res.success.pluloaddensityunit);

        console.log(res)
      });
  
    console.log(this.formgroup, this.formgroup.valid)
  }



}
