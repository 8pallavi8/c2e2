import { Component, Input, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from 'src/app/shared/services/beet.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { BEETComponent } from '../beet.component';
import { GendetailsComponent } from '../gendetails/gendetails.component';

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
  formgroup: FormGroup;
  displayedColumns = ['plugloadops', 'options', 'quantity'];
  selectionOptions = ['Yes', 'No', 'NA'];
  plugloadOptionsDataSource: MatTableDataSource<PlugLoadOptionsTable>;
  plugloadoptions: PlugLoadOptionsTable[];
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
  grossAreaValue: number;
  grossAreaValueUnits: string;
  plugLoadItems: FormArray = this.fb.array([]);
  plugLoadSimpleGroupForm: FormGroup;
  beetComponent: BEETComponent;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      plugLoadValueKnown: ['', Validators.required],
      plugLoadUnits: ['', Validators.required],
      plugLoadArray: this.fb.array([]),
      plugLoadOptionsArray: this.fb.array([]),
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; });
    this.beetComponent = this.beetService.getBEETParentComponent();
    this.beetService.getGeneralDetails().subscribe(res => {
      this.plugLoadPredefined = res.success.plugloadoptctable;
      this.plugLoadGuide = res.success.plugloadoptbtable;
      this.optbDataSource = new MatTableDataSource(this.plugLoadGuide);
      this.optcDataSource = new MatTableDataSource(this.plugLoadPredefined);
      this.plugloadoptions = res.success.plugloadoperations;
      console.log("ops"+this.plugloadoptions);
      if((<FormArray>this.formgroup.get('plugLoadOptionsArray')).length == 0 ){
        for (var plugloadoption of this.plugloadoptions) {
          (<FormArray>this.formgroup.get('plugLoadOptionsArray')).push(this.createOptions(plugloadoption));
        } 
      }
       
      this.plugloadOptionsDataSource = new MatTableDataSource(this.plugloadoptions);
    });

    if (sessionStorage.getItem('plugloadDetails') !== null) {
      var plugloadDetails = JSON.parse(sessionStorage.getItem('plugloadDetails'));
      var plugloadArrayTemp = plugloadDetails.plugLoadArray;
    
      if (plugloadDetails !== undefined || plugloadDetails !== null) {
        this.formgroup.patchValue(plugloadDetails);
      }
      this.changeFormFieldValues(plugloadArrayTemp);
      
    }
   
  }

  createOptions(plugloadoptions) {
    return this.fb.group({
      operation: [plugloadoptions.plugloadops],
      operationresponse: [plugloadoptions.options],
      quantity: [plugloadoptions.quantity],
    })
  }

  onChangePlugLoadOption(event: MatRadioChange) {
    if (event.value == 2) {
      this.changeFormFieldValues(this.plugLoadGuide);
    }
  }
  changeFormFieldValues(plugLoadGuideTemp) {
    if ((<FormArray>this.formgroup.get('plugLoadArray')).length == 0) {
      for (var plugloadguide of plugLoadGuideTemp) {
        plugloadguide.stock = 0;
        (<FormArray>this.formgroup.get('plugLoadArray')).push(this.createItem(plugloadguide));
      }
    }
  }


  createItem(plugloadguide): FormGroup {
    return this.fb.group({
      space: [{ value: plugloadguide.space, disabled: plugloadguide.space != '' }],
      plugloadappliance: [{ value: plugloadguide.plugloadappliance, disabled: plugloadguide.plugloadappliance != '' }],
      yearofinstallation: [plugloadguide.yearofinstallation],
      avgpowerwatts: [plugloadguide.avgpowerwatts],
      stock: [plugloadguide.stock, Validators.required],
      avgoperatinghrs: [plugloadguide.avgoperatinghrs]
    });
  }

  onChangeAvailbePlugLoad(event) {
    if (event.value == 3) {
    }
  }

  selectedPlugload($event: any, row: PlugLoadAvailableTable) {
    this.formgroup.controls.plugLoadValueKnown.patchValue(row.avgpplwperm2);
    this.formgroup.controls.plugLoadUnits.setValue('watts per square meter');
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
      "netoccupiedarea": Number(this.beetComponent.genDetailsComponent.genDetailsForm.controls.netOccupiedFloorArea.value),
      "netoccupiedareaunit": this.beetComponent.genDetailsComponent.genDetailsForm.controls.netAreaUnits.value,
      "plugloaddensitydata": plugLoadArray,
      "occupancyhrsperweek":this.beetComponent.genDetailsComponent.genDetailsForm.controls.occupanyHoursPerWeek.value
    }
    this.beetService.postCalculatePlugLoad(payload).subscribe(res => {
      this.formgroup.controls.plugLoadValueKnown.patchValue(res.success.pluloaddensity);
      this.formgroup.controls.plugLoadUnits.patchValue(res.success.pluloaddensityunit);
    });
  }
}
