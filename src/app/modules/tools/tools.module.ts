import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisTransformerComponent } from './distribution-transformer/distribution-transformer.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from './distribution-transformer/newtransformer-dialog/distribution-transformer-dialog';

const routes: Routes = [
  {
      path: '',
      component: DisTransformerComponent
  }
];


@NgModule({
  declarations: [DisTransformerComponent,DialogOverviewExampleDialog],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ]
})
export class ToolsModule { }
