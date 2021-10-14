import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { OuterwallAdvLevelAirComponent } from 'src/app/shared/outerwall-adv-level-air/outerwall-adv-level-air.component';
import { OuterwallAdvLevelbrickComponent } from 'src/app/shared/outerwall-adv-levelbrick/outerwall-adv-levelbrick.component';
import { OuterwallRadvancedleveldialogComponent } from 'src/app/shared/outerwall-radvancedleveldialog/outerwall-radvancedleveldialog.component';
import { RvalueImagedialogComponent } from 'src/app/shared/rvalue-imagedialog/rvalue-imagedialog.component';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { WindowRdialogComponent } from 'src/app/shared/window-rdialog/window-rdialog.component';

@Component({
  selector: 'app-buildingenvelopedetails',
  templateUrl: './buildingenvelopedetails.component.html',
  styleUrls: ['./buildingenvelopedetails.component.scss']
})
export class BuildingenvelopedetailsComponent implements OnInit {
  formgroup: FormGroup;
  outerWallRValue: number;
  RoofRValue: number;
  windowRValue: number;
  hasSHGC: boolean = false;
  hasWWR: boolean = false;
  SHGC: number;
  rimage: string[] = ["http://localhost:4200/assets/images/rvalue.png", "http://localhost:4200/assets/images/rvalue.png"]


  constructor(private fb: FormBuilder,
    private inputDialog: InputdialogService,
    public dialog: MatDialog) { }

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
