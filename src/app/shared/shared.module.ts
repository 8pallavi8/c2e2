import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogService } from './services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './deleteconfirmationdialog/deleteconfirmationdialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DialogComponent } from './dialog/dialog.component';
import { PlugloadinputdialogComponent } from './plugloadinputdialog/plugloadinputdialog.component';
import { PlugloadavailablevaldialogComponent } from './plugloadavailablevaldialog/plugloadavailablevaldialog.component';
import {textfieldsdialogComponent } from './textfieldsdialog/textfieldsdialog.component';
import { WindowRdialogComponent } from './window-rdialog/window-rdialog.component';
import { OuterwallRadvancedleveldialogComponent } from './outerwall-radvancedleveldialog/outerwall-radvancedleveldialog.component';
import { RouterModule } from '@angular/router';
import { RvalueImagedialogComponent } from './rvalue-imagedialog/rvalue-imagedialog.component';
import { RoofradvancedComponent } from './roofradvanced/roofradvanced.component';
import { HeaderTwoComponent } from './header-two/header-two.component';
import { FooterTwoComponent } from './footer-two/footer-two.component';



@NgModule({
  declarations: [
    HeaderComponent,
    HeaderTwoComponent,
    FooterComponent,
    PieChartComponent,
    BarChartComponent,
    DialogComponent,
    ConfirmationDialogComponent,
    PlugloadinputdialogComponent,
    PlugloadavailablevaldialogComponent,
    textfieldsdialogComponent,
    WindowRdialogComponent,
    OuterwallRadvancedleveldialogComponent,
    RvalueImagedialogComponent,
    RoofradvancedComponent,
    FooterTwoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule,
    MatDialogModule,
    RouterModule
    ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule,
    PieChartComponent,
    BarChartComponent,
    MatDialogModule,
    ConfirmationDialogComponent,
    DialogComponent,
    PlugloadinputdialogComponent,
    PlugloadavailablevaldialogComponent,
    textfieldsdialogComponent,
    WindowRdialogComponent,
    OuterwallRadvancedleveldialogComponent,
    RvalueImagedialogComponent,
    RoofradvancedComponent,
    HeaderTwoComponent,
    FooterTwoComponent
  ],
  
  // If Service do not have Provider == root then add the below code to use the service by other components.
  providers: [ ConfirmationDialogService,NgbActiveModal ],
  entryComponents: [ ConfirmationDialogComponent ],
})
export class SharedModule { }
