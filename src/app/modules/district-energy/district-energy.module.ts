import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistrictEnergyComponent } from './district-energy.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
      path: '',
      component:DistrictEnergyComponent
  }
];


@NgModule({
  declarations: [DistrictEnergyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class DistrictEnergyModule { }
