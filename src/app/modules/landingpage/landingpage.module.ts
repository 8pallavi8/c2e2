import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage.component';
import {MatGridListModule} from '@angular/material/grid-list';

const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent
  }
];

@NgModule({
  declarations: [LandingpageComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    RouterModule.forChild(routes)
  ],
  exports: [

  ]
})
export class LandingpageModule { }
