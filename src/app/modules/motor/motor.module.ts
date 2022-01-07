import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorComponent } from './motor.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '',
      component:MotorComponent
  }
];

@NgModule({
  declarations: [MotorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MotorModule { }
