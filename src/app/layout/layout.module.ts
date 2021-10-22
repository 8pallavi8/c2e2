import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';

const routes: Routes = [
  {
      path: '',
      component: AppLayoutComponent
  }
];
@NgModule({
  declarations: [AppLayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    AppRoutingModule,
    RouterModule.forChild(routes)
  ],
  exports : [AppLayoutComponent],
})
export class LayoutModule { }
