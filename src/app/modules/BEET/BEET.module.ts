import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GendetailsComponent } from './gendetails/gendetails.component';
import { BEETComponent } from './beet.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { BuildingenvelopedetailsComponent } from './buildingenvelopedetails/buildingenvelopedetails.component';
import { LightingComponent } from './lighting/lighting.component';
import { MatInputModule } from '@angular/material/input';
import { HvacComponent } from './hvac/hvac.component';
import { PlugloadsComponent } from './plugloads/plugloads.component';
import { CO2EmissionsComponent } from './co2-emissions/co2-emissions.component';
import { LogoFooterComponent } from './logo-footer/logo-footer.component';
import { BeetreportComponent } from './beetreport/beetreport.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';


const routes: Routes = [
  {
      path: '',
      component:BEETComponent
  }
];


@NgModule({
  declarations: [GendetailsComponent,BEETComponent,BuildingenvelopedetailsComponent,LightingComponent,HvacComponent,PlugloadsComponent,CO2EmissionsComponent,LogoFooterComponent,BeetreportComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
  ]
})

export class BEETModule { }
