import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreetLightComponent } from './street-light.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
      path: '',
      component:StreetLightComponent
  }
];

@NgModule({
  declarations: [StreetLightComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StreetLightModule { }
