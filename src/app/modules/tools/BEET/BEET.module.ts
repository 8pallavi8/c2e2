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


const routes: Routes = [
  {
      path: '',
      component:BEETComponent
  }
];


@NgModule({
  declarations: [GendetailsComponent,BEETComponent,BuildingenvelopedetailsComponent,LightingComponent,HvacComponent,PlugloadsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatStepperModule,
    MatInputModule,
    RouterModule.forChild(routes),
  ]
})
export class BEETModule { }
