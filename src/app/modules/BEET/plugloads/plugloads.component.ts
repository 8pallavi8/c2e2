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

@Component({
  selector: 'app-plugloads',
  templateUrl: './plugloads.component.html',
  styleUrls: ['./plugloads.component.scss']
})

export class PlugloadsComponent implements OnInit {
  formgroup: FormGroup;
  displayedColumns = ['operations', 'options', 'quantity'];
  selectionOptions = ['Yes', 'No', 'NA'];
  plugloadvalue: number;
  plugLoadUnits: string = 'watts per square meter';
  OPTIONS_DATA: OPTIONS[] = [
    { operations: 'Do you remove underused refrigerators ?', options: '', quantity: 0 },
    { operations: 'Do you replace inefficient refrigerators with most efficient one regularly ?', options: '', quantity: 0 },
    { operations: 'Do you have shared full sized refrigerators instead of personal mini refrigerators ?', options: '', quantity: 0 },
    { operations: 'Do you have glass front refrigerators?', options: '', quantity: 0 },
    { operations: 'Do you upgrade your coffee machines, toasters, microwaves and other similar loads based on its operating condition status indicated on its screen or LED indicators?', options: '', quantity: 0 },
    { operations: 'Do you have timers to power down your plug loads during non-businees hours ?', options: '', quantity: 0 },
    { operations: 'Do you remove underused vending machines ?', options: '', quantity: 0 },
    { operations: 'Do you remove aged and inefficient vending machines ?', options: '', quantity: 0 },
    { operations: 'Do you have load management devices ?', options: '', quantity: 0 },
    { operations: 'Do you remove or disconnect coolers from water coolers and drinking fountains when cooling is not required (for eg. Seasonal)', options: '', quantity: 0 },
    { operations: 'Did you replace old standard desktop computers with efficient mini desktops and laptop computers ?', options: '', quantity: 0 },
    { operations: 'Do you disable screensavers and enable computer power management settings to attain standby mode after 15 minutes of inactivity or idle time ?', options: '', quantity: 0 },
    { operations: 'Do you have CRT monitors for your computers (not LED backlit LCD monitors)', options: '', quantity: 0 },
    { operations: 'Do you have fluorescent backlit LCD monitors for your computers (not LED backlit LCD monitors)', options: '', quantity: 0 },
    { operations: 'Do you have shared multifunction devices (not multiple personal devices such as computer systems, phones, printers etc.)', options: '', quantity: 0 },
    { operations: 'Do you have any standard phones (not the latest VoIP phones) ?', options: '', quantity: 0 },
    { operations: 'Do you have incandescent type task lighting or desk lighting ?', options: '', quantity: 0 },
    { operations: 'Do you disable screensavers and enable computer power management settings for these shared multifunction devices to attain standby mode after 15 minutes of inactivity or idle time?', options: '', quantity: 0 },
    { operations: 'Do you control elevator lighting and ventilation with occupancy sensors?', options: '', quantity: 0 },

  ];
  dataSource = new MatTableDataSource(this.OPTIONS_DATA);
  dialogref: any;
  selCountryCode: string;
  selecteditems: string[];
  availablePlugLoaddataSource: MatTableDataSource<PlugLoadGuideTable> ; 
  guidePlugLoaddataSource:any;
  plugLoadPredefined: PlugLoadAvailableTable[];
  plugLoadGuide:PlugLoadGuideTable[];
  selectedElement:PlugLoadAvailableTable;
  displayOPTCColumns = ["buildingtype","avgpplwperft2","avgpplwperm2","totalareaft2","totalaream2"];
  
  

 optcDataSource : MatTableDataSource<PlugLoadAvailableTable> ; 
   
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
      
      this.availablePlugLoaddataSource = new MatTableDataSource(this.plugLoadGuide);
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

  public openPlugLoad() {
    this.inputDialog.entervalue('Plug Loads',
      'I know the PlugLoad density value of the outer wall for my building.',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'Plug Load density value in [Watts per square meter]:',
      'Plug Load density value in [Watts per square foot]:')
      .then((confirmed) => { this.plugloadvalue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }

  openAvailableValDialog() {
    const dialogref = this.dialog.open(PlugloadavailablevaldialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.plugloadvalue = result;
      console.log(result);
    });
  }

}
