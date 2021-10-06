import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OuterwallRadvancedleveldialogComponent } from 'src/app/shared/outerwall-radvancedleveldialog/outerwall-radvancedleveldialog.component';
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


  constructor(private fb: FormBuilder,
    private inputDialog: InputdialogService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      outerwallr: ['', Validators.compose([Validators.required])],
      roofr: ['', Validators.compose([Validators.required])],
      windowr: ['', Validators.compose([Validators.required])],
      shgcwindow: ['', Validators.compose([Validators.required])],
      wwr: ['', Validators.compose([Validators.required])]
    })
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


  public openOuterWallAdvancedR(){
    const dialogref = this.dialog.open(OuterwallRadvancedleveldialogComponent,{
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.outerWallRValue= result;
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

 public openWindowPredefinedR(){
    const dialogref = this.dialog.open(WindowRdialogComponent,{
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.windowRValue= result;
      console.log(result);
    }); 

  }

  

  showSHGC(state: boolean): void {
    if (state == true)
      this.hasSHGC = true;
    else
      this.hasSHGC = false;
  }

  showWWR(state: boolean): void {
    if (state == true)
      this.hasWWR = true;
    else
      this.hasWWR = false;
  }

}
