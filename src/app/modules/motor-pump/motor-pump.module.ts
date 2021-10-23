import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorPumpComponent } from './motor-pump.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes= [
  {
      path: '',
      component:MotorPumpComponent
  }
];

@NgModule({
  declarations: [MotorPumpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MotorPumpModule { }
