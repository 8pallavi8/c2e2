import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';
import { OuterwallAdvLevelAirComponent } from 'src/app/shared/outerwall-adv-level-air/outerwall-adv-level-air.component';
import { OuterwallAdvLevelbrickComponent } from 'src/app/shared/outerwall-adv-levelbrick/outerwall-adv-levelbrick.component';
import { example, OuterwallRadvancedleveldialogComponent } from 'src/app/shared/outerwall-radvancedleveldialog/outerwall-radvancedleveldialog.component';
import { RvalueImagedialogComponent } from 'src/app/shared/rvalue-imagedialog/rvalue-imagedialog.component';
import { beetService } from 'src/app/shared/services/beet.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { WindowRdialogComponent } from 'src/app/shared/window-rdialog/window-rdialog.component';

@Component({
  selector: 'app-buildingenvelopedetails',
  templateUrl: './buildingenvelopedetails.component.html',
  styleUrls: ['./buildingenvelopedetails.component.scss']
})
export class BuildingenvelopedetailsComponent implements OnInit {

  @Input() countryCode: string;
  formgroup: FormGroup;
  outerWallRValue: number;
  RoofRValue: number;
  windowRValue: number;
  hasSHGC: boolean = false;
  hasWWR: boolean = false;
  SHGC: number;
  rimage: string[] = ["http://localhost:4200/assets/images/rvalue.png", "http://localhost:4200/assets/images/rvalue.png"]
  selCountryCode: string;
  layersList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  elementsList = ["Camara de aire", "Ladrillo comun-picture options", "Select more from list of materials"]
  displayedColumns: string[] = [
    'Layer',
    'Capadelelementoconstructivo',
    'Espesordecadacapa',
    'Resistenciatermica'
  ];
  ExampleTable: example[] = [
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial exterior', Espesordecadacapa: null, Resistenciatermica: 0.04 },
    { Layer: 1, Capadelelementoconstructivo: 'Revoque', Espesordecadacapa: 0.015, Resistenciatermica: 0.013 },
    { Layer: 2, Capadelelementoconstructivo: 'Ladrillo comun	', Espesordecadacapa: 0.12, Resistenciatermica: 0.13 },
    { Layer: 3, Capadelelementoconstructivo: 'Camara de aire', Espesordecadacapa: 0.05, Resistenciatermica: 0.17 },
    { Layer: 4, Capadelelementoconstructivo: 'Ladrillo comun', Espesordecadacapa: 0.12, Resistenciatermica: 0.13 },
    { Layer: 5, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 6, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 7, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 8, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 9, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 10, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial interior', Espesordecadacapa: null, Resistenciatermica: 0.13 },
    { Layer: null, Capadelelementoconstructivo: 'Total', Espesordecadacapa: 0.305, Resistenciatermica: 0.613 },
  ];
  dataSource = new MatTableDataSource(this.ExampleTable);
  constructor(private fb: FormBuilder,
    private inputDialog: InputdialogService,
    public dialog: MatDialog,
    private beetService: beetService) { }

  ngOnInit(): void {
    
    this.formgroup = this.fb.group({
      outerwallr: ['', Validators.compose([Validators.required])],
      roofr: ['', Validators.compose([Validators.required])],
      windowr: ['', Validators.compose([Validators.required])],
      SHGC: ['', Validators.compose([Validators.required])],
      wwr: ['', Validators.compose([Validators.required])]
    })
    this.formgroup.get('SHGC').valueChanges.pipe(debounceTime(1000)).subscribe((changes) => {
      this.SHGC = changes;
      console.log(changes);
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
  }

  public openOuterWallR() {
    this.inputDialog.entervalue('R Value-Outer Wall',
      'I know the R value of the outer wall for my building.',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'R value in [sqmt.°C/W]:',
      'R value in [sqft.°F/BTU]:')
      .then((confirmed) => { this.outerWallRValue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }

  public openOuterWallImagesR() {
    const dialogref = this.dialog.open(OuterwallAdvLevelbrickComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.outerWallRValue = result;
      console.log(result);
    });
  }


  public openOuterWallAdvancedR() {
    const dialogref = this.dialog.open(OuterwallRadvancedleveldialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.outerWallRValue = result;
      console.log(result);
    });
  }

  public openRoofR() {
    this.inputDialog.entervalue('R Value-Roof',
      'I know the R value of the Roof for my building.',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'R value in [sqmt.°C/W]:',
      'R value in [sqft.°F/BTU]:')
      .then((confirmed) => { this.RoofRValue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }

  public openRoofImagesR() {
    const dialogref = this.dialog.open(RvalueImagedialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.RoofRValue = result;
      console.log(result);
    });
  }


  public openWindowR() {
    this.inputDialog.entervalue('R Value-Window',
      'I know the R value of the Window for my building.',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'R value in [sqmt.°C/W]:',
      'R value in [sqft.°F/BTU]:')
      .then((confirmed) => { this.windowRValue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }

  public openWindowPredefinedR() {
    const dialogref = this.dialog.open(WindowRdialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.windowRValue = result;
      console.log(result);
    });

  }

  showSHGC(state: boolean): void {
    if (state == true) {
      this.hasSHGC = true;
      this.SHGC = 0;
    }
    else {
      this.hasSHGC = false;
      this.SHGC = 0.25;
    }
  }

  showWWR(state: boolean): void {
    if (state == true)
      this.hasWWR = true;
    else
      this.hasWWR = false;
  }

}
