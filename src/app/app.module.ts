import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { ConfirmationDialogService } from './shared/services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './shared/deleteconfirmationdialog/deleteconfirmationdialog.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { LightingComponent } from './modules/tools/BEET/lighting/lighting.component';

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
    FormHeaderComponent,
    AutoFocusDirective
  ],
  providers: [ConfirmationDialogService],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
