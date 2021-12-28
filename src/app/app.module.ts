import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { ConfirmationDialogService } from './shared/services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './shared/deleteconfirmationdialog/deleteconfirmationdialog.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { OuterwallAdvLevelAirComponent } from './shared/outerwall-adv-level-air/outerwall-adv-level-air.component';
import { OuterwallAdvLevelbrickComponent } from './shared/outerwall-adv-levelbrick/outerwall-adv-levelbrick.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BeetreportComponent } from './modules/BEET/beetreport/beetreport.component';
import { BeetreportpdfComponent } from './shared/beetreportpdf/beetreportpdf.component';



@NgModule({

  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    SharedModule,
    LayoutModule
  ],
  declarations: [
    AppComponent,
    AutoFocusDirective,
    OuterwallAdvLevelAirComponent,
    OuterwallAdvLevelbrickComponent,

  ],
  providers: [ConfirmationDialogService,NgbActiveModal],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
