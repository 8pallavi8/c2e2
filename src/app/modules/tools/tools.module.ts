import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisTransformerComponent } from './distribution-transformer/distribution-transformer.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from './distribution-transformer/newtransformer-dialog/distribution-transformer-dialog';
import { FormHeaderComponent } from './distribution-transformer/form-header/form-header.component';
import { BEETComponent } from './BEET/beet.component';
import { GendetailsComponent } from './BEET/gendetails/gendetails.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';



const routes: Routes = [
  {
    path: 'tools',
    loadChildren: () => import('./distribution-transformer/distribution-transformer.module').then(m => m.DistributionTransformerModule)
  },
  {
    path: 'tool5',
    loadChildren: () => import('./BEET/BEET.module').then(m => m.BEETModule)
  },
  {
    path: '',
    loadChildren: () => import('./distribution-transformer/distribution-transformer.module').then(m => m.DistributionTransformerModule)
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatStepperModule,
    RouterModule.forChild(routes),
  ]
})
export class ToolsModule { }
