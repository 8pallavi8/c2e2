import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisTransformerComponent } from './distribution-transformer.component';
import { DialogOverviewExampleDialog } from './newtransformer-dialog/distribution-transformer-dialog';
import { FormHeaderComponent } from './form-header/form-header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DisTransformerComponent
  }
];


@NgModule({
  declarations: [DisTransformerComponent, DialogOverviewExampleDialog, FormHeaderComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    RouterModule.forChild(routes),
  ]
})
export class DistributionTransformerModule { }
