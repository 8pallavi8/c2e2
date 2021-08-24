import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      {
        path: 'tools',
        loadChildren: () => import('./modules/tools/tools.module').then(m => m.ToolsModule)
      },
      {
        path: '',
        redirectTo: 'tools',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'tools',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
