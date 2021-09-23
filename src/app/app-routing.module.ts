import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      {
        path: 'tools',
        loadChildren: () => import('./modules/tools/distribution-transformer/distribution-transformer.module').then(m => m.DistributionTransformerModule)
      },
      {
        path: 'tool5',
        loadChildren: () => import('./modules/tools/BEET/BEET.module').then(m => m.BEETModule)
      }/* ,
      {
        path: '**',
        redirectTo: 'tools',
      } */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
