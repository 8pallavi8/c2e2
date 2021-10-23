import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterSupplyComponent } from './water-supply.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: WaterSupplyComponent
  }
];
@NgModule({
  declarations: [WaterSupplyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class WaterSupplyModule { }
