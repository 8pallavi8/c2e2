import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  plugloadappliance: string[];
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

  constructor(private fb: FormBuilder, public dialog: MatDialog, private inputDialog: InputdialogService,
    private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      plugLoadValueKnown: ['', Validators.compose([Validators.required])],
      plugLoadUnits: ['', Validators.compose([Validators.required])]
    }
    );
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      this.plugLoadPredefined = res.success.plugloadoptctable;
      this.plugLoadGuide = res.success.plugloadoptbtable;
      this.plugloadoptions=res.success.plugloadoperations;
      console.log(this.plugloadoptions);
      this.plugloadOptionsDataSource=new MatTableDataSource(this.plugloadoptions);
      this.optbDataSource = new MatTableDataSource(this.plugLoadGuide);
      this.optcDataSource = new MatTableDataSource(this.plugLoadPredefined);
    });
  }


  onChangeAvailbePlugLoad(event) {
    if (event.value == 3) {
      console.log(event);
      //this.availablePlugLoaddataSource = new MatTableDataSource(this.plugLoadPredefined);
    }
  }

  selectedR($event: any, row: PlugLoadAvailableTable) {
    console.info("clicked", $event);
    console.log(row);
  }

}
