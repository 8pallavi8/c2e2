import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { beetService } from 'src/app/shared/services/beet.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';

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
  plugLoadForms: FormGroup;
  plugLoadSimpleGroupForm:FormGroup;


  constructor(private fb: FormBuilder, public dialog: MatDialog, private inputDialog: InputdialogService,
    private beetService: beetService) { }


  ngOnInit(): void {
    console.log("tests ");
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      plugLoadValueKnown: ['', Validators.required],
      plugLoadUnits: ['', Validators.required],
      plugLoadArray: this.fb.array([]),
      plugLoadOptionsArray: this.fb.array([]),
      
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; });

    console.log("PLUG LOAD OPTIONS "+sessionStorage.getItem('plugloadDetails') )

    if(sessionStorage.getItem('plugloadDetails') !== null){
      var plugloadDetails = JSON.parse(sessionStorage.getItem('plugloadDetails'));
      var plugloadoptionsTemp = plugloadDetails.plugLoadArray;
      //console.log(plugloadoptionsTemp);
      //this.plugloadOptionsDataSource = new MatTableDataSource(plugloadoptionsTemp);
      this.changeFormFieldValues(plugloadoptionsTemp);
    } else{
      this.beetService.getGeneralDetails().subscribe(res => {
        this.beetService.getBuildingGrossArea().subscribe(res => { this.grossAreaValue = res; });
        this.beetService.getBuildingGrossAreaUnits().subscribe(res => { this.grossAreaValueUnits = res; });
        this.plugLoadPredefined = res.success.plugloadoptctable;
        this.plugLoadGuide = res.success.plugloadoptbtable; 
        this.optbDataSource = new MatTableDataSource(this.plugLoadGuide);
        this.optcDataSource = new MatTableDataSource(this.plugLoadPredefined);
        this.plugloadoptions = res.success.plugloadoperations;
        for (var plugloadoption of this.plugloadoptions) {
          (<FormArray>this.formgroup.get('plugLoadOptionsArray')).push(this.createOptions(plugloadoption));
        }
        this.plugloadOptionsDataSource = new MatTableDataSource(this.plugloadoptions); 
      });
    }


    if (sessionStorage.getItem('plugloadDetails') !== null) {
      var plugloadDetails = JSON.parse(sessionStorage.getItem('plugloadDetails'));
      if (plugloadDetails !== undefined || plugloadDetails !== null) {
        this.formgroup.patchValue(plugloadDetails);
      }
    }
  }

  createOptions(plugloadoptions){
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
  changeFormFieldValues(plugLoadGuideTemp){
    for (var plugloadguide of plugLoadGuideTemp ) {
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
    this.formgroup.controls.plugLoadValueKnown.patchValue(row.avgpplwperm2);
    console.log("patch"+ this.formgroup.controls.plugLoadValueKnown.value)
    this.formgroup.controls.plugLoadUnits.setValue('watts per square meter');
    console.log(row.avgpplwperm2);
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
